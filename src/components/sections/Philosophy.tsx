"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { attachRepulsionToLetters } from "@/lib/letterFx";
import styles from "./Philosophy.module.css";

/** Accent words render in var(--accent); every glyph gets repulsion. */
const STATEMENT: Array<{ text: string; accent?: boolean }> = [
  { text: "REAL" },
  { text: "PROBLEMS", accent: true },
  { text: "DESERVE" },
  { text: "REAL" },
  { text: "SOLUTIONS,", accent: true },
  { text: "ENGINEERED" },
  { text: "TO" },
  { text: "SERVE" },
  { text: "PEOPLE", accent: true },
  { text: "AND" },
  { text: "MOVE" },
  { text: "THEM" },
  { text: "CLOSER" },
  { text: "TO" },
  { text: "THEIR" },
  { text: "GOALS.", accent: true },
];

const STATEMENT_TEXT = STATEMENT.map((w) => w.text).join(" ");

/**
 * Approach statement. Words fade and slide up as the block enters the
 * viewport; after that, every glyph (navy and accent alike) lives under
 * the shared cursor-repulsion engine: letters near the pointer pop away
 * and spring back home as it sweeps across the sentence.
 */
export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const words = gsap.utils.toArray<HTMLElement>("[data-word]", section);
      gsap.from(words, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.045,
        scrollTrigger: { trigger: section, start: "top 72%" },
      });

      const heading = section.querySelector<HTMLElement>(`.${styles.statement}`);
      const letters = gsap.utils.toArray<HTMLElement>("[data-glyph]", section);
      if (heading) {
        return attachRepulsionToLetters(heading, letters);
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="philosophy"
      aria-labelledby="philosophy-heading"
    >
      <span className="eyebrow">Approach &amp; Vision</span>
      <h2 id="philosophy-heading" className={styles.statement} aria-label={STATEMENT_TEXT}>
        {STATEMENT.map((word, wi) => (
          <span key={wi} aria-hidden="true">
            <span
              data-word
              className={`${styles.word} ${word.accent ? styles.accent : ""}`}
            >
              {word.text.split("").map((letter, li) => (
                <span key={li} data-glyph className={styles.letter}>
                  {letter}
                </span>
              ))}
            </span>{" "}
          </span>
        ))}
      </h2>
    </section>
  );
}
