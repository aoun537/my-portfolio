/**
 * Work section content.
 * - `projects`: image showcases. AURORA is this actual site; the other
 *   three are sample builds shipped with the template — replace them with
 *   real client work (name, blurb, stack, href, and a 1280x840 screenshot
 *   in /public/images/projects/) before relying on the site professionally.
 * - `buildStandards`: the quality bars every build is held to, shown as
 *   count-up stat cards. These are standards, not per-client results.
 */

export interface Project {
  slug: string;
  name: string;
  kind: "website" | "app";
  /** Short, feature-first summary shown under the showcase. */
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
    slug: "aurora",
    name: "AURORA",
    kind: "website",
    blurb:
      "The site you are reading. A single-page portfolio with a spring-physics cursor-repulsion engine, GSAP scroll choreography, and Lenis smooth scroll, built on Next.js 16 and TypeScript.",
    stack: "Next.js + TypeScript + GSAP",
    category: "ANIMATED PORTFOLIO",
    image: "/images/projects/aurora.svg",
    imageAlt:
      "Animated portfolio homepage with a large split-letter headline and a smooth scrolling layout",
    accent: "#2FA9C4",
  },
  {
    slug: "carton",
    name: "CARTON",
    kind: "website",
    blurb:
      "An e-commerce storefront with product and collection pages, a smooth cart and checkout flow, and Stripe payments, tuned to keep every step of the purchase fast.",
    stack: "Next.js + Stripe + Tailwind",
    category: "E-COMMERCE STOREFRONT",
    image: "/images/projects/carton.svg",
    imageAlt:
      "E-commerce storefront showing a product grid, prices, and an add-to-cart action",
    accent: "#E8590C",
  },
];

export interface BuildStandard {
  /** Display value, e.g. "98" or "AA". */
  value: string;
  /** Optional numeric target for the count-up animation (integers only). */
  countTo?: number;
  /** Optional suffix printed after a counted value, e.g. "%". */
  suffix?: string;
  label: string;
  detail: string;
}

/**
 * Quality bars every build is held to. Adjust the values to whatever you
 * genuinely hold yourself to; these are standards of practice, not
 * fabricated per-client outcomes.
 */
export const buildStandards: BuildStandard[] = [
  {
    value: "95+",
    countTo: 95,
    suffix: "+",
    label: "Lighthouse performance",
    detail: "Every build is profiled and tuned before it ships, not audited after launch.",
  },
  {
    value: "AA",
    label: "WCAG accessibility",
    detail: "Semantic markup, keyboard flows, and contrast tested with a screen reader.",
  },
  {
    value: "100%",
    countTo: 100,
    suffix: "%",
    label: "Responsive coverage",
    detail: "Laid out mobile-first and checked from small phones up to wide desktops.",
  },
];
