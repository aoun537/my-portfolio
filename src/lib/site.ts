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
  role: "Local SEO Expert and Certified Vibe Coder",
  shortRole: "Local SEO Expert",
  /* Business-facing labels used by JSON-LD and the receipt section */
  serviceLabel: "Local SEO Services",
  offerCatalogName: "Local SEO and Custom Development Services",
  receiptCode: "LOCAL-SEO",
  receiptThanks: "THANK YOU FOR RANKING WITH",
  yearsExperience: "4+",
  location: "Pakistan",
  /* ISO 3166-1 alpha-2, used for the schema.org PostalAddress */
  countryCode: "PK",
  serviceArea: "United States, United Kingdom, Canada, and Australia",
  serviceAreas: ["United States", "United Kingdom", "Canada", "Australia", "Worldwide"],
  /* TODO: replace with Syed's real address — the contact form delivers here. */
  email: "hello@example.com",
  tagline: "I help local businesses win the map pack and turn nearby searches into booked customers.",
  description:
    "Syed Aoun is a Local SEO Expert and Certified Vibe Coder with over 4 years of experience helping local businesses rank higher on Google, dominate the map pack, and convert local searches into revenue. Services include Local SEO websites, website copy, website management, Google Business Profile management, and custom systems such as leads dashboards, taxi booking platforms, and restaurant management systems.",
  knowsAbout: [
    "Local SEO",
    "Google Business Profile Optimization",
    "Local SEO Website Design",
    "Website Copywriting",
    "WordPress",
    "Custom Business Software",
  ],
  keywords: [
    "Local SEO Expert",
    "Local SEO Specialist",
    "Google Business Profile Management",
    "GBP Optimization",
    "Local SEO Website Design",
    "Local SEO Services",
    "Map Pack Ranking",
    "Local Business Websites",
    "Leads Management Dashboard",
    "Taxi Booking System",
    "Restaurant Management System",
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
