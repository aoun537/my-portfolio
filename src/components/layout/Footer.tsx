"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { attachRepulsionToLetters } from "@/lib/letterFx";
import { site } from "@/lib/site";
import styles from "./Footer.module.css";

const CLOSING_STATEMENT = "RANK WHERE IT PAYS.";
const CLOSING_DETAIL =
  "Rankings only matter when they ring the phone. Everything I build points at one outcome: a local business that gets found first and booked more.";

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

      /* Live cursor repulsion, same engine as every other heading */
      const detach = attachRepulsionToLetters(statement, split.chars as HTMLElement[]);

      return () => {
        detach();
        split.revert();
      };
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
        <span className={styles.note}>Serving local businesses worldwide</span>
      </div>
    </footer>
  );
}
