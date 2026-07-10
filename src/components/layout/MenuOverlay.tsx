"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/lib/site";
import styles from "./MenuOverlay.module.css";

const MENU_ITEMS = [
  { href: "#work", label: "WORK", sub: "SELECTED PROJECTS AND CASE STUDIES", index: "01" },
  { href: "#philosophy", label: "ABOUT", sub: "THE STORY BEHIND THE CRAFT", index: "02" },
  { href: "#services", label: "SERVICES", sub: "EXPERT SOLUTIONS FOR YOUR NEEDS", index: "03" },
  { href: "#contact", label: "CONTACT", sub: "LET'S TALK ABOUT YOUR PROJECT", index: "04" },
];

const SOCIALS = [
  { label: "INSTAGRAM", href: site.social.instagram },
  { label: "LINKEDIN", href: site.social.linkedin },
  { label: "GITHUB", href: site.social.github },
];

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  /** Upcoming palette color revealed by the overlay before commit. */
  revealColor: string;
}

/**
 * Full-bleed overlay painted in the CURRENT accent color. Left: giant
 * navy words with index numbers and hover sub-labels. Right: social
 * presence and location. Hovering a word runs the shared per-letter
 * flip while each glyph steps navy -> accent -> white on a stagger,
 * so mid-animation the word reads as accent + white simultaneously.
 */
export default function MenuOverlay({ open, onClose, revealColor }: MenuOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (open) {
      gsap.set(root, { display: "flex" });
      const rows = root.querySelectorAll("[data-menu-row]");
      const aside = root.querySelectorAll("[data-menu-aside]");
      gsap
        .timeline()
        .fromTo(
          root,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power4.out" },
        )
        .fromTo(
          rows,
          { yPercent: 130, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power3.out" },
          "-=0.25",
        )
        .fromTo(
          aside,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power3.out" },
          "-=0.35",
        );
    } else {
      gsap.to(root, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.45,
        ease: "power3.in",
        onComplete: () => gsap.set(root, { display: "none" }),
      });
    }
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /** Dual-color hover: staggered hop while each glyph steps navy -> accent -> white. */
  const handleWordEnter = (word: HTMLElement) => {
    const letters = Array.from(word.querySelectorAll<HTMLElement>("[data-menu-letter]"));
    gsap.to(letters, {
      keyframes: [
        { yPercent: -18, color: "var(--accent)", duration: 0.16, ease: "power2.out" },
        { yPercent: 0, color: "#ffffff", duration: 0.22, ease: "power2.in" },
      ],
      stagger: 0.03,
      overwrite: "auto",
    });
  };

  const handleWordLeave = (word: HTMLElement) => {
    const letters = word.querySelectorAll<HTMLElement>("[data-menu-letter]");
    gsap.to(letters, { color: "var(--brand-ink)", duration: 0.25, overwrite: "auto" });
  };

  return (
    <div
      ref={rootRef}
      className={styles.overlay}
      style={revealColor ? { background: revealColor } : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <button type="button" className={styles.close} onClick={onClose}>
        <span aria-hidden="true">✕</span> CLOSE
      </button>

      <div className={styles.columns}>
        <nav className={styles.nav} aria-label="Menu">
          <ul className={styles.list}>
            {MENU_ITEMS.map((item) => (
              <li key={item.href} className={styles.item}>
                <span className={styles.rowMask}>
                  <a
                    href={item.href}
                    className={styles.link}
                    data-menu-row
                    onClick={onClose}
                    onMouseEnter={(e) => handleWordEnter(e.currentTarget)}
                    onMouseLeave={(e) => handleWordLeave(e.currentTarget)}
                  >
                    <span className={styles.index}>{item.index}</span>
                    <span className={styles.word} aria-label={item.label}>
                      {item.label.split("").map((letter, i) => (
                        <span key={i} data-menu-letter className={styles.letter} aria-hidden="true">
                          {letter}
                        </span>
                      ))}
                    </span>
                    <span className={styles.sub}>{item.sub}</span>
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <aside className={styles.aside}>
          <div data-menu-aside>
            <h3 className={styles.asideHeading}>SOCIAL PRESENCE</h3>
            <ul className={styles.asideList}>
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.asideLink}
                  >
                    {social.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-menu-aside>
            <h3 className={styles.asideHeading}>LOCATION</h3>
            <p className={styles.asideText}>
              BASED IN {site.location.toUpperCase()}
              <br />
              WORKING WORLDWIDE
            </p>
          </div>
        </aside>
      </div>

      <button type="button" className={styles.back} onClick={onClose} aria-label="Close menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>BACK</span>
      </button>
    </div>
  );
}
