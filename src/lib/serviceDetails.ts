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
    id: "custom-website",
    title: "Custom Website",
    summary:
      "A site built for your business rather than bent out of a template: fast, responsive, and structured so it is still easy to change a year from now.",
    inclusions: [
      "Responsive layouts from mobile up",
      "Component library your team can reuse",
      "Accessible markup and keyboard navigation",
      "Core Web Vitals and Lighthouse tuning",
      "CMS wiring so you can edit content yourself",
      "Analytics and search console setup",
    ],
  },
  {
    id: "web-application",
    title: "Web Application",
    summary:
      "Product work rather than pages: dashboards, portals, and internal tools with real state, real auth, and a database behind them.",
    inclusions: [
      "React and Next.js application architecture",
      "Authentication, roles, and permissions",
      "Database schema design and migrations",
      "REST or tRPC API layer with typed contracts",
      "Third party integrations and webhooks",
      "Automated tests on the paths that matter",
    ],
  },
  {
    id: "ecommerce",
    title: "E-commerce Storefront",
    summary:
      "A storefront that loads fast and checks out cleanly, because every extra second and extra field costs you orders.",
    inclusions: [
      "Product, collection, and search pages",
      "Cart and checkout flow optimization",
      "Stripe or provider payment integration",
      "Inventory and order management hooks",
      "Structured data for product listings",
      "Speed budget held through launch",
    ],
  },
  {
    id: "website-maintenance",
    title: "Website Maintenance",
    summary:
      "Your site stays fast, patched, and current while you run the business. No more chasing a developer for a small change.",
    inclusions: [
      "Content updates and new page builds",
      "Dependency and security patching",
      "Automated backups and uptime monitoring",
      "Bug fixes with a clear turnaround",
      "Monthly performance and health report",
      "Priority queue for change requests",
    ],
  },
  {
    id: "performance",
    title: "Performance & Accessibility",
    summary:
      "For sites that already exist but feel slow or shut people out. I measure first, fix what actually moves the number, and show the before and after.",
    inclusions: [
      "Lighthouse and Core Web Vitals audit",
      "Bundle analysis and code splitting",
      "Image, font, and asset optimization",
      "WCAG contrast and focus order fixes",
      "Screen reader and keyboard testing",
      "Written report with prioritized fixes",
    ],
  },
];
