/**
 * Expanded inclusions for the Service Details section.
 * Each service lists exactly what a client receives.
 */

export interface ServiceDetail {
  id: string;
  title: string;
  summary: string;
  inclusions: string[];
}

export const serviceDetails: ServiceDetail[] = [
  {
    id: "local-seo-website",
    title: "Local SEO Website",
    summary:
      "A website that works as your best salesperson: fast, structured for local search, and built to convert nearby visitors into calls.",
    inclusions: [
      "Keyword and competitor research for your city",
      "Service and location page architecture",
      "LocalBusiness and Service schema markup",
      "Core Web Vitals and mobile speed optimization",
      "Click to call, forms, and map integration",
      "Google Search Console and analytics setup",
    ],
  },
  {
    id: "website-copy",
    title: "Website Copy",
    summary:
      "Every page written around one search intent, in a voice that sounds like your business and not like a template.",
    inclusions: [
      "Homepage, service, and city page copy",
      "Search intent mapping per page",
      "Headlines and H tag structure that rank",
      "Calls to action tested for local buyers",
      "Meta titles and descriptions",
      "Review and trust snippets woven into copy",
    ],
  },
  {
    id: "website-management",
    title: "Website Management",
    summary:
      "Your site stays fast, secure, and current while you run the business. No more chasing a developer for small changes.",
    inclusions: [
      "Content updates and new page publishing",
      "Plugin, theme, and core updates",
      "Daily backups and uptime monitoring",
      "Security hardening and malware scans",
      "Monthly speed and health reports",
      "Priority turnaround on change requests",
    ],
  },
  {
    id: "gbp-management",
    title: "Google Business Profile Management",
    summary:
      "The map pack is where local customers decide. I manage your profile like the sales channel it is.",
    inclusions: [
      "Category, service, and attribute optimization",
      "Weekly posts and photo publishing",
      "Review responses and review growth strategy",
      "Q and A seeding and management",
      "Spam listing reports against fake competitors",
      "Monthly calls, clicks, and directions report",
    ],
  },
  {
    id: "custom-solutions",
    title: "Custom Solutions",
    summary:
      "Software built for how your business actually runs. Vibe coded with modern tooling, priced for local businesses.",
    inclusions: [
      "Leads management dashboards",
      "Taxi and fleet booking systems",
      "Restaurant management systems",
      "Quote calculators and booking forms",
      "Review collection and referral tools",
      "Integrations with the tools you already use",
    ],
  },
];
