"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";
import styles from "./Contact.module.css";

const TOPICS = ["Full-Time Role", "Freelance / Contract", "Building a Product"];
const CHANNELS = ["WhatsApp", "Email"] as const;

type Status = "idle" | "sending" | "sent" | "error";

/** Wraps each word in a revealable span for the scroll-tied reveal. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} data-reveal className="revealWord">
          {word}
          {" "}
        </span>
      ))}
    </>
  );
}

/**
 * Conversational, left-aligned contact form. Inputs sit inline inside
 * the sentences as underlined blanks on the text baseline. The section
 * background is a light tint of the CURRENT accent, so it recolors
 * with the rest of the page.
 */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>("Email");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      /*
       * Scroll-tied reveal, line by line and word by word: each form
       * line writes itself in as it passes through the viewport band.
       * Scrubbed, so scrolling back rewinds the writing.
       */
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", section);
      const submit = section.querySelector<HTMLElement>(`.${styles.submit}`);

      rows.forEach((row) => {
        if (row === submit) return;
        const pieces = gsap.utils.toArray<HTMLElement>("[data-reveal]", row);
        const targets = pieces.length > 0 ? pieces : [row];
        gsap.fromTo(
          targets,
          { opacity: 0.08, y: 14 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: {
              trigger: row,
              start: "top 92%",
              end: "top 58%",
              scrub: 0.4,
            },
          },
        );
      });

      /* The big Send message CTA is the final beat */
      if (submit) {
        gsap.fromTo(
          submit,
          { opacity: 0, y: 30, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power1.out",
            scrollTrigger: {
              trigger: submit,
              start: "top 96%",
              end: "top 68%",
              scrub: 0.4,
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      location: String(data.get("country") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      topics: topic ? [topic] : [],
      preference: channel,
    };

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("sent");
        form.reset();
        setTopic(null);
      } else {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(body?.error ?? "Something went wrong. Please email me directly.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please email me directly.");
      setStatus("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="contact"
      aria-labelledby="contact-heading"
    >
      <span className={`eyebrow ${styles.eyebrow}`}>Start a Project</span>
      <h2 id="contact-heading" className="srOnly">
        Contact {site.name}: Start Your {site.shortRole} or Custom Build Project
      </h2>

      {status === "sent" ? (
        <div className={styles.success} role="status">
          <p className={styles.successTitle}>Message sent.</p>
          <p className={styles.successText}>
            Thanks for reaching out. I read every enquiry myself and will reply within one business
            day with next steps or a couple of sharp questions.
          </p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.row} data-row>
            <label htmlFor="contact-name">
              <Words text={`Hey, ${site.firstName}! My name is`} />
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Your Name"
              autoComplete="name"
              required
              className={styles.input}
              data-reveal
            />
            <span>
              <Words text="and I am from" />
            </span>
            <input
              id="contact-country"
              name="country"
              type="text"
              placeholder="Country"
              autoComplete="country-name"
              className={styles.input}
              data-reveal
            />
          </p>

          <div className={styles.row} data-row>
            <span id="contact-topics-label">
              <Words text="Let's connect about" />
            </span>
            <span className={styles.pills} role="group" aria-labelledby="contact-topics-label" data-reveal>
              {TOPICS.map((item) => {
                const active = topic === item;
                return (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.pill} ${active ? styles.pillActive : ""}`}
                    aria-pressed={active}
                    onClick={() => setTopic(active ? null : item)}
                  >
                    {item}
                  </button>
                );
              })}
            </span>
          </div>

          <p className={styles.row} data-row>
            <label htmlFor="contact-email">
              <Words text="We can talk in more detail at" />
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="your email"
              autoComplete="email"
              required
              className={`${styles.input} ${styles.inputWide}`}
              data-reveal
            />
            <span className={styles.pills} role="group" aria-label="Preferred channel" data-reveal>
              {CHANNELS.map((item) => {
                const active = channel === item;
                return (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.pill} ${active ? styles.pillActive : ""}`}
                    aria-pressed={active}
                    onClick={() => setChannel(item)}
                  >
                    {item}
                  </button>
                );
              })}
            </span>
          </p>

          <p className={styles.row} data-row>
            <label htmlFor="contact-message">
              <Words text="In short," />
            </label>
            <input
              id="contact-message"
              name="message"
              type="text"
              placeholder="Type your message"
              required
              className={`${styles.input} ${styles.inputFull}`}
              data-reveal
            />
          </p>

          {status === "error" && (
            <p className={styles.error} role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className={styles.submit} data-row disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send message"}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 18 18 6M9 6h9v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      )}

      <p className={styles.fallback}>
        Or just write me at{" "}
        <a href={`mailto:${site.email}`} className={styles.fallbackLink}>
          {site.email}
        </a>
      </p>
    </section>
  );
}
