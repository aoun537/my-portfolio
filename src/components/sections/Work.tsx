"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { bindShift } from "@/lib/letterFx";
import { projects, buildStandards, type Project, type BuildStandard } from "@/lib/projects";
import styles from "./Work.module.css";

/**
 * Showcase panel. The giant title splits HORIZONTALLY along its own
 * mid-line: the top half of the letters travels UP and the bottom half
 * travels DOWN. The artwork stays fully hidden until the halves have
 * cleared, then reveals in the emptied center band. The pills and
 * blurb underneath split from the center afterwards.
 */
function ShowcasePanel({ project }: { project: Project }) {
  const panelRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      const topHalf = panel.querySelector<HTMLElement>("[data-title-top]");
      const bottomHalf = panel.querySelector<HTMLElement>("[data-title-bottom]");
      const shot = panel.querySelector<HTMLElement>(`.${styles.shot}`);
      const pillLeft = panel.querySelector<HTMLElement>("[data-pill-left]");
      const pillRight = panel.querySelector<HTMLElement>("[data-pill-right]");
      const blurb = panel.querySelector<HTMLElement>(`.${styles.blurb}`);

      let blurbChars: HTMLElement[] = [];
      let split: SplitText | null = null;
      if (blurb) {
        split = new SplitText(blurb, { type: "chars", charsClass: styles.blurbChar });
        blurbChars = split.chars as HTMLElement[];
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: "+=115%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      /* 1. Split: top half up, bottom half down, along the mid-line */
      if (topHalf && bottomHalf) {
        tl.to(topHalf, { y: "-36vh", ease: "power3.inOut", duration: 0.48 }, 0);
        tl.to(bottomHalf, { y: "36vh", ease: "power3.inOut", duration: 0.48 }, 0);
      }

      /* 2. Image reveals ONLY after the halves have fully cleared,
            opening from the emptied center band */
      if (shot) {
        tl.fromTo(
          shot,
          { clipPath: "inset(50% 0% 50% 0% round 14px)", scale: 0.94, y: 26 },
          {
            clipPath: "inset(0% 0% 0% 0% round 14px)",
            scale: 1,
            y: 0,
            ease: "power3.out",
            duration: 0.4,
          },
          0.5,
        );
      }

      /* 3. Caption splits from the center */
      if (pillLeft && pillRight) {
        tl.fromTo(
          pillLeft,
          { x: () => pillLeft.offsetWidth / 2 + 10, opacity: 0 },
          { x: 0, opacity: 1, ease: "power3.out", duration: 0.26 },
          0.7,
        );
        tl.fromTo(
          pillRight,
          { x: () => -(pillRight.offsetWidth / 2 + 10), opacity: 0 },
          { x: 0, opacity: 1, ease: "power3.out", duration: 0.26 },
          0.7,
        );
      }

      if (blurbChars.length > 0) {
        tl.fromTo(
          blurbChars,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.26,
            ease: "power2.out",
            stagger: { each: 0.005, from: "center" },
          },
          0.76,
        );
      }

      return () => split?.revert();
    },
    { scope: panelRef },
  );

  const halves = (
    <span className={styles.titleText}>{project.name}</span>
  );

  return (
    <article ref={panelRef} className={styles.panel}>
      <h3 className="srOnly">
        {project.name}: {project.category.toLowerCase()} project
      </h3>

      <div className={styles.stage}>
        <div className={styles.shot}>
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={1280}
            height={840}
            className={styles.shotImage}
            unoptimized
          />
          <a
            href={project.href ?? "#contact"}
            target={project.href ? "_blank" : undefined}
            rel={project.href ? "noopener noreferrer" : undefined}
            className={styles.viewCase}
            aria-label={`View the ${project.name} case`}
          >
            VIEW
            <br />
            CASE
          </a>
        </div>

        {/* Two clipped copies of the title form the split halves */}
        <span className={styles.title} aria-hidden="true">
          <span data-title-top className={`${styles.titleHalf} ${styles.titleTop}`}>
            {halves}
          </span>
          <span data-title-bottom className={`${styles.titleHalf} ${styles.titleBottom}`}>
            {halves}
          </span>
        </span>
      </div>

      <div className={styles.caption}>
        <div className={styles.pills}>
          <span data-pill-left className={styles.pill} style={{ borderColor: project.accent }}>
            {project.stack}
          </span>
          <span
            data-pill-right
            className={`${styles.pill} ${styles.pillSolid}`}
            style={{ backgroundColor: project.accent }}
          >
            {project.category}
          </span>
        </div>
        <p className={styles.blurb}>{project.blurb}</p>
      </div>
    </article>
  );
}

