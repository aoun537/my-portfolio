# Shams Uzair | Local SEO Expert Portfolio

Single-page portfolio for Shams Uzair, Local SEO Expert and Certified Vibe Coder. Built with Next.js (App Router), TypeScript, GSAP, and Lenis.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
```

## Contact form (Resend)

1. Create an API key at https://resend.com/api-keys
2. Copy `.env.example` to `.env.local` and paste the key into `RESEND_API_KEY`
3. Optional: once your domain is verified in Resend, set `RESEND_FROM` to something like `Shams Uzair <hello@yourdomain.com>`

Without a key the form degrades gracefully and shows the direct email fallback.

## Where to edit content

All copy lives in typed data files, so you never touch components to change words:

| File | Contains |
| --- | --- |
| `src/lib/site.ts` | Name, role, email, tagline, keywords, social links, `SITE_URL` |
| `src/lib/services.ts` | Toolkit groups (SEARCH/LOCAL/BUILD/SHIP), rail chips, hero marquee items |
| `src/lib/serviceDetails.ts` | Per-service inclusion lists |
| `src/lib/projects.ts` | Work showcase projects and ranking case studies |
| `src/lib/trust.ts` | Stats, credentials, differentiators, testimonials |
| `src/lib/process.ts` | Five process steps, headlines, and per-step colors |
| `src/lib/faqs.ts` | FAQ questions and answers (also feeds FAQPage schema) |
| `src/lib/accent.ts` | The global accent palette cycled on every menu toggle |

## Before going live

- [ ] Set the real domain in `SITE_URL` (`src/lib/site.ts`)
- [ ] Replace placeholder projects and swap SVG mockups in `public/images/projects/` with real screenshots (1280x840 or similar)
- [ ] Replace placeholder testimonials in `src/lib/trust.ts` with real client quotes
- [ ] Add social profile URLs in `src/lib/site.ts`
- [ ] Add `RESEND_API_KEY` to the hosting environment (for example Vercel project settings)
- [ ] Add an Open Graph image (`src/app/opengraph-image.png`, 1200x630)

## Folder structure

```
src/
  app/            Routes, layout, global styles, API route, sitemap/robots
  components/
    fx/           Full-page effects: preloader, cursor, plus-grid canvas
    layout/       Navbar, menu overlay, floating controls, footer
    providers/    Theme and Lenis smooth-scroll providers
    sections/     One folder-free component + CSS module per page section
  lib/            Typed content data, GSAP setup, accent palette, letter physics, schema
scripts/          Placeholder artwork generator
public/images/    Project mockups (replace with real screenshots)
```

## Architecture notes

- One global `--accent` CSS variable drives every accent-colored element; it cycles through the palette (`src/lib/accent.ts`) on each menu open/close
- Theme (light default, dark toggle) is set on `<html data-theme>` before paint by an inline script; all tokens live in `src/app/globals.css`
- Lenis smooth scrolling and GSAP ScrollTrigger share one ticker (`src/components/providers/SmoothScroll.tsx`)
- Heading letters are driven by a shared spring-physics cursor-repulsion engine (`src/lib/letterFx.ts`); one ticker loop serves every heading
- Hero letters use a two-span structure: the outer span belongs to the scroll-collapse animation, the inner span to the intro, so the two never fight over start values
- The How I Work word is two stacked text copies clipped to each circle via CSS variables, which is what produces the hard two-tone split along the accent circle's edge
- JSON-LD (Person, ProfessionalService, FAQPage) is emitted from `src/lib/schema.ts`
- `scripts/generate-project-art.mjs` regenerates the placeholder project mockups
- No secrets live in the repo: the Resend key is read from `RESEND_API_KEY` at runtime and `.env*` is gitignored
