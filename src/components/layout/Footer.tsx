"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";
import styles from "./Footer.module.css";

const CLOSING_STATEMENT = "BUILD IT PROPERLY.";
const CLOSING_DETAIL =
  "Shipping fast and building well are not opposites. Everything I build points at one outcome: software that is quick to use, easy to change, and still standing a year later.";

/** Closing statement with character reveal, then site footer. */
export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const statement = rootRef.current?.querySelector<HTMLElement>(`.${styles.statement}`);
      if (!statement) return;

      const split = new SplitText(statement, { type: "chars", charsClass: styles.char });
      gsap.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.035,
        duration: 0.7,
        ease: "power4.out",
        scrollTrigger: { trigger: statement, start: "top 85%" },
      });

      return () => split.revert();
    },
    { scope: rootRef },
  );

  const year = new Date().getFullYear();

  return (
    <footer ref={rootRef} className={`${styles.footer} plusGrid`}>
      <div className={styles.closing}>
        <p className={styles.statement}>{CLOSING_STATEMENT}</p>
        <p className={styles.detail}>{CLOSING_DETAIL}</p>
      </div>

      <div className={styles.bar}>
        <span className={styles.copyright}>
          © {year} {site.name}. {site.shortRole}, {site.location}.
        </span>
        <nav className={styles.links} aria-label="Footer">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#faq">FAQ</a>
          <a href={`mailto:${site.email}`}>Email</a>
        </nav>
        <span className={styles.note}>Building for clients worldwide</span>
      </div>
    </footer>
  );
}
