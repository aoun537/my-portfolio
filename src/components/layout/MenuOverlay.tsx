"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/lib/site";
import styles from "./MenuOverlay.module.css";

const MENU_ITEMS = [
  { href: "#work", label: "WORK", sub: "SELECTED PROJECTS AND CASE STUDIES", index: "01" },
  { href: "#philosophy", label: "ABOUT", sub: "THE STORY BEHIND THE CRAFT", index: "02" },
  { href: "#services", label: "SERVICES", sub: "EXPERT SOLUTIONS FOR YOUR NEEDS", index: "03" },
  { href: "#contact", label: "CONTACT", sub: "LET'S TALK ABOUT YOUR PROJECT", index: "04" },
];

/*
 * Display order, top to bottom. Profiles left blank in site.ts are dropped
 * rather than rendered as dead links.
 */
const SOCIALS = [
  { label: "GITHUB", href: site.social.github },
  { label: "INSTAGRAM", href: site.social.instagram },
  { label: "LINKEDIN", href: site.social.linkedin },
].filter((social) => social.href !== "");

/** Master ease for the overlay wipe and the row slide. */
const EASE = "power4.inOut";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  /** Upcoming palette color revealed by the overlay before commit. */
  revealColor: string;
}

/**
 * Full-bleed overlay painted in the CURRENT accent color.
 *
 * Open and close are mirrored choreographies rather than a single fade:
 * the overlay wipes down, then rows slide up out of their masks with a
 * stagger while numbers and the right column drift in from the sides.
 * Closing plays the same beats in reverse, staggered from "end", and the
 * overlay wipe finishes last — which is why clicking a nav item scrolls
 * only after the timeline completes.
 */
export default function MenuOverlay({ open, onClose, revealColor }: MenuOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  /** Href to scroll to once the close timeline finishes, set by a row click. */
  const pendingTargetRef = useRef<string | null>(null);
  /** Skips the close timeline on first mount, when nothing has been shown yet. */
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = <T extends Element>(selector: string) =>
      Array.from(root.querySelectorAll<T>(selector));

    const inners = q<HTMLElement>("[data-menu-inner]");
    const indices = q<HTMLElement>("[data-menu-index]");
    const socials = q<HTMLElement>("[data-menu-social]");
    const asides = q<HTMLElement>("[data-menu-aside]");
    const back = root.querySelector<HTMLElement>("[data-menu-back]");

    if (open) {
      hasOpenedRef.current = true;
      gsap.set(root, { display: "flex", clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(inners, { yPercent: 110 });
      gsap.set(indices, { opacity: 0, x: -20 });
      gsap.set(socials, { opacity: 0, x: 20 });
      gsap.set(asides, { opacity: 0, y: 30 });
      if (back) gsap.set(back, { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline();
      tl.to(root, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: EASE })
        .to(inners, { yPercent: 0, duration: 0.8, stagger: 0.1, ease: EASE }, 0.3)
        .to(indices, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 0.5)
        .to(socials, { opacity: 1, x: 0, duration: 0.5, stagger: 0.15, ease: "power2.out" }, 0.4)
        .to(asides, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, 0.5);
      if (back) tl.to(back, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }, 0.6);
      return () => {
        tl.kill();
      };
    }

    if (!hasOpenedRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { display: "none" });
        const target = pendingTargetRef.current;
        pendingTargetRef.current = null;
        if (target) scrollToSection(target);
      },
    });

    if (back) tl.to(back, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power2.in" }, 0.1);
    tl.to(
      asides,
      { opacity: 0, y: 30, duration: 0.3, stagger: { each: 0.04, from: "end" }, ease: "power2.in" },
      0.1,
    )
      .to(
        socials,
        {
          opacity: 0,
          x: 20,
          duration: 0.3,
          stagger: { each: 0.05, from: "end" },
          ease: "power2.in",
        },
        0.15,
      )
      .to(
        indices,
        {
          opacity: 0,
          x: -20,
          duration: 0.3,
          stagger: { each: 0.03, from: "end" },
          ease: "power2.in",
        },
        0.1,
      )
      .to(
        inners,
        { yPercent: 110, duration: 0.5, stagger: { each: 0.05, from: "end" }, ease: EASE },
        0.2,
      )
      .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: EASE }, 0.5);

    return () => {
      tl.kill();
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /**
   * Defer the jump so the exit choreography is not cut short. The href is
   * parked and consumed by the close timeline's onComplete.
   */
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    pendingTargetRef.current = href;
    onClose();
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
                  <span className={styles.inner} data-menu-inner>
                    <a
                      href={item.href}
                      className={styles.link}
                      onClick={(event) => handleNavClick(event, item.href)}
                    >
                      <span className={styles.index} data-menu-index>
                        {item.index}
                      </span>
                      <span className={styles.wordWrap}>
                        <span className={styles.word}>{item.label}</span>
                      </span>
                      <span className={styles.sub}>{item.sub}</span>
                    </a>
                  </span>
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
                <li key={social.label} data-menu-social>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.asideLink}
                  >
                    {/* Two stacked copies: base rolls up, clone rolls in */}
                    <span className={styles.socialText}>
                      <span className={styles.socialBase} aria-label={social.label}>
                        {social.label.split("").map((char, i) => (
                          <span
                            key={i}
                            className={styles.socialChar}
                            style={{ transitionDelay: `${i * 0.02}s` }}
                            aria-hidden="true"
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                      <span className={styles.socialClone} aria-hidden="true">
                        {social.label.split("").map((char, i) => (
                          <span
                            key={i}
                            className={styles.socialChar}
                            style={{ transitionDelay: `${i * 0.02}s` }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      aria-hidden="true"
                    >
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

      <button
        type="button"
        className={styles.back}
        onClick={onClose}
        aria-label="Close menu"
        data-menu-back
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>BACK</span>
      </button>
    </div>
  );
}

/** Hand the jump to Lenis when it is driving scroll, else fall back to native. */
function scrollToSection(href: string) {
  const target = document.querySelector<HTMLElement>(href);
  if (!target) return;

  const lenis = (window as Window & { __lenis?: { scrollTo?: (t: HTMLElement) => void } }).__lenis;
  if (lenis?.scrollTo) {
    lenis.scrollTo(target);
    return;
  }
  target.scrollIntoView({ behavior: "smooth" });
}
