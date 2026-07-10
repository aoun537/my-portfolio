/**
 * Work section content.
 * - `projects`: image showcases (2 Local SEO websites + 2 custom systems).
 *   Swap placeholder entries with real client work: name, blurb, stack,
 *   href, and a 1280x840 screenshot in /public/images/projects/.
 * - `rankingCases`: 3 ranking results presented as SERP-style stat cards.
 */

export interface Project {
  slug: string;
  name: string;
  kind: "website" | "system";
  /** Short value-first summary shown under the showcase. */
  blurb: string;
  stack: string;
  category: string;
  image: string;
  imageAlt: string;
  href?: string;
  accent: string;
}

export const projects: Project[] = [
  {
    slug: "plumbpro",
    name: "PLUMBPRO",
    kind: "website",
    blurb: "Local SEO website for a plumbing company. Location pages, review schema, and call-first layout took it from invisible to the top of the map pack.",
    stack: "WordPress + Elementor + GBP",
    category: "LOCAL SEO WEBSITE",
    image: "/images/projects/plumbpro.svg",
    imageAlt: "Local plumbing company website homepage optimized for local search with service areas and review stars",
    accent: "#1e9e63",
  },
  {
    slug: "smilecrest",
    name: "SMILECREST",
    kind: "website",
    blurb: "Dental clinic website built around treatment and suburb pages. Online booking wired to every page turned rankings into filled chairs.",
    stack: "Next.js + TypeScript + GBP",
    category: "LOCAL SEO WEBSITE",
    image: "/images/projects/smilecrest.svg",
    imageAlt: "Dental clinic website homepage with treatment pages, online booking, and patient review highlights",
    accent: "#12a4b8",
  },
  {
    slug: "leadflow",
    name: "LEADFLOW",
    kind: "system",
    blurb: "Leads management dashboard that captures every call, form, and GBP message in one pipeline so local businesses stop losing jobs in their inbox.",
    stack: "Next.js + TypeScript + Resend",
    category: "LEADS DASHBOARD",
    image: "/images/projects/leadflow.svg",
    imageAlt: "Leads management dashboard showing a pipeline of local customer enquiries with sources and statuses",
    accent: "#CB1F37",
  },
  {
    slug: "rideline",
    name: "RIDELINE",
    kind: "system",
    blurb: "Taxi booking system with live dispatch, driver assignment, and instant fare quotes built for a local cab fleet that outgrew phone bookings.",
    stack: "Next.js + Node + Postgres",
    category: "TAXI BOOKING SYSTEM",
    image: "/images/projects/rideline.svg",
    imageAlt: "Taxi booking system interface with pickup and destination fields and a live driver dispatch map",
    accent: "#f5a623",
  },
];

export interface RankingCase {
  /** The money keyword that was won. */
  keyword: string;
  business: string;
  market: string;
  /** Starting Google position. */
  from: number;
  /** Final Google position. */
  to: number;
  /** Headline business outcome. */
  stat: string;
  timeframe: string;
}

/**
 * PLACEHOLDER ranking results. Replace with real client campaigns:
 * keyword, market, positions, and the outcome stat.
 */
export const rankingCases: RankingCase[] = [
  {
    keyword: "emergency plumber austin",
    business: "Plumbing Company",
    market: "Austin, TX",
    from: 27,
    to: 1,
    stat: "+212% calls",
    timeframe: "5 months",
  },
  {
    keyword: "invisalign leeds",
    business: "Dental Clinic",
    market: "Leeds, UK",
    from: 14,
    to: 2,
    stat: "+168% bookings",
    timeframe: "4 months",
  },
  {
    keyword: "geelong airport transfers",
    business: "Taxi Fleet",
    market: "Geelong, AU",
    from: 19,
    to: 3,
    stat: "3.4x more rides",
    timeframe: "6 months",
  },
];
