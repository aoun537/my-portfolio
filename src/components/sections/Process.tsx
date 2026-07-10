"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { processSteps } from "@/lib/process";
import styles from "./Process.module.css";

/** Renders {accented} segments of a step description. */
function renderDescription(text: string): ReactNode[] {
  return text.split(/(\{[^}]+\})/g).map((part, i) =>
    part.startsWith("{") ? (
      <em key={i} className={styles.emphasis}>
        {part.slice(1, -1)}
      </em>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/** Rest and sweep geometry for the two circles (CSS variable values). */
const REST = { ax: "60%", ay: "62%", ar: "40%" };
const SWEEP = { ax: "48%", ay: "48%", ar: "55%" };

/**
 * Pinned five-step eclipse. A light-grey circle sits center-left; the
 * accent circle sits BEHIND it, offset bottom-right, showing only a
 * crescent. The step word is TWO-TONE: two stacked copies of the text,
 * one clipped to the grey circle (grey fill) and one clipped to the
 * accent circle (accent fill), so the word's color splits hard along
 * the accent circle's edge. Advancing a step sweeps the accent circle
 * across in a near-eclipse, swaps word/headline/color, ticks the
 * counter, then settles back to the crescent.
 */
export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const venn = section.querySelector<HTMLElement>(`.${styles.venn}`);
      const accentFills = gsap.utils.toArray<HTMLElement>("[data-accent-fill]", section);
      const details = gsap.utils.toArray<HTMLElement>("[data-step-detail]", section);
      const counter = section.querySelector<HTMLElement>("[data-step-counter]");
      const steps = processSteps.length;
      if (!venn) return;

      /* Word pairs: grey copy + accent copy share a data-w index */
      const wordPair = (i: number) =>
        gsap.utils.toArray<HTMLElement>(`[data-w="${i}"]`, section);

      for (let i = 0; i < steps; i++) {
        gsap.set(wordPair(i), { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 44 });
      }
      details.forEach((detail, i) =>
        gsap.set(detail, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 44 }),
      );
      gsap.set(venn, { "--ax": REST.ax, "--ay": REST.ay, "--ar": REST.ar });
      accentFills.forEach((el) => {
        if (el.dataset.accentFill === "bg") {
          el.style.backgroundColor = processSteps[0].color;
        } else {
          el.style.color = processSteps[0].color;
        }
      });

      const applyColor = (color: string) =>
        accentFills.map((el) =>
          el.dataset.accentFill === "bg"
            ? gsap.to(el, { backgroundColor: color, duration: 0.16 })
            : gsap.to(el, { color, duration: 0.16 }),
        );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${steps * 85}%`,
          scrub: 0.5,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!counter) return;
            const index = Math.min(steps - 1, Math.floor(self.progress * steps));
            counter.textContent = `0${index + 1}`;
          },
        },
      });

      for (let i = 0; i < steps - 1; i++) {
        const at = i + 0.5;

        /* Accent circle sweeps across into a near-eclipse ... */
        tl.to(venn, {
          "--ax": SWEEP.ax,
          "--ay": SWEEP.ay,
          "--ar": SWEEP.ar,
          duration: 0.2,
          ease: "power2.in",
        }, at);

        /* ... color flips at full coverage ... */
        for (const tween of applyColor(processSteps[i + 1].color)) {
          tl.add(tween, at + 0.2);
        }

        /* ... then settles back to the crescent */
        tl.to(venn, {
          "--ax": REST.ax,
          "--ay": REST.ay,
          "--ar": REST.ar,
          duration: 0.2,
          ease: "power2.out",
        }, at + 0.24);

        /* Word and headline swap under the sweep */
        tl.to(wordPair(i), { opacity: 0, y: -44, duration: 0.16 }, at + 0.06);
        tl.to(wordPair(i + 1), { opacity: 1, y: 0, duration: 0.18 }, at + 0.24);
        tl.to(details[i], { opacity: 0, y: -44, duration: 0.18 }, at);
        tl.to(details[i + 1], { opacity: 1, y: 0, duration: 0.2 }, at + 0.2);
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="process"
      aria-labelledby="process-heading"
    >
      <header className={styles.head}>
        <span className="eyebrow">How I Work</span>
        <span className={styles.counter}>
          <span data-step-counter>01</span> / 0{processSteps.length}
        </span>
      </header>
      <h2 id="process-heading" className="srOnly">
        My Process: Discover, Define, Design, Build, and Refine
      </h2>

      <div className={styles.stage}>
        <div className={styles.venn} aria-hidden="true">
          {/* Accent circle behind, crescent showing bottom-right */}
          <span data-accent-fill="bg" className={styles.accentDisc} />
          {/* Grey circle in front */}
          <span className={styles.greyDisc} />

          {/* Word copy clipped to the GREY circle, grey fill */}
          <span className={`${styles.wordLayer} ${styles.wordLayerGrey}`}>
            <span className={styles.wordStack}>
              {processSteps.map((step, i) => (
                <span key={step.word} data-w={i} className={styles.stepWord}>
                  {step.word}
                </span>
              ))}
            </span>
          </span>

          {/* Word copy clipped to the ACCENT circle, accent fill */}
          <span data-accent-fill="text" className={`${styles.wordLayer} ${styles.wordLayerAccent}`}>
            <span className={styles.wordStack}>
              {processSteps.map((step, i) => (
                <span key={step.word} data-w={i} className={styles.stepWord}>
                  {step.word}
                </span>
              ))}
            </span>
          </span>
        </div>

        <div className={styles.detailStage}>
          {processSteps.map((step) => (
            <div key={step.word} data-step-detail className={styles.detail}>
              <h3 className={styles.detailTitle}>
                {step.title.replace(/\.$/, "")}
                <span style={{ color: step.color }}>.</span>
              </h3>
              <p className={styles.detailText}>{renderDescription(step.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
