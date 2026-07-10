/**
 * Single source of truth for identity, contact, and SEO configuration.
 * Update SITE_URL once you purchase the final domain.
 */

export const SITE_URL = "https://shamsuzair.example.com";

export const site = {
  name: "Shams Uzair",
  firstName: "SHAMS",
  lastName: "UZAIR",
  initials: "SU",
  role: "Local SEO Expert and Certified Vibe Coder",
  shortRole: "Local SEO Expert",
  yearsExperience: "4+",
  location: "Pakistan",
  serviceArea: "United States, United Kingdom, Canada, and Australia",
  email: "shamsuzair29@gmail.com",
  tagline: "I help local businesses win the map pack and turn nearby searches into booked customers.",
  description:
    "Shams Uzair is a Local SEO Expert and Certified Vibe Coder with over 4 years of experience helping local businesses rank higher on Google, dominate the map pack, and convert local searches into revenue. Services include Local SEO websites, website copy, website management, Google Business Profile management, and custom systems such as leads dashboards, taxi booking platforms, and restaurant management systems.",
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
    "Shams Uzair",
  ],
  social: {
    instagram: "https://www.instagram.com/shamsuzair24/",
    linkedin: "https://www.linkedin.com/in/uzair-co/",
    github: "https://github.com/xcipherx1/",
  },
} as const;

export type Site = typeof site;
