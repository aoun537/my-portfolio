/**
 * Services & Toolkit content: four tool groups whose chips ride the
 * horizontal rail, in contiguous group order. The pinned category
 * title cross-fades to a group as its chips pass the center line.
 */

export interface ToolGroup {
  /** Big pinned display word. The trailing dot renders in accent. */
  word: string;
  /** Bold lead-in used before the description. */
  label: string;
  /** One tight paragraph. No en or em dashes. */
  description: string;
  tools: string[];
}

export const toolGroups: ToolGroup[] = [
  {
    word: "SEARCH",
    label: "Search & Analytics.",
    description:
      "Where every campaign starts: crawl the site, read the data, find the gap. Keyword research, technical audits, and reporting that says what changed and why it matters.",
    tools: [
      "Google Search Console",
      "Google Analytics 4",
      "Google Tag Manager",
      "Semrush",
      "Ahrefs",
      "Screaming Frog",
      "Surfer SEO",
      "SE Ranking",
      "Looker Studio",
      "Google Keyword Planner",
    ],
  },
  {
    word: "LOCAL",
    label: "Local SEO.",
    description:
      "The map pack toolkit: profile optimization, citations, reviews, rank tracking street by street, and schema that tells Google exactly who you serve and where.",
    tools: [
      "Google Business Profile",
      "Google Maps",
      "BrightLocal",
      "Whitespark",
      "Local Falcon",
      "Moz Local",
      "Yext",
      "RankMath",
      "Yoast",
      "Schema.org",
    ],
  },
  {
    word: "BUILD",
    label: "Vibe Coding.",
    description:
      "Custom software at local business prices: AI-first tooling with human review on every line. Leads dashboards, booking systems, and websites typed end to end.",
    tools: [
      "Cursor",
      "Claude Code",
      "v0",
      "Bolt.new",
      "Lovable",
      "Windsurf",
      "Replit",
      "GitHub Copilot",
      "Next.js",
      "React",
      "Tailwind",
      "Supabase",
    ],
  },
  {
    word: "SHIP",
    label: "Ship & Operate.",
    description:
      "From design file to live site without drama: deploys, CMS builds, design tools, and the ops stack that keeps client work organized and online.",
    tools: [
      "Vercel",
      "Netlify",
      "Figma",
      "Framer",
      "Webflow",
      "WordPress",
      "Notion",
      "Linear",
      "ChatGPT",
      "Midjourney",
    ],
  },
];

/** Flat rail chips, contiguous per group, tagged with their group index. */
export const railChips: Array<{ name: string; group: number }> = toolGroups.flatMap(
  (group, groupIndex) => group.tools.map((name) => ({ name, group: groupIndex })),
);

/** Marquee ticker items crossing the hero. */
export const marqueeItems: string[] = [
  "LOCAL SEO",
  "GBP MANAGEMENT",
  "WEBSITE COPY",
  "LOCAL SEO WEBSITES",
  "LEADS DASHBOARDS",
  "TAXI BOOKING SYSTEMS",
  "RESTAURANT SYSTEMS",
  "WEBSITE MANAGEMENT",
  "VIBE CODING",
];
