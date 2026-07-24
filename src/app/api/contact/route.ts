import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

export const runtime = "nodejs";

interface ContactPayload {
  name: string;
  location: string;
  topics: string[];
  email: string;
  message: string;
  /** Preferred reply channel: WhatsApp or Email. */
  preference?: string;
}

const MAX_LENGTHS: Record<keyof Omit<ContactPayload, "topics" | "preference">, number> = {
  name: 120,
  location: 120,
  email: 254,
  message: 4000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Best-effort in-memory rate limit: 5 requests per 10 minutes per IP. */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

function sanitize(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n<>]/g, " ").trim().slice(0, max);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages in a short time. Please try again later." },
      { status: 429 },
    );
  }

  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = sanitize(body.name, MAX_LENGTHS.name);
  const location = sanitize(body.location, MAX_LENGTHS.location);
  const email = sanitize(body.email, MAX_LENGTHS.email);
  const topics = Array.isArray(body.topics)
    ? body.topics.filter((t): t is string => typeof t === "string").slice(0, 6)
    : [];
  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, MAX_LENGTHS.message) : "";
  const preference = sanitize(body.preference, 40);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const subject = `New enquiry from ${name}${location ? ` (${location})` : ""}`;
  const interestedIn = topics.length ? topics.join(", ") : "Not specified";
  const channel = preference || "Not specified";

  /*
   * Two delivery paths, in order of preference:
   *  1. Resend, if RESEND_API_KEY is set (best deliverability, from your own
   *     domain once verified).
   *  2. FormSubmit otherwise: no account or key, forwards to site.email.
   *     The first message ever sent triggers a one-time activation email
   *     to that address; click its link once and every later message
   *     arrives straight in the inbox.
   */
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    const resend = new Resend(apiKey);
    const fromAddress = process.env.RESEND_FROM ?? "Portfolio Contact <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [site.email],
      replyTo: email,
      subject,
      text: [
        `Name: ${name}`,
        `Location: ${location || "Not provided"}`,
        `Email: ${email}`,
        `Interested in: ${interestedIn}`,
        `Preferred channel: ${channel}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Could not send your message right now. Please email me directly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  /*
   * FormSubmit rejects requests without an Origin/Referer (its "open through
   * a web server" guard), so pass the caller's own origin through.
   */
  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: origin,
        Referer: `${origin}/`,
      },
      body: JSON.stringify({
        Name: name,
        Email: email,
        Location: location || "Not provided",
        "Interested in": interestedIn,
        "Preferred channel": channel,
        Message: message,
        _subject: subject,
        _template: "table",
        _captcha: "false",
      }),
    });

    const data = (await response.json().catch(() => null)) as { success?: unknown } | null;
    const succeeded = data?.success === true || data?.success === "true";

    if (response.ok && succeeded) {
      return NextResponse.json({ ok: true });
    }

    console.error("FormSubmit error:", response.status, data);
    return NextResponse.json(
      { error: "Could not send your message right now. Please email me directly." },
      { status: 502 },
    );
  } catch (err) {
    console.error("FormSubmit exception:", err);
    return NextResponse.json(
      { error: "Could not send your message right now. Please email me directly." },
      { status: 502 },
    );
  }
}
