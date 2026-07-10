"use client";

/**
 * The single global accent system. One CSS variable (--accent) drives
 * every accent usage on the page: hero letters, eyebrows, title dots,
 * colored words, background pluses, borders, form tint, cursor rings.
 *
 * The cycle works in two beats:
 *   1. Opening the menu REVEALS the next palette color: the overlay
 *      is painted with it while the page keeps the current accent.
 *   2. Closing the menu COMMITS it: the whole page recolors at once.
 * Four colors, looping. Never re-rolls on scroll or hover.
 */

export const ACCENT_PALETTE = [
  { name: "red", hex: "#CB1F37" },
  { name: "orange", hex: "#F4980F" },
  { name: "sage", hex: "#96BF9D" },
  { name: "teal", hex: "#2FA9C4" },
] as const;

/** Matches the default --accent set in globals.css (teal). */
let currentIndex = 3;

export function getAccent(): string {
  return ACCENT_PALETTE[currentIndex].hex;
}

/** The color the menu overlay reveals (does not change the page). */
export function peekNextAccent(): string {
  return ACCENT_PALETTE[(currentIndex + 1) % ACCENT_PALETTE.length].hex;
}

/** Commit the revealed color to the whole page. Called on menu close. */
export function commitNextAccent(): string {
  currentIndex = (currentIndex + 1) % ACCENT_PALETTE.length;
  const hex = ACCENT_PALETTE[currentIndex].hex;
  document.documentElement.style.setProperty("--accent", hex);
  return hex;
}
