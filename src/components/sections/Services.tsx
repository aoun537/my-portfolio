"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { toolGroups, railChips } from "@/lib/services";
import styles from "./Services.module.css";

/**
 * Pinned Services & Toolkit. The category title + description block is
 * pinned to the vertical center of the viewport for the whole section.
 * Below it, tool chips ride a horizontal rail right-to-left past a
 * fixed center guide line; the chip on the line is bold and accent-
 * underlined. The category cross-fades to whichever group's chips are
 * currently crossing the center. The pin distance is derived from the
 * rail's real width, so the rail travels through EVERY chip and the
 * last group fully exits before the section unpins.
 */
export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const layers = gsap.utils.toArray<HTMLElement>("[data-category]", section);
      const tape = section.querySelector<HTMLElement>(`.${styles.railTape}`);
      const viewport = section.querySelector<HTMLElement>(`.${styles.railViewport}`);
      if (!tape || !viewport) return;

      layers.forEach((layer, i) => {
        gsap.set(layer, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 34 });
      });

      const marks = gsap.utils.toArray<HTMLElement>(`.${styles.toolMark}`, section);
      const markNames = marks.map((m) => m.querySelector<HTMLElement>(`.${styles.toolName}`));
      const markLines = marks.map((m) => m.querySelector<HTMLElement>(`.${styles.toolUnderline}`));
      const markGroups = marks.map((m) => Number(m.dataset.group ?? 0));

      /* Cross-fade the pinned block when a new group reaches the line */
      let activeGroup = 0;
      const setActiveGroup = (next: number) => {
        if (next === activeGroup) return;
        gsap.to(layers[activeGroup], { opacity: 0, y: -34, duration: 0.3, overwrite: "auto" });
        gsap.to(layers[next], { opacity: 1, y: 0, duration: 0.32, overwrite: "auto" });
        activeGroup = next;
      };

      const updateMarks = () => {
        const viewRect = viewport.getBoundingClientRect();
        const centerX = viewRect.left + viewRect.width / 2;
        let nearestIndex = 0;
        let nearestDist = Infinity;

        marks.forEach((mark, i) => {
          const rect = mark.getBoundingClientRect();
          const dx = rect.left + rect.width / 2 - centerX;
          const dist = Math.abs(dx);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestIndex = i;
          }
          const closeness = Math.max(0, 1 - dist / 340);
          const sink = dx < 0 ? 12 * (1 - closeness) : 0;
          const name = markNames[i];
          const line = markLines[i];
          if (name) {
            name.style.transform = `translateY(${sink - 24 * closeness}px) scale(${1 + closeness * 0.28})`;
            name.style.opacity = String(0.3 + closeness * 0.7);
          }
          if (line) {
            line.style.transform = `scaleX(${Math.max(0, closeness - 0.35) / 0.65})`;
          }
        });

        setActiveGroup(markGroups[nearestIndex]);
      };

      /*
       * Travel: first chip enters from right of the guide line; final
       * position pushes the last chip well past it, so the whole list
       * is traversed end to end. Pin length scales with rail width.
       */
      const travel = () => ({
        from: viewport.offsetWidth * 0.6,
        to: -(tape.scrollWidth - viewport.offsetWidth * 0.2),
      });

      gsap.fromTo(
        tape,
        { x: () => travel().from },
        {
          x: () => travel().to,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(3000, Math.round(tape.scrollWidth * 1.05))}`,
            scrub: 0.5,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: updateMarks,
            onRefresh: updateMarks,
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
      id="services"
      aria-labelledby="services-heading"
    >
      <div className={styles.head}>
        <span className="eyebrow">Services &amp; Toolkit</span>
      </div>
      <h2 id="services-heading" className="srOnly">
        Services and Toolkit: Search, Local SEO, Vibe Coding, and Shipping
      </h2>

      {/* Pinned to the vertical center of the frame */}
      <div className={styles.stage}>
        {toolGroups.map((group) => (
          <div key={group.word} data-category className={styles.category}>
            <span className={styles.word} aria-hidden="true">
              {group.word}
              <span className={styles.wordDot}>.</span>
            </span>
            <p className={styles.blurb}>
              <strong>{group.label}</strong> {group.description}
            </p>
          </div>
        ))}
      </div>

      {/* Horizontal toolkit rail with fixed center guide */}
      <div className={styles.railViewport} aria-hidden="true">
        <div className={styles.railTape}>
          {railChips.map((chip) => (
            <div key={chip.name} data-group={chip.group} className={styles.toolMark}>
              <span className={styles.toolName}>{chip.name}</span>
              <span className={styles.toolUnderline} />
            </div>
          ))}
        </div>
        <span className={styles.railGuide} />
      </div>
    </section>
  );
}
