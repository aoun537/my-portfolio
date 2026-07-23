/**
 * Content for the Trust section: stats, credentials, and testimonials.
 * Replace testimonial placeholders with real client quotes as they arrive.
 */

import { site } from "@/lib/site";

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 1, suffix: "", label: "Year building for the web" },
  { value: 60, suffix: "+", label: "Local businesses helped" },
  { value: 90, suffix: "%", label: "Clients reaching the map pack" },
  { value: 12, suffix: "+", label: "Custom systems shipped" },
];

export interface Credential {
  title: string;
  issuer: string;
  detail: string;
}

export const credentials: Credential[] = [
  {
    title: "Certified Vibe Coder",
    issuer: "Certification",
    detail: "Builds production software with AI-first tooling: Cursor, Claude Code, GitHub, and Vercel, with human review on every line that ships.",
  },
  {
    title: "React and Next.js Developer",
    issuer: "1 year of client work",
    detail: "Component architecture, server rendering, routing, and state handled properly, so applications stay fast as features pile up.",
  },
  {
    title: "Performance and Accessibility",
    issuer: "Practice focus",
    detail: "Core Web Vitals, semantic markup, and keyboard and screen reader testing treated as build requirements rather than an audit at the end.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  business: string;
}

/**
 * PLACEHOLDER testimonials. Replace with real client quotes,
 * names, and businesses before going live.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      `Calls from Google doubled within three months. ${site.firstName} rebuilt our pages around the suburbs we actually serve and it just worked.`,
    name: "Client Name",
    business: "Plumbing Company, United States",
  },
  {
    quote:
      "Our profile went from buried to top three in the map pack. He handles everything and sends a report I can actually read.",
    name: "Client Name",
    business: "Dental Clinic, United Kingdom",
  },
  {
    quote:
      "The leads dashboard he built ended the era of lost enquiries. Every call and form now lands in one place with a status.",
    name: "Client Name",
    business: "Taxi Fleet, Australia",
  },
];

export interface TrustPoint {
  title: string;
  description: string;
}

export const trustPoints: TrustPoint[] = [
  {
    title: "Design and code under one roof",
    description:
      "Most developers wait on a designer and most designers hand over something that cannot be built. You get both in one person, so nothing is lost in translation.",
  },
  {
    title: "Fast by default, not as a phase",
    description:
      "Performance and accessibility are build requirements from the first commit. Retrofitting them after launch costs more and works less well.",
  },
  {
    title: "Updates in plain English",
    description:
      "You will always know what I did, why I did it, and what it changed. Working previews and short written notes, not status theatre.",
  },
  {
    title: "Code that outlives the contract",
    description:
      "Everything is typed, documented, and handed over in your own repository. If we stop working together, the codebase stays readable and yours.",
  },
];
