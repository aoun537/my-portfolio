"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { bindShift } from "@/lib/letterFx";
import { serviceDetails } from "@/lib/serviceDetails";
import { site } from "@/lib/site";
import styles from "./ServiceDetails.module.css";

/**
 * What You Get, printed as a till receipt. Every service is an order
 * block: numbered title row, summary, and each inclusion on its own
 * line with dotted leaders and an INCL. mark. Lines "print" one after
 * another as the paper scrolls into view, a rubber INCLUDED stamp
 * slams onto the block you hover, and the receipt closes with totals,
 * a barcode, and a tear-off free-audit coupon.
 */
export default function ServiceDetails() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      /* Print effect: each line commits to paper as it enters */
      gsap.utils.toArray<HTMLElement>("[data-print]", section).forEach((line) => {
        gsap.fromTo(
          line,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power1.out",
            scrollTrigger: { trigger: line, start: "top 90%" },
          },
        );
      });

      /* The paper itself slides up with a settle */
      const paper = section.querySelector<HTMLElement>(`.${styles.paper}`);
      if (paper) {
        gsap.from(paper, {
          y: 90,
          rotation: 0.8,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: paper, start: "top 88%" },
        });
      }

      /* Letter shift on the colored heading words */
      const accentWord = section.querySelector<HTMLElement>(`.${styles.heading} span`);
      if (accentWord) return bindShift(accentWord);
    },
    { scope: sectionRef },
  );

  const year = new Date().getFullYear();

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="service-details"
      aria-labelledby="service-details-heading"
    >
      <span className="eyebrow">What You Get</span>
      <h2 id="service-details-heading" className={styles.heading}>
        The Receipt, <span>Before You Pay.</span>
      </h2>
      <p className={styles.intro}>
        No vague retainers and no mystery hours. Here is the full order, itemized like a till
        receipt, so you know exactly what lands in your business before we start.
      </p>

      <div className={styles.paperWrap}>
        <div className={styles.paper}>
          <span className={styles.edgeTop} aria-hidden="true" />

          {/* Receipt header */}
          <header className={styles.head}>
            <p className={styles.shopName} data-print>
              {site.name.toUpperCase()} ✳ LOCAL SEO EXPERT
            </p>
            <p className={styles.headLine} data-print>
              ORDER: YOUR LOCAL MARKET
            </p>
            <p className={styles.headLine} data-print>
              SERVED: WORLDWIDE ✳ EST. {year}
            </p>
            <span className={styles.rule} data-print aria-hidden="true" />
          </header>

          {/* One order block per service */}
          {serviceDetails.map((service, i) => (
            <article key={service.id} className={styles.block} tabIndex={0}>
              <span className={styles.stamp} aria-hidden="true">
                INCLUDED
              </span>

              <h3 className={styles.blockTitle} data-print>
                <span className={styles.blockIndex}>{String(i + 1).padStart(2, "0")}</span>
                {service.title}
              </h3>
              <p className={styles.blockSummary} data-print>
                {service.summary}
              </p>

              <ul className={styles.items}>
                {service.inclusions.map((item) => (
                  <li key={item} className={styles.item} data-print>
                    <span className={styles.itemName}>{item}</span>
                    <span className={styles.leaders} aria-hidden="true" />
                    <span className={styles.itemMark}>INCL.</span>
                  </li>
                ))}
              </ul>

              <span className={styles.rule} data-print aria-hidden="true" />
            </article>
          ))}

          {/* Totals */}
          <div className={styles.totals}>
            <p className={styles.totalLine} data-print>
              <span>SUBTOTAL</span>
              <span className={styles.leaders} aria-hidden="true" />
              <span>RANKINGS</span>
            </p>
            <p className={styles.totalLine} data-print>
              <span>HIDDEN FEES</span>
              <span className={styles.leaders} aria-hidden="true" />
              <span>NONE</span>
            </p>
            <p className={`${styles.totalLine} ${styles.totalDue}`} data-print>
              <span>TOTAL DUE</span>
              <span className={styles.leaders} aria-hidden="true" />
              <span>MORE CALLS</span>
            </p>
          </div>

          {/* Barcode */}
          <div className={styles.barcodeBlock} data-print aria-hidden="true">
            <span className={styles.barcode} />
            <span className={styles.barcodeLabel}>SU-{year}-LOCAL-SEO</span>
          </div>

          <p className={styles.thanks} data-print>
            THANK YOU FOR RANKING WITH SHAMS
          </p>

          {/* Tear-off coupon */}
          <div className={styles.tearLine} data-print aria-hidden="true">
            <span>✂</span>
          </div>
          <a href="#contact" className={styles.coupon} data-print data-cursor-grow>
            <span className={styles.couponTag}>FREE AUDIT COUPON</span>
            <span className={styles.couponText}>
              Tell me your business type and city. I audit what you have and reply with the
              shortest path to more calls, for free.
            </span>
            <span className={styles.couponCta}>
              CLAIM IT
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <path d="M6 18 18 6M9 6h9v9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>

          <span className={styles.edgeBottom} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
