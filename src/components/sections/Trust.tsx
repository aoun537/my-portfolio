"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { bindShift } from "@/lib/letterFx";
import { stats, credentials, testimonials, trustPoints } from "@/lib/trust";
import styles from "./Trust.module.css";

/**
 * Trust section: an inverted stats band with counting numerals,
 * credential plates, a numbered manifesto, and a scroll-scrubbed
 * testimonial strip (native swipe on mobile).
 */
export default function Trust() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      /* Count-up stats */
      gsap.utils.toArray<HTMLElement>("[data-count]", section).forEach((el) => {
        const target = Number(el.dataset.count);
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value));
          },
        });
      });

      /* Entrance rises */
      gsap.utils.toArray<HTMLElement>("[data-rise]", section).forEach((el, i) => {
        gsap.from(el, {
          y: 70,
          opacity: 0,
          duration: 0.8,
          delay: (i % 3) * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      /* Letter shift on the colored heading words */
      const accentWord = section.querySelector<HTMLElement>(`.${styles.heading} span`);
      const unbindFlip = accentWord ? bindShift(accentWord) : undefined;

      /* Testimonial strip: pinned horizontal scrub on wide screens */
      const strip = section.querySelector<HTMLElement>(`.${styles.stripTrack}`);
      const stripWrap = section.querySelector<HTMLElement>(`.${styles.strip}`);
      let mm: ReturnType<typeof gsap.matchMedia> | undefined;
      if (strip && stripWrap) {
        mm = gsap.matchMedia();
        mm.add("(min-width: 820px)", () => {
          gsap.to(strip, {
            x: () => -(strip.scrollWidth - stripWrap.offsetWidth),
            ease: "none",
            scrollTrigger: {
              trigger: stripWrap,
              start: "top 12%",
              end: () => `+=${strip.scrollWidth - stripWrap.offsetWidth}`,
              scrub: 0.6,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        });
      }

      return () => {
        mm?.revert();
        unbindFlip?.();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="trust"
      aria-labelledby="trust-heading"
    >
      <span className="eyebrow">Proof &amp; Trust</span>
      <h2 id="trust-heading" className={styles.heading}>
        Why Clients <span>Keep Me Around.</span>
      </h2>

      {/* Inverted stats band */}
      <div className={styles.statsBand} role="list">
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat} role="listitem">
            <span className={styles.statValue}>
              <span data-count={stat.value}>0</span>
              <span className={styles.statSuffix}>{stat.suffix}</span>
            </span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Credential plates */}
      <div className={styles.plates}>
        {credentials.map((credential, i) => (
          <article key={credential.title} className={styles.plate} data-rise>
            <div className={styles.plateHead}>
              <span className={styles.plateIndex}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.plateIssuer}>{credential.issuer}</span>
            </div>
            <h3 className={styles.plateTitle}>{credential.title}</h3>
            <p className={styles.plateDetail}>{credential.detail}</p>
            <span className={styles.plateSeal} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </article>
        ))}
      </div>

      {/* Numbered manifesto */}
      <div className={styles.manifesto}>
        <h3 className={styles.subheading}>What Makes This Different</h3>
        <div className={styles.manifestoRows}>
          {trustPoints.map((point, i) => (
            <article key={point.title} className={styles.manifestoRow} data-rise>
              <span className={styles.manifestoIndex} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className={styles.manifestoTitle}>{point.title}</h4>
                <p className={styles.manifestoText}>{point.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Testimonial strip */}
      <div className={styles.strip}>
        <div className={styles.stripHead}>
          <h3 className={styles.subheading}>What Clients Say</h3>
          <span className={styles.stripHint} aria-hidden="true">
            Keep scrolling
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <div className={styles.stripTrack}>
          {testimonials.map((testimonial, i) => (
            <figure
              key={i}
              className={`${styles.quoteCard} ${i === 1 ? styles.quoteCardAccent : ""}`}
            >
              <span className={styles.quoteMark} aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className={styles.quoteText}>{testimonial.quote}</blockquote>
              <figcaption className={styles.quoteFoot}>
                <span className={styles.stars} aria-label="Five star review">
                  ★★★★★
                </span>
                <span className={styles.clientName}>{testimonial.name}</span>
                <span className={styles.clientBusiness}>{testimonial.business}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
