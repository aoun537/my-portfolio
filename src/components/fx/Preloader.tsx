"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./Preloader.module.css";

/** Greetings across the markets I serve, ending on home. */
const GREETINGS = ["Hello", "G'day", "Bonjour", "Hola", "السلام علیکم"];

export const PRELOADER_DONE_EVENT = "su:preloader-done";

/**
 * Boot sequence: greetings cycle in every language I work in, then the
 * S and U monogram letters fly from screen center to the exact spots
 * where the hero headline letters sit, and the page takes over.
 * The Hero listens for PRELOADER_DONE_EVENT to start its own intro.
 *
 * The data-preloading attribute is set on <html> by an inline script in
 * layout.tsx before first paint, so the hero knows to hold its intro.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const finish = () => {
      document.documentElement.removeAttribute("data-preloading");
      window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
      window.__lenis?.start();
      root.style.display = "none";
    };

    if (!document.documentElement.hasAttribute("data-preloading")) {
      /* Attribute missing means reduced motion: skip straight to the site */
      root.style.display = "none";
      window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
      return;
    }

    window.__lenis?.stop();
    window.scrollTo(0, 0);

    const greeting = root.querySelector<HTMLElement>(`.${styles.greeting}`);
    const monogram = root.querySelector<HTMLElement>(`.${styles.monogram}`);
    const letterS = root.querySelector<HTMLElement>("[data-mono-s]");
    const letterU = root.querySelector<HTMLElement>("[data-mono-u]");
    const heroS = document.querySelector<HTMLElement>('[data-letter-wrap][data-dock="true"]');
    const heroDocks = document.querySelectorAll<HTMLElement>('[data-letter-wrap][data-dock="true"]');
    const heroU = heroDocks.length > 1 ? heroDocks[1] : null;

    if (!greeting || !monogram || !letterS || !letterU || !heroS || !heroU) {
      finish();
      return;
    }

    /* Match the hero's letter size so the flight lands seamlessly */
    const heroFontSize = getComputedStyle(
      heroS.querySelector("[data-letter]") ?? heroS,
    ).fontSize;
    monogram.style.fontSize = heroFontSize;

    const tl = gsap.timeline({ onComplete: finish });

    /* 1. Cycle greetings */
    GREETINGS.forEach((word, i) => {
      tl.call(() => {
        greeting.textContent = word;
      });
      tl.fromTo(
        greeting,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" },
      );
      tl.to(greeting, {
        opacity: 0,
        y: -26,
        duration: 0.16,
        ease: "power2.in",
        delay: i === GREETINGS.length - 1 ? 0.25 : 0.12,
      });
    });

    /* 2. Monogram appears at center */
    tl.set(greeting, { display: "none" });
    tl.fromTo(
      [letterS, letterU],
      { opacity: 0, yPercent: 60 },
      { opacity: 1, yPercent: 0, duration: 0.45, stagger: 0.08, ease: "power4.out" },
    );

    /* 3. Fly each letter to its hero position */
    const flyTo = (from: HTMLElement, to: HTMLElement) => {
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      return { x: b.left - a.left, y: b.top - a.top };
    };

    tl.add("fly", "+=0.3");
    [
      { from: letterS, to: heroS },
      { from: letterU, to: heroU },
    ].forEach(({ from, to }) => {
      tl.to(
        from,
        {
          x: () => flyTo(from, to).x,
          y: () => flyTo(from, to).y,
          duration: 0.9,
          ease: "power3.inOut",
        },
        "fly",
      );
    });

    /* 4. Curtain lifts while the letters land */
    tl.to(
      root,
      { backgroundColor: "transparent", duration: 0.5, ease: "power2.inOut" },
      "fly+=0.35",
    );
    tl.to([letterS, letterU], { opacity: 0, duration: 0.18 }, "fly+=0.88");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.preloader} aria-hidden="true">
      <span className={styles.greeting} />
      <span className={styles.monogram}>
        <span data-mono-s className={styles.letterS}>
          S
        </span>
        <span data-mono-u className={styles.letterU}>
          U
        </span>
      </span>
    </div>
  );
}

declare global {
  interface Window {
    __lenis?: { start: () => void; stop: () => void };
  }
}
