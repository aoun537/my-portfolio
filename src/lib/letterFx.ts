"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * THE heading letter animation: GSAP ScrambleText. Characters cycle
 * through random uppercase glyphs before resolving into the real text.
 * Used on the hero name (H1) and every accent-colored heading word:
 * once on scroll into view, and again on hover.
 */

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const PLAYING = new WeakSet<HTMLElement>();

/** Scramble a single element back into its own text. */
export function playScramble(el: HTMLElement, duration = 0.9): void {
  if (PLAYING.has(el)) return;
  const original = el.dataset.scrambleText ?? el.textContent ?? "";
  el.dataset.scrambleText = original;
  PLAYING.add(el);
  gsap.to(el, {
    duration,
    scrambleText: {
      text: original,
      chars: SCRAMBLE_CHARS,
      speed: 0.4,
    },
    ease: "none",
    onComplete: () => {
      PLAYING.delete(el);
    },
  });
}

/**
 * Scramble a set of single-letter spans (the hero name) with a
 * left-to-right stagger. Each glyph resolves into its own character.
 */
export function playScrambleLetters(letters: HTMLElement[], host?: HTMLElement): void {
  const guard = host ?? letters[0];
  if (!guard || PLAYING.has(guard)) return;
  PLAYING.add(guard);
  let remaining = letters.length;
  letters.forEach((letter, i) => {
    const original = letter.dataset.scrambleText ?? letter.textContent ?? "";
    letter.dataset.scrambleText = original;
    gsap.to(letter, {
      duration: 0.7,
      delay: i * 0.045,
      scrambleText: { text: original, chars: SCRAMBLE_CHARS, speed: 0.5 },
      ease: "none",
      onComplete: () => {
        remaining -= 1;
        if (remaining === 0) PLAYING.delete(guard);
      },
    });
  });
}

/**
 * Bind the shared scramble to an element: plays once when it scrolls
 * into view and replays on hover. Returns a cleanup.
 */
export function bindScramble(el: HTMLElement): () => void {
  const onEnter = () => playScramble(el);

  const trigger = ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () => playScramble(el),
  });

  el.addEventListener("mouseenter", onEnter);
  return () => {
    trigger.kill();
    el.removeEventListener("mouseenter", onEnter);
  };
}
