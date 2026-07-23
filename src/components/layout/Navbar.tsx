"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { peekNextAccent, commitNextAccent } from "@/lib/accent";
import MenuOverlay from "./MenuOverlay";
import styles from "./Navbar.module.css";

/**
 * Fixed top bar: menu trigger on the left, monogram logo on the right.
 * Opening the menu REVEALS the next accent color (overlay only);
 * closing it COMMITS that color to the whole page, so every accent
 * element recolors in sync. Four colors, looping.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [revealColor, setRevealColor] = useState<string>("");

  const openMenu = () => {
    setRevealColor(peekNextAccent());
    setMenuOpen(true);
  };

  const closeMenu = () => {
    commitNextAccent();
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={styles.navbar} aria-label="Primary">
        <button
          type="button"
          className={styles.menuButton}
          onClick={openMenu}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
        >
          <span className={styles.menuIcon} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          MENU
        </button>

        <a href="#top" className={styles.logo} id="nav-logo" aria-label={`${site.name}, back to top`}>
          {/* Monogram follows site.initials; second letter carries the accent. */}
          {site.initials.charAt(0)}
          <span className={styles.logoAccent}>{site.initials.slice(1)}</span>
          <span className={styles.logoDot}>.</span>
        </a>
      </nav>

      <MenuOverlay open={menuOpen} onClose={closeMenu} revealColor={revealColor} />
    </>
  );
}
