"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { faqs } from "@/lib/faqs";
import styles from "./Faq.module.css";

/**
 * FAQ accordion. The matching FAQPage JSON-LD is emitted globally
 * from the schema module, so this component is purely presentational.
 */
export default function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number>(0);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(`.${styles.item}`, sectionRef.current).forEach((item, i) => {
        gsap.from(item, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 92%" },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} plusGrid`}
      id="faq"
      aria-labelledby="faq-heading"
    >
      <span className="eyebrow">Questions &amp; Answers</span>
      <h2 id="faq-heading" className={styles.heading}>
        Local SEO Questions, <span>Answered Straight.</span>
      </h2>

      <div className={styles.list}>
        {faqs.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={faq.question} className={`${styles.item} ${open ? styles.open : ""}`}>
              <h3 className={styles.question}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={open}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setOpenIndex(open ? -1 : i)}
                >
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.icon} aria-hidden="true" />
                </button>
              </h3>
              <div
                id={`faq-answer-${i}`}
                className={styles.answerWrap}
                role="region"
                hidden={!open}
              >
                <p className={styles.answer}>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
