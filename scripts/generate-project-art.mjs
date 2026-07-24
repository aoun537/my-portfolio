/**
 * Generates wireframe-style SVG placeholder screenshots for the Work section.
 * Run: node scripts/generate-project-art.mjs
 * Replace the output files in /public/images/projects with real screenshots
 * when client projects are ready.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "images", "projects");
mkdirSync(outDir, { recursive: true });

const projects = [
  {
    file: "aurora.svg",
    accent: "#2FA9C4",
    name: "Aurora",
    headline: "Motion that means something.",
    sub: "An animated single-page portfolio built on Next.js and GSAP.",
    chips: ["Hero", "Work", "Process", "Contact"],
  },
  {
    file: "carton.svg",
    accent: "#E8590C",
    name: "Carton",
    headline: "A storefront built to check out.",
    sub: "Product pages, cart and Stripe checkout, tuned for speed.",
    chips: ["New in", "$49", "Add to cart", "Checkout"],
  },
];

const svg = (p) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 840" font-family="Arial, Helvetica, sans-serif">
  <rect width="1280" height="840" rx="14" fill="#ffffff"/>
  <rect width="1280" height="64" rx="14" fill="#211f20"/>
  <rect y="30" width="1280" height="34" fill="#211f20"/>
  <circle cx="36" cy="32" r="7" fill="#e2483d"/>
  <circle cx="60" cy="32" r="7" fill="#f5a623"/>
  <circle cx="84" cy="32" r="7" fill="#1e9e63"/>
  <rect x="360" y="18" width="560" height="28" rx="14" fill="#3a383a"/>
  <text x="640" y="38" text-anchor="middle" font-size="15" fill="#b9b7b9">${p.name.toLowerCase()}.app</text>
  <rect x="48" y="104" width="150" height="30" rx="6" fill="${p.accent}"/>
  <text x="64" y="125" font-size="16" font-weight="bold" fill="#ffffff">${p.name}</text>
  <rect x="920" y="104" width="120" height="30" rx="15" fill="#211f20"/>
  <rect x="1060" y="104" width="172" height="30" rx="15" fill="${p.accent}"/>
  <text x="80" y="260" font-size="58" font-weight="bold" fill="#211f20">${p.headline}</text>
  <text x="80" y="308" font-size="24" fill="#77747a">${p.sub}</text>
  <rect x="80" y="350" width="180" height="48" rx="24" fill="${p.accent}"/>
  <rect x="276" y="350" width="180" height="48" rx="24" fill="none" stroke="#211f20" stroke-width="2"/>
  ${p.chips
    .map(
      (chip, i) => `
  <g transform="translate(${80 + i * 292}, 460)">
    <rect width="268" height="220" rx="12" fill="#f3f3f1"/>
    <rect x="20" y="20" width="90" height="26" rx="13" fill="${p.accent}" opacity="${0.25 + i * 0.22}"/>
    <text x="20" y="88" font-size="21" font-weight="bold" fill="#211f20">${chip}</text>
    <rect x="20" y="112" width="228" height="10" rx="5" fill="#dddbd7"/>
    <rect x="20" y="132" width="180" height="10" rx="5" fill="#dddbd7"/>
    <rect x="20" y="152" width="204" height="10" rx="5" fill="#dddbd7"/>
    <rect x="20" y="180" width="110" height="22" rx="11" fill="#211f20"/>
  </g>`,
    )
    .join("")}
  <rect x="80" y="720" width="1152" height="70" rx="12" fill="#211f20"/>
  <circle cx="130" cy="755" r="18" fill="${p.accent}"/>
  <rect x="170" y="738" width="300" height="12" rx="6" fill="#4a484a"/>
  <rect x="170" y="760" width="220" height="12" rx="6" fill="#3a383a"/>
  <rect x="1020" y="740" width="180" height="32" rx="16" fill="${p.accent}"/>
</svg>`;

for (const project of projects) {
  writeFileSync(join(outDir, project.file), svg(project), "utf8");
  console.log("wrote", project.file);
}
