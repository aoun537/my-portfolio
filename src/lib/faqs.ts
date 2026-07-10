/**
 * FAQ content. Also serialized into FAQPage JSON-LD in the SEO layer.
 * Keep answers direct and free of en or em dashes.
 */

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What does a Local SEO Expert actually do?",
    answer:
      "A Local SEO Expert makes your business show up when nearby customers search for what you sell. That covers your website structure and copy, your Google Business Profile, reviews, citations, and schema markup. The goal is simple: more calls, more direction requests, and more bookings from people in your service area.",
  },
  {
    question: "How long does Local SEO take to show results?",
    answer:
      "Most local businesses see measurable movement in 60 to 90 days, with map pack positions typically strengthening between 3 and 6 months. Timelines depend on your competition, your starting point, and how fast we can publish the pages and profile updates your market needs.",
  },
  {
    question: "Do you only build new websites or can you fix my current one?",
    answer:
      "Both. If your current site has good bones I will restructure, rewrite, and optimize it. If it is holding you back I will rebuild it on WordPress with Elementor or as a custom coded site, whichever fits your budget and goals. Every build ships with local SEO baked in from day one.",
  },
  {
    question: "What is included in Google Business Profile management?",
    answer:
      "Category and service optimization, weekly posts, photo updates, Q and A management, review responses, spam fighting for fake competitor listings, and monthly reporting on calls, clicks, and direction requests. Your profile becomes a managed sales channel instead of a forgotten listing.",
  },
  {
    question: "What custom systems can you build for a local business?",
    answer:
      "Leads management dashboards, taxi booking systems, restaurant management systems, quote calculators, review collection tools, and other software specific to your operation. As a Certified Vibe Coder I build these with modern AI-first tooling, which means custom software at a price a local business can justify.",
  },
  {
    question: "Where are you based and which markets do you serve?",
    answer:
      "I am based in Pakistan and work with local businesses in the United States, United Kingdom, Canada, Australia, and worldwide. Local SEO is done remotely by nature, and my hours overlap with morning meetings in the US and afternoon meetings in the UK and Europe.",
  },
  {
    question: "How much do your services cost?",
    answer:
      "Local SEO websites and custom systems are quoted per project after a short discovery call. Ongoing services like GBP management and website management are monthly retainers. Send a message through the contact form with your business type and city, and you will get a clear quote with no surprises.",
  },
];