/** One quality bar, shown as a stat card with an optional count-up. */
function StandardCard({ item, index }: { item: BuildStandard; index: number }) {
  return (
    <article className={styles.rankCard} data-rank-card>
      <div className={styles.standardValue}>
        {item.countTo !== undefined ? (
          <span data-standard-counter={item.countTo} data-standard-suffix={item.suffix ?? ""}>
            0{item.suffix ?? ""}
          </span>
        ) : (
          <span>{item.value}</span>
        )}
      </div>

      <p className={styles.standardLabel}>{item.label}</p>
      <p className={styles.standardDetail}>{item.detail}</p>

      <span className={styles.rankIndex}>0{index + 1}</span>
    </article>
  );
}

function Standards() {
  const blockRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const block = blockRef.current;
      if (!block) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-rank-card]", block);
      gsap.from(cards, {
        y: 90,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: block, start: "top 75%" },
      });

      /* Numeric values count up from zero */
      gsap.utils.toArray<HTMLElement>("[data-standard-counter]", block).forEach((el) => {
        const to = Number(el.dataset.standardCounter);
        const suffix = el.dataset.standardSuffix ?? "";
        const state = { value: 0 };
        gsap.to(state, {
          value: to,
          duration: 1.8,
          ease: "power3.out",
          delay: 0.4,
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = `${Math.round(state.value)}${suffix}`;
          },
        });
      });

      /* Letter shift on the colored heading words */
      const accentWord = block.querySelector<HTMLElement>(`.${styles.rankingsHeading} span`);
      if (accentWord) return bindShift(accentWord);
    },
    { scope: blockRef },
  );

  return (
    <div ref={blockRef} className={styles.rankings}>
      <span className="eyebrow">How I Build</span>
      <h3 className={styles.rankingsHeading}>
        Quality That Is Measured, <span>Not Promised.</span>
      </h3>
      <div className={styles.rankGrid}>
        {buildStandards.map((item, i) => (
          <StandardCard key={item.label} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

/** Split-reveal showcases, ranking case studies, and the archive close. */
export default function Work() {
  const introRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* Letter shift on the colored heading words */
      const accentWord = introRef.current?.querySelector<HTMLElement>(
        `.${styles.introHeading} span`,
      );
      if (accentWord) return bindShift(accentWord);
    },
    { scope: introRef },
  );

  return (
    <section className={styles.section} id="work" aria-labelledby="work-heading">
      <div ref={introRef} className={styles.intro}>
        <span className="eyebrow">Selected Works</span>
        <h2 id="work-heading" className={styles.introHeading}>
          Websites &amp; Interfaces <span>Built to Last.</span>
        </h2>
      </div>

      {projects.map((project) => (
        <ShowcasePanel key={project.slug} project={project} />
      ))}

      <Standards />

      <div className={styles.archive}>
        <p className={styles.archiveStatement}>
          A selection of the work. Every build ships typed, accessible, and fast, and stays that way
          after <span>I hand it over.</span>
        </p>
        <div className={styles.archiveFooter}>
          <div className={styles.archiveNote}>
            <span>EVERY PIXEL INTENTIONAL</span>
            <span>EVERY BUILD, SHIPPED</span>
          </div>
          <a href="#contact" className={styles.archiveLink}>
            START YOUR PROJECT
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
