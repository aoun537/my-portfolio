import { site, SITE_URL } from "@/lib/site";
import { faqs } from "@/lib/faqs";
import { serviceDetails } from "@/lib/serviceDetails";

/**
 * JSON-LD structured data: Person, ProfessionalService, and FAQPage
 * bundled in one @graph for a single script tag.
 */

const personId = `${SITE_URL}/#person`;
const serviceId = `${SITE_URL}/#service`;

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      jobTitle: "Local SEO Expert",
      description: site.tagline,
      email: `mailto:${site.email}`,
      url: SITE_URL,
      address: {
        "@type": "PostalAddress",
        addressCountry: "PK",
      },
      knowsAbout: [
        "Local SEO",
        "Google Business Profile Optimization",
        "Local SEO Website Design",
        "Website Copywriting",
        "WordPress",
        "Custom Business Software",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": serviceId,
      name: `${site.name} | Local SEO Services`,
      description: site.description,
      url: SITE_URL,
      founder: { "@id": personId },
      areaServed: ["United States", "United Kingdom", "Canada", "Australia", "Worldwide"],
      address: {
        "@type": "PostalAddress",
        addressCountry: "PK",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Local SEO and Custom Development Services",
        itemListElement: serviceDetails.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.summary,
          },
        })),
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
} as const;
