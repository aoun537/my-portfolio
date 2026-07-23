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
    question: "What kind of web development do you do?",
    answer:
      "Custom marketing sites and e-commerce storefronts, mostly with React, Next.js, and TypeScript. That covers the interface people use, the content layer behind it, and the deployment pipeline that gets it live. I also take on performance and accessibility work on sites that already exist.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "A focused marketing site is usually 2 to 4 weeks. An e-commerce storefront with product pages, checkout, and payment integration is more often 4 to 8 weeks depending on catalogue size. I scope the first milestone tightly so you see something working early rather than waiting until the end.",
  },
  {
    question: "Can you fix or improve my existing site instead of rebuilding it?",
    answer:
      "Often yes, and it is usually the cheaper answer. If the codebase has good bones I will refactor, optimize, and extend it. A rebuild only makes sense when the current stack is actively fighting you, and I will tell you plainly which situation you are in before you spend anything.",
  },
  {
    question: "What does the accessibility and performance work involve?",
    answer:
      "I measure first with Lighthouse and Core Web Vitals, then fix what actually moves the number: bundle size, image and font loading, render blocking, and layout shift. Accessibility work covers semantic markup, keyboard navigation, focus order, and contrast, tested with a screen reader rather than assumed.",
  },
  {
    question: "What is a Certified Vibe Coder?",
    answer:
      "It means I build with AI-first tooling such as Cursor and Claude Code, with human review on every line that ships. The tooling speeds up the typing, not the thinking. Architecture, review, and the decision about what is actually correct stay with me, which is what keeps the result maintainable.",
  },
  {
    question: "Where are you based and how do you work with clients?",
    answer:
      "I am based in Pakistan and work remotely with clients in the United States, United Kingdom, Canada, Australia, and worldwide. My hours overlap with morning meetings in the US and afternoon meetings in the UK and Europe. Work happens in a shared repository so you can see progress at any point.",
  },
  {
    question: "How much do your services cost?",
    answer:
      "Websites and storefronts are quoted per project after a short discovery call, so the number reflects your actual scope rather than a package. Maintenance is a monthly retainer. Send a message through the contact form describing what you need and you will get a clear quote with no surprises.",
  },
];
