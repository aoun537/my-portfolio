"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";
import { marqueeItems } from "@/lib/services";
import { PRELOADER_DONE_EVENT } from "@/components/fx/Preloader";
import { playShift } from "@/lib/letterFx";
import styles from "./Hero.module.css";

/** Letters that fly into the navbar monogram when the hero collapses. */
const DOCK_LETTERS = new Set(["first-0", "last-0"]);

/**
 * Each letter is two spans: the OUTER wrapper is only ever animated by the
 * scroll-scrub collapse timeline, the INNER letter only by the mount intro.
 * Keeping the two animations on separate elements means neither records
 * stale start values from the other, so scrubbing back up always restores
 * the hero correctly.
 */
function NameLine({
  word,
  line,
  accentIndices,
}: {
  word: string;
  line: "first" | "last";
  /** Two-tone treatment: these letters render in var(--accent). */
  accentIndices: number[];
}) {
  return (
    <span className={`${styles.nameLine} ${styles[line]}`} aria-hidden="true" data-name-line>
      {word.split("").map((letter, i) => (
        <span
          key={`${line}-${i}`}
          data-letter-wrap
          data-dock={DOCK_LETTERS.has(`${line}-${i}`) ? "true" : undefined}
          className={styles.letterWrap}
        >
          <span
            data-letter
            className={`${styles.letter} ${accentIndices.includes(i) ? styles.accent : ""}`}
          >
            {letter}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const innerLetters = gsap.utils.toArray<HTMLElement>("[data-letter]", section);
      const wrappers = gsap.utils.toArray<HTMLElement>("[data-letter-wrap]", section);
      const dockWraps = wrappers.filter((el) => el.dataset.dock === "true");
      const restWraps = wrappers.filter((el) => el.dataset.dock !== "true");
      const tagline = section.querySelector(`.${styles.tagline}`);
      const band = section.querySelector(`.${styles.band}`);
      const navLogo = document.getElementById("nav-logo");

      /*
       * Intro: staggered rise on inner letters. When the preloader is
       * running, hold everything hidden until it hands off: the S and U
       * arrive with the preloader's flight, so they snap visible while
       * the remaining letters stagger in around them.
       */
      const dockInner = dockWraps.map((wrap) => wrap.querySelector("[data-letter]"));
      const restInner = restWraps.map((wrap) => wrap.querySelector("[data-letter]"));

      const runIntro = (fromPreloader: boolean) => {
        if (fromPreloader) {
          gsap.set(dockInner, { yPercent: 0, opacity: 1 });
        } else {
          gsap.to(dockInner, {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.045,
            ease: "power4.out",
            delay: 0.2,
          });
        }
        gsap.to(restInner, {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.045,
          ease: "power4.out",
          delay: fromPreloader ? 0 : 0.2,
        });
        if (tagline && band) {
          gsap.from([tagline, band], {
            opacity: 0,
            y: 30,
            duration: 0.9,
            delay: fromPreloader ? 0.5 : 0.9,
            stagger: 0.15,
            ease: "power3.out",
          });
        }
      };

      if (document.documentElement.hasAttribute("data-preloading")) {
        gsap.set(innerLetters, { yPercent: 120, opacity: 0 });
        const onDone = () => runIntro(true);
        window.addEventListener(PRELOADER_DONE_EVENT, onDone, { once: true });
      } else if (window.scrollY < 100) {
        gsap.set(innerLetters, { yPercent: 120, opacity: 0 });
        runIntro(false);
      }

      /* Letter shift on the H1: hovering a name line rolls its letters
         out and back in from a rotating direction */
      section.querySelectorAll<HTMLElement>("[data-name-line]").forEach((lineEl) => {
        const lineLetters = gsap.utils.toArray<HTMLElement>("[data-letter]", lineEl);
        lineEl.addEventListener("mouseenter", () => playShift(lineLetters, lineEl));
      });

      /* Collapse: pin the hero and dock the monogram letters into the logo */

      /**
       * Layout-space position of `el` (transform and scroll independent).
       * While the hero is pinned at "top top" the section sits at the
       * viewport origin, so an element's offset within the section equals
       * its viewport position, which lets us aim at the fixed navbar logo
       * without measuring mid-animation rects.
       */
      const layoutOffset = (el: HTMLElement) => {
        let x = 0;
        let y = 0;
        let node: HTMLElement | null = el;
        while (node) {
          x += node.offsetLeft;
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        return { x, y };
      };

      const dockDelta = (wrap: HTMLElement) => {
        if (!navLogo) return { dx: 0, dy: 0, scale: 1 };
        const target = navLogo.getBoundingClientRect();
        const sectionPos = layoutOffset(section);
        const wrapPos = layoutOffset(wrap);
        const inViewportX = wrapPos.x - sectionPos.x;
        const inViewportY = wrapPos.y - sectionPos.y;
        const scale = (target.height * 0.72) / wrap.offsetHeight;
        return {
          dx: target.left - inViewportX,
          dy: target.top - inViewportY,
          scale,
        };
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            navLogo?.setAttribute("data-visible", self.progress > 0.95 ? "true" : "false");
          },
          onRefresh: (self) => {
            navLogo?.setAttribute("data-visible", self.progress > 0.95 ? "true" : "false");
          },
        },
      });

      tl.to(restWraps, {
        yPercent: -140,
        opacity: 0,
        stagger: { each: 0.02, from: "random" },
        ease: "power2.in",
        duration: 0.55,
      });

      if (tagline && band) {
        tl.fromTo(
          [tagline, band],
          { opacity: 1, y: 0 },
          { opacity: 0, y: 40, duration: 0.3, immediateRender: false },
          0,
        );
      }

      dockWraps.forEach((wrap, index) => {
        tl.to(
          wrap,
          {
            /* Second letter lands beside the first, forming the monogram */
            x: () => {
              const { dx, scale } = dockDelta(wrap);
              const nudge =
                index === 0 ? 0 : dockWraps[0].offsetWidth * dockDelta(dockWraps[0]).scale * 0.92;
              return dx + nudge;
            },
            y: () => dockDelta(wrap).dy,
            scale: () => dockDelta(wrap).scale,
            transformOrigin: "top left",
            ease: "power2.inOut",
            duration: 0.8,
          },
          0.15,
        );
      });

      tl.to(dockWraps, { opacity: 0, duration: 0.12 }, ">-0.1");
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={`${styles.hero} plusGrid`} id="top">
      <h1 className={styles.heading}>
        <span className="srOnly">
          {site.name}: {site.role} with {site.experience} of
          experience building fast, accessible websites
        </span>
        {/*
         * One accent letter per line, so both recolor when the menu commits
         * the next palette color. "first-0" stays ink and "last-0" stays
         * accent to match the preloader monogram letters that dock onto them.
         */}
        <NameLine word={site.firstName.toUpperCase()} line="first" accentIndices={[1]} />
        <NameLine word={site.lastName.toUpperCase()} line="last" accentIndices={[0]} />
      </h1>

      <p className={styles.tagline}>
        I BUILD WEBSITES, APPS &amp; INTERFACES
        <br />
        THAT PEOPLE ACTUALLY ENJOY USING.
      </p>

      <div className={styles.band} aria-hidden="true">
        <div className={styles.bandTrack}>
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.bandGroup}>
              {marqueeItems.map((item, i) => (
                <span key={`${copy}-${i}`} className={styles.bandItem}>
                  {item}
                  <span className={styles.bandStar}>{i % 2 === 0 ? "✦" : "◇"}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
