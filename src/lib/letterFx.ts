"use client";

import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

/**
 * THE heading letter animation: a per-letter shift/roll. Each glyph
 * slips out of place and re-appears from the other side (top to
 * bottom, left to right, and so on), rippling across the word with a
 * stagger. The travel direction rotates on every play, so repeated
 * hovers feel alive. Used on the hero name (H1) and every
 * accent-colored heading word: once on scroll into view, again on
 * every hover.
 */

const PLAYING = new WeakSet<HTMLElement>();

type Direction = "down" | "right" | "up" | "left";
const DIRECTIONS: Direction[] = ["down", "right", "up", "left"];
let directionCursor = 0;

function nextDirection(): Direction {
  const direction = DIRECTIONS[directionCursor % DIRECTIONS.length];
  directionCursor += 1;
  return direction;
}

/** Shift a set of letter elements out and back in from the far side. */
export function playShift(letters: HTMLElement[], host?: HTMLElement): void {
  const guard = host ?? letters[0];
  if (!guard || letters.length === 0 || PLAYING.has(guard)) return;
  PLAYING.add(guard);

  const direction = nextDirection();
  const vertical = direction === "down" || direction === "up";
  const axis = vertical ? "yPercent" : "xPercent";
  const sign = direction === "down" || direction === "right" ? 1 : -1;

  const out: gsap.TweenVars = { opacity: 0, duration: 0.16, ease: "power2.in" };
  const flip: gsap.TweenVars = { duration: 0 };
  const back: gsap.TweenVars = { opacity: 1, duration: 0.26, ease: "power2.out" };
  out[axis] = sign * 80;
  flip[axis] = -sign * 80;
  back[axis] = 0;

  gsap.to(letters, {
    keyframes: [out, flip, back],
    stagger: 0.03,
    onComplete: () => {
      PLAYING.delete(guard);
    },
  });
}

/**
 * Bind the shared shift to an element: splits it into chars, plays
 * once when it scrolls into view, and replays on hover. Returns a
 * cleanup that reverts the split.
 */
export function bindShift(el: HTMLElement): () => void {
  const split = new SplitText(el, { type: "chars", charsClass: "fxChar" });
  const chars = split.chars as HTMLElement[];
  const onEnter = () => playShift(chars, el);

  const trigger = ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () => playShift(chars, el),
  });

  el.addEventListener("mouseenter", onEnter);
  return () => {
    trigger.kill();
    el.removeEventListener("mouseenter", onEnter);
    split.revert();
  };
}
