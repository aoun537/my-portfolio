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
    word: "DESIGN",
    label: "Design & Prototype.",
    description:
      "Where every build starts: structure before styling. Wireframes, design systems, and clickable prototypes so we agree on the thing before a line of it is real.",
    tools: [
      "Figma",
      "Framer",
      "Adobe XD",
      "Penpot",
      "Storybook",
      "Design Tokens",
      "Sketch",
      "Whimsical",
      "Excalidraw",
      "Spline",
    ],
  },
  {
    word: "BUILD",
    label: "Frontend Engineering.",
    description:
      "The part people actually touch: typed components, real accessibility, and interfaces that stay smooth on a cheap phone as well as a fast laptop.",
    tools: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
      "Vite",
      "Astro",
      "Vue",
      "CSS Modules",
    ],
  },
  {
    word: "DATA",
    label: "Backend & Data.",
    description:
      "The half nobody sees until it breaks: APIs, schemas, and auth wired so the data stays correct and the app keeps answering under load.",
    tools: [
      "Node.js",
      "PostgreSQL",
      "Supabase",
      "Prisma",
      "REST APIs",
      "tRPC",
      "MongoDB",
      "Redis",
      "Firebase",
      "Stripe",
    ],
  },
  {
    word: "SHIP",
    label: "Ship & Operate.",
    description:
      "From branch to production without drama: previews on every pull request, monitoring that catches the problem first, and builds that stay fast as they grow.",
    tools: [
      "Vercel",
      "Git",
      "GitHub Actions",
      "Docker",
      "Netlify",
      "Cloudflare",
      "Playwright",
      "Sentry",
      "Cursor",
      "Claude Code",
    ],
  },
];

/** Flat rail chips, contiguous per group, tagged with their group index. */
export const railChips: Array<{ name: string; group: number }> = toolGroups.flatMap(
  (group, groupIndex) => group.tools.map((name) => ({ name, group: groupIndex })),
);

/** Marquee ticker items crossing the hero. */
export const marqueeItems: string[] = [
  "WEB DEVELOPMENT",
  "REACT & NEXT.JS",
  "TYPESCRIPT",
  "WEB APPLICATIONS",
  "E-COMMERCE BUILDS",
  "DESIGN SYSTEMS",
  "PERFORMANCE TUNING",
  "WEBSITE MAINTENANCE",
  "VIBE CODING",
];
