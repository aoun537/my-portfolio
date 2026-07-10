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

/**
 * Pinned five-step circles, as simple as it looks: a greyish circle
 * with the step word on it sits in front of a colored circle. On
 * scroll the grey circle travels steadily toward the NORTH-WEST,
 * uncovering the rear circle. At every quarter of the section's
 * progress the rear circle changes color, the word on the circles
 * swaps, the headline updates, and the counter ticks.
 */
export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const topCircle = section.querySelector<HTMLElement>(`.${styles.topCircle}`);
      const rearCircle = section.querySelector<HTMLElement>(`.${styles.rearCircle}`);
      const words = gsap.utils.toArray<HTMLElement>("[data-step-word]", section);
      const details = gsap.utils.toArray<HTMLElement>("[data-step-detail]", section);
      const counter = section.querySelector<HTMLElement>("[data-step-counter]");
      const steps = processSteps.length;
      if (!topCircle || !rearCircle) return;

      words.forEach((word, i) =>
        gsap.set(word, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 }),
      );
      details.forEach((detail, i) =>
        gsap.set(detail, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 44 }),
      );
      rearCircle.style.backgroundColor = processSteps[0].color;

      /*
       * Step swaps are event-driven from scroll progress, so they run
       * cleanly in both scroll directions at 25/50/75/100%.
       */
      let activeStep = 0;
      const setStep = (next: number) => {
        if (next === activeStep) return;
        const prev = activeStep;
        activeStep = next;
        gsap.to(rearCircle, {
          backgroundColor: processSteps[next].color,
          duration: 0.4,
          overwrite: "auto",
        });
        gsap.to(words[prev], { opacity: 0, y: -40, duration: 0.25, overwrite: "auto" });
        gsap.to(words[next], { opacity: 1, y: 0, duration: 0.3, delay: 0.08, overwrite: "auto" });
        gsap.to(details[prev], { opacity: 0, y: -44, duration: 0.25, overwrite: "auto" });
        gsap.to(details[next], { opacity: 1, y: 0, duration: 0.3, delay: 0.1, overwrite: "auto" });
        if (counter) counter.textContent = `0${next + 1}`;
      };

      /* Continuous north-west travel of the grey circle across the pin */
      gsap.fromTo(
        topCircle,
        { xPercent: 0, yPercent: 0, rotation: 0 },
        {
          xPercent: -34,
          yPercent: -30,
          rotation: -10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${steps * 80}%`,
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              /* Quarter boundaries: 0-25-50-75-100 -> steps 1-5 */
              const step = Math.min(steps - 1, Math.floor(self.progress * 4 + 0.0001));
              setStep(self.progress > 0.999 ? steps - 1 : step);
            },
          },
        },
      );
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
        <div className={styles.circles} aria-hidden="true">
          {/* Rear circle: recolors at every quarter */}
          <span className={styles.rearCircle} />

          {/* Grey circle in front, word on it, drifts north-west */}
          <span className={styles.topCircle}>
            <span className={styles.wordStack}>
              {processSteps.map((step) => (
                <span key={step.word} data-step-word className={styles.stepWord}>
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
