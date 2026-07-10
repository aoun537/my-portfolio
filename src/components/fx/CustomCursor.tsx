"use client";

import { useEffect, useRef } from "react";
import { ACCENT_PALETTE } from "@/lib/accent";
import styles from "./CustomCursor.module.css";

const TRAIL_POOL = 28;
/** Pointer speed (px/frame) above which trail dots spawn. */
const SPAWN_SPEED = 3;
/** Trail dots render at this size and scale down via transform. */
const TRAIL_BASE_SIZE = 18;
/** Roughly one in six trail dots is white instead of a palette color. */
const WHITE_CHANCE = 0.16;

interface TrailDot {
  el: HTMLElement;
  x: number;
  y: number;
  size: number;
  life: number;
  active: boolean;
}

/**
 * Solid pitch-black cursor circle, lerped toward the pointer each frame
 * for smooth motion. Fast movement spawns a trail of small palette-
 * colored dots behind it: the faster the pointer, the more and bigger
 * the dots. Idle or slow movement spawns nothing and the trail fades.
 * Fine pointers only; the native cursor is hidden via CSS.
 */
export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    if (!root) return;

    document.documentElement.setAttribute("data-cursor", "on");
    /* contents: the wrapper must not isolate the dot's blend mode */
    root.style.display = "contents";

    const dot = root.querySelector<HTMLElement>("[data-cursor-dot]");
    if (!dot) return;

    /* Build the trail pool once */
    const pool: TrailDot[] = [];
    for (let i = 0; i < TRAIL_POOL; i++) {
      const el = document.createElement("span");
      el.className = styles.trailDot;
      root.appendChild(el);
      pool.push({ el, x: 0, y: 0, size: 0, life: 0, active: false });
    }
    let poolIndex = 0;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let lastX = target.x;
    let lastY = target.y;
    let speed = 0;
    let hovering = false;
    let visible = false;
    let spawnCarry = 0;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        pos.x = target.x;
        pos.y = target.y;
        lastX = target.x;
        lastY = target.y;
      }
      const el = event.target;
      hovering =
        el instanceof Element &&
        el.closest("a, button, input, textarea, select, [data-cursor-grow]") !== null;
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
    };

    const spawn = (x: number, y: number, velocity: number) => {
      const dotRec = pool[poolIndex];
      poolIndex = (poolIndex + 1) % TRAIL_POOL;
      const color =
        Math.random() < WHITE_CHANCE
          ? "#ffffff"
          : ACCENT_PALETTE[Math.floor(Math.random() * ACCENT_PALETTE.length)].hex;
      dotRec.x = x + (Math.random() - 0.5) * 12;
      dotRec.y = y + (Math.random() - 0.5) * 12;
      /* Faster pointer -> bigger dots (8 to 18px) */
      dotRec.size = Math.min(8 + velocity * 0.4, TRAIL_BASE_SIZE);
      dotRec.life = 1;
      dotRec.active = true;
      dotRec.el.style.background = color;
    };

    const tick = () => {
      /* Smooth lerp toward the real pointer — never snap */
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;

      speed = Math.hypot(target.x - lastX, target.y - lastY);
      lastX = target.x;
      lastY = target.y;

      const scale = hovering ? 1.7 : 1;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;

      /* Spawn rate scales with speed; zero when idle */
      if (visible && speed > SPAWN_SPEED) {
        spawnCarry += Math.min(speed / 26, 2.2);
        while (spawnCarry >= 1) {
          spawnCarry -= 1;
          spawn(pos.x, pos.y, speed);
        }
      } else {
        spawnCarry = 0;
      }

      /* Age the trail: transform + opacity only, no layout writes */
      for (const t of pool) {
        if (!t.active) continue;
        t.life -= 0.045;
        if (t.life <= 0) {
          t.active = false;
          t.el.style.opacity = "0";
          continue;
        }
        const scale = (t.size / TRAIL_BASE_SIZE) * t.life;
        t.el.style.opacity = String(t.life * 0.9);
        t.el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeAttribute("data-cursor");
      pool.forEach((t) => t.el.remove());
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.cursor} aria-hidden="true">
      <span data-cursor-dot className={styles.dot} />
    </div>
  );
}
