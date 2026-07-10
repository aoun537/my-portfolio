"use client";

import { gsap, SplitText } from "@/lib/gsap";

/**
 * THE shared heading interaction: live per-glyph cursor repulsion.
 * Every registered glyph is pushed away from the pointer when it comes
 * within RADIUS, with displacement growing as the cursor gets closer,
 * plus a small rotation. Released glyphs spring back home elastically.
 *
 * One engine drives every heading on the page: a single pointermove
 * listener and one gsap.ticker loop. Groups whose bounding box is far
 * from the cursor and fully settled cost one rect read per frame.
 */

const RADIUS = 150;
const PUSH = 4.6;
const SPRING = 0.085;
const DAMPING = 0.82;
const MAX_ROTATION = 16;

interface Glyph {
  el: HTMLElement;
  offsetX: number;
  offsetY: number;
  velocityX: number;
  velocityY: number;
  setX: (value: number) => void;
  setY: (value: number) => void;
  setR: (value: number) => void;
}

interface Group {
  host: HTMLElement;
  glyphs: Glyph[];
  /** True while any glyph is displaced or moving. */
  energized: boolean;
}

const groups = new Set<Group>();
const pointer = { x: -99999, y: -99999 };
let engineRunning = false;

function startEngine() {
  if (engineRunning) return;
  engineRunning = true;

  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    },
    { passive: true },
  );

  gsap.ticker.add(() => {
    for (const group of groups) {
      const hostRect = group.host.getBoundingClientRect();
      const near =
        pointer.x > hostRect.left - RADIUS &&
        pointer.x < hostRect.right + RADIUS &&
        pointer.y > hostRect.top - RADIUS &&
        pointer.y < hostRect.bottom + RADIUS;

      if (!near && !group.energized) continue;

      let energized = false;
      for (const glyph of group.glyphs) {
        /* Rect includes our own offset; subtract it to get home */
        const rect = glyph.el.getBoundingClientRect();
        const homeX = rect.left + rect.width / 2 - glyph.offsetX;
        const homeY = rect.top + rect.height / 2 - glyph.offsetY;

        if (near) {
          const dx = homeX + glyph.offsetX - pointer.x;
          const dy = homeY + glyph.offsetY - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS && dist > 0.001) {
            const falloff = 1 - dist / RADIUS;
            const force = falloff * falloff * PUSH;
            glyph.velocityX += (dx / dist) * force;
            glyph.velocityY += (dy / dist) * force;
          }
        }

        /* Damped spring back to home */
        glyph.velocityX += -glyph.offsetX * SPRING;
        glyph.velocityY += -glyph.offsetY * SPRING;
        glyph.velocityX *= DAMPING;
        glyph.velocityY *= DAMPING;
        glyph.offsetX += glyph.velocityX;
        glyph.offsetY += glyph.velocityY;

        const moving =
          Math.abs(glyph.offsetX) > 0.05 ||
          Math.abs(glyph.offsetY) > 0.05 ||
          Math.abs(glyph.velocityX) > 0.05 ||
          Math.abs(glyph.velocityY) > 0.05;

        if (moving) {
          energized = true;
          glyph.setX(glyph.offsetX);
          glyph.setY(glyph.offsetY);
          glyph.setR(
            gsap.utils.clamp(-MAX_ROTATION, MAX_ROTATION, glyph.offsetX * 0.22),
          );
        } else if (group.energized) {
          glyph.offsetX = 0;
          glyph.offsetY = 0;
          glyph.velocityX = 0;
          glyph.velocityY = 0;
          glyph.setX(0);
          glyph.setY(0);
          glyph.setR(0);
        }
      }
      group.energized = energized;
    }
  });
}

function interactionAllowed(): boolean {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Register already-split letter elements (e.g. the hero's letter spans)
 * for cursor repulsion. Uses gsap x/y/rotation so it composes safely
 * with other GSAP transforms on the same elements. Returns a cleanup.
 */
export function attachRepulsionToLetters(
  host: HTMLElement,
  letters: HTMLElement[],
): () => void {
  if (!interactionAllowed() || letters.length === 0) return () => {};

  const group: Group = {
    host,
    energized: false,
    glyphs: letters.map((el) => ({
      el,
      offsetX: 0,
      offsetY: 0,
      velocityX: 0,
      velocityY: 0,
      setX: gsap.quickSetter(el, "x", "px") as (value: number) => void,
      setY: gsap.quickSetter(el, "y", "px") as (value: number) => void,
      setR: gsap.quickSetter(el, "rotation", "deg") as (value: number) => void,
    })),
  };

  groups.add(group);
  startEngine();
  return () => {
    groups.delete(group);
  };
}

/**
 * Split a heading (nested spans allowed) into chars and register them
 * for cursor repulsion. Returns a cleanup that reverts the split.
 */
export function bindRepulsion(heading: HTMLElement): () => void {
  if (!interactionAllowed()) return () => {};
  const split = new SplitText(heading, { type: "chars", charsClass: "fxChar" });
  const detach = attachRepulsionToLetters(heading, split.chars as HTMLElement[]);
  return () => {
    detach();
    split.revert();
  };
}
