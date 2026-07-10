"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { bindScramble } from "@/lib/letterFx";
import { serviceDetails } from "@/lib/serviceDetails";
import styles from "./ServiceDetails.module.css";

/**
 * Editorial service index: full-width rows with oversized numbering.
 * Hovering a row floods it with brand blue and pops the inclusion
 * chips; on touch layouts the chips are always visible.
 */
export default function ServiceDetails() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      /*
       * Curtain-wipe reveal: an accent panel sweeps across each row
       * (grows from the left, exits to the right) and the content is
       * uncovered at the flip, with the title settling out of a skew.
       */
      const rows = gsap.utils.toArray<HTMLElement>(`.${styles.row}`, sectionRef.current);
      rows.forEach((row) => {
        const wipe = row.querySelector<HTMLElement>("[data-wipe]");
        const inner = row.querySelector<HTMLElement>(`.${styles.rowInner}`);
        const title = row.querySelector<HTMLElement>(`.${styles.title}`);
        if (!wipe || !inner) return;

        gsap.set(inner, { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 88%" },
        });
        tl.fromTo(
          wipe,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.4, ease: "power3.in" },
        );
        tl.set(inner, { opacity: 1 });
        if (title) {
          tl.from(title, { y: 42, skewY: 4, opacity: 0, duration: 0.55, ease: "power3.out" }, ">");
        }
        tl.to(
          wipe,
          { scaleX: 0, transformOrigin: "right center", duration: 0.5, ease: "power3.inOut" },
          "<",
        );
      });

      /* ScrambleText on the colored heading words */
      const accentWord = sectionRef.current?.querySelector<HTMLElement>(
        `.${styles.heading} span`,
      );
      if (accentWord) return bindScramble(accentWord);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="service-details"
      aria-labelledby="service-details-heading"
    >
      <span className="eyebrow">What You Get</span>
      <h2 id="service-details-heading" className={styles.heading}>
        Every Service, <span>Spelled Out.</span>
      </h2>
      <p className={styles.intro}>
        No vague retainers and no mystery hours. Each service lists exactly what lands in your
        business, so you know what you are paying for before we start.
      </p>

      <div className={styles.rows}>
        {serviceDetails.map((service, i) => (
          <article key={service.id} className={styles.row} tabIndex={0}>
            <span data-wipe className={styles.wipe} aria-hidden="true" />
            <div className={styles.rowInner}>
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className={styles.body}>
                <h3 className={styles.title}>{service.title}</h3>
                <p className={styles.summary}>{service.summary}</p>
                <ul className={styles.chips}>
                  {service.inclusions.map((item, j) => (
                    <li
                      key={item}
                      className={styles.chip}
                      style={{ transitionDelay: `${j * 40}ms` }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <span className={styles.arrow} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 18 18 6M9 6h9v9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.ctaRow}>
        <p className={styles.ctaText}>
          Not sure which one you need? Tell me your business type and city, I will audit what you
          have and reply with the shortest path to more calls, <strong>for free</strong>.
        </p>
        <a href="#contact" className={styles.ctaButton} data-cursor-grow>
          GET A FREE AUDIT
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
