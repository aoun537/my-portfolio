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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured yet. Please email me directly." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM ?? "Portfolio Contact <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: [site.email],
    replyTo: email,
    subject: `New enquiry from ${name}${location ? ` (${location})` : ""}`,
    text: [
      `Name: ${name}`,
      `Location: ${location || "Not provided"}`,
      `Email: ${email}`,
      `Interested in: ${topics.length ? topics.join(", ") : "Not specified"}`,
      `Preferred channel: ${preference || "Not specified"}`,
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
