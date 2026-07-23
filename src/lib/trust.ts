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
  { value: 4, suffix: "+", label: "Years in Local SEO" },
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
    title: "Local SEO Specialist",
    issuer: "4+ years of client work",
    detail: "Full stack of local search: on-page SEO, citations, reviews, schema markup, and Google Business Profile management for service businesses.",
  },
  {
    title: "WordPress and Elementor Professional",
    issuer: "Platform expertise",
    detail: "Deep experience shipping and managing fast WordPress builds that stay healthy, secure, and easy for owners to update.",
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
    title: "Niche focus, not a generalist",
    description:
      "I only work with local businesses. Every tactic, tool, and template I use is built for winning one city at a time, not chasing global keywords.",
  },
  {
    title: "SEO and code under one roof",
    description:
      "Most SEOs rent a developer and most developers guess at SEO. You get both disciplines in one person, so nothing is lost in translation.",
  },
  {
    title: "Reports in plain English",
    description:
      "You will always know what I did, why I did it, and what it changed. Positions, calls, and leads, not vanity charts.",
  },
  {
    title: "Systems that outlive the contract",
    description:
      "Everything I build is documented and handed over properly. If we stop working together, your rankings and tools stay yours.",
  },
];
