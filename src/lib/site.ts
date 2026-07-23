/**
 * Single source of truth for identity, contact, and SEO configuration.
 * Every name, role, and location string on the site reads from here, so
 * rebranding the portfolio never requires touching a component.
 * Update SITE_URL once you purchase the final domain.
 */

/**
 * Canonical origin, used by metadata, robots.txt, sitemap.xml, and JSON-LD.
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL  - set this once a real domain is live
 *   2. VERCEL_PROJECT_PRODUCTION_URL - stable production host on Vercel
 *      (not VERCEL_URL, which changes on every deployment)
 *   3. the placeholder below, for local work
 * Only read server-side (metadata, robots, sitemap, schema), so the
 * unprefixed Vercel variable is fine here.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://syedaoun.example.com");

export const site = {
  name: "Syed Aoun",
  /* Proper case: the hero uppercases these itself for display */
  firstName: "Syed",
  lastName: "Aoun",
  initials: "SA",
  role: "Web Developer and Certified Vibe Coder",
  shortRole: "Web Developer",
  /* Business-facing labels used by JSON-LD and the receipt section */
  serviceLabel: "Web Development Services",
  offerCatalogName: "Web Development and Custom Software Services",
  receiptCode: "WEB-DEV",
  receiptThanks: "THANK YOU FOR BUILDING WITH",
  yearsExperience: "4+",
  location: "Pakistan",
  /* ISO 3166-1 alpha-2, used for the schema.org PostalAddress */
  countryCode: "PK",
  serviceArea: "United States, United Kingdom, Canada, and Australia",
  serviceAreas: ["United States", "United Kingdom", "Canada", "Australia", "Worldwide"],
  /* TODO: replace with Syed's real address — the contact form delivers here. */
  email: "hello@example.com",
  tagline: "I build fast, modern websites and web apps that are pleasant to use and easy to maintain.",
  description:
    "Syed Aoun is a Web Developer and Certified Vibe Coder with over 4 years of experience building fast, accessible websites and web applications. Work spans custom marketing sites, React and Next.js applications, e-commerce storefronts, ongoing website maintenance, and performance work, built with modern AI-first tooling and human review on every line that ships.",
  knowsAbout: [
    "Web Development",
    "Frontend Engineering",
    "React and Next.js",
    "TypeScript",
    "Web Performance and Accessibility",
    "Custom Web Applications",
  ],
  keywords: [
    "Web Developer",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Custom Website Development",
    "Web Application Development",
    "E-commerce Development",
    "Website Maintenance",
    "Web Performance Optimization",
    "Vibe Coder",
    "Syed Aoun",
  ],
  /*
   * TODO: add the remaining profile URLs. Blank entries are filtered out of
   * the menu, so nothing renders until they are set.
   */
  social: {
    instagram: "https://www.instagram.com/ig.syed_aoun/",
    linkedin: "",
    github: "https://github.com/aoun537",
  },
} as const;

export type Site = typeof site;
