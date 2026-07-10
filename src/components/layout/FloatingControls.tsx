"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import styles from "./FloatingControls.module.css";

/** Scroll-to-top and theme toggle buttons pinned bottom right. */
export default function FloatingControls() {
  const { theme, toggleTheme } = useTheme();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={`${styles.button} ${showTop ? styles.visible : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll back to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        className={`${styles.button} ${styles.visible}`}
        onClick={toggleTheme}
        aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      >
        {theme === "light" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
