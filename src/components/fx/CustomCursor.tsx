"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./CustomCursor.module.css";

/** Ring diameters, biggest first: ring 1 largest, ring 4 smallest. */
const RING_SIZES = [30, 22, 15, 9];
/** Chase factors per ring: each ring follows the element before it. */
const RING_EASE = [0.3, 0.22, 0.16, 0.11];
/** Idle time before the cursor starts pulsing. */
const IDLE_DELAY_MS = 700;
/** Gap between pulses while the cursor stays idle. */
const PULSE_EVERY_MS = 1900;

/**
 * Main cursor: a big difference-blend circle lerped smoothly toward
 * the pointer (reads solid black over the light page and inverts
 * whatever it crosses). Behind it trail FOUR accent-colored circles
 * in descending sizes, each chasing the one before it, so speed
 * naturally stretches the chain apart. Left static, the main circle
 * pulses up to 1.5x for about a second, then again while idle.
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
    const rings = Array.from(root.querySelectorAll<HTMLElement>("[data-cursor-ring]"));
    if (!dot || rings.length === 0) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    const ringPos = rings.map(() => ({ ...target }));
    /* Everything stays hidden until the pointer first moves */
    rings.forEach((ring) => (ring.style.opacity = "0"));
    const pulse = { scale: 1 };
    let hovering = false;
    let visible = false;
    let lastMoveAt = performance.now();
    let lastPulseAt = 0;
    let pulseTween: gsap.core.Tween | null = null;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      lastMoveAt = performance.now();
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        rings.forEach((ring) => (ring.style.opacity = ""));
        pos.x = target.x;
        pos.y = target.y;
        ringPos.forEach((p) => {
          p.x = target.x;
          p.y = target.y;
        });
      }
      const el = event.target;
      hovering =
        el instanceof Element &&
        el.closest("a, button, input, textarea, select, [data-cursor-grow]") !== null;
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      rings.forEach((ring) => (ring.style.opacity = "0"));
    };

    const maybePulse = (now: number) => {
      const idleFor = now - lastMoveAt;
      if (idleFor < IDLE_DELAY_MS) return;
      if (now - lastPulseAt < PULSE_EVERY_MS) return;
      lastPulseAt = now;
      pulseTween?.kill();
      /* Grow to 1.5x and settle back over ~a second */
      pulseTween = gsap.to(pulse, {
        keyframes: [
          { scale: 1.5, duration: 0.45, ease: "power2.out" },
          { scale: 1, duration: 0.55, ease: "power2.inOut" },
        ],
      });
    };

    const tick = () => {
      const now = performance.now();

      /* Smooth lerp toward the real pointer — never snap */
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;

      if (visible) maybePulse(now);

      const scale = (hovering ? 1.4 : 1) * pulse.scale;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;

      /* Chain: ring 1 chases the dot, each next ring chases the previous */
      let prevX = pos.x;
      let prevY = pos.y;
      rings.forEach((ring, i) => {
        const p = ringPos[i];
        p.x += (prevX - p.x) * RING_EASE[i];
        p.y += (prevY - p.y) * RING_EASE[i];
        ring.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
        prevX = p.x;
        prevY = p.y;
      });

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      pulseTween?.kill();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeAttribute("data-cursor");
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.cursor} aria-hidden="true">
      {/* Rings render under the dot; ring 1 biggest, ring 4 smallest */}
      {RING_SIZES.map((size, i) => (
        <span
          key={i}
          data-cursor-ring
          className={styles.ring}
          style={{
            width: size,
            height: size,
            opacity: undefined,
            zIndex: 121 - i,
          }}
          data-ring-index={i}
        />
      ))}
      <span data-cursor-dot className={styles.dot} />
    </div>
  );
}
