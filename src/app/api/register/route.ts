import { NextRequest, NextResponse } from "next/server";
import {
  createRegistration,
  DuplicateRegistrationError,
} from "@/lib/registrations";

type RegistrationBody = {
  fullName?: string;
  phone?: string;
  email?: string;
  track?: string;
  age?: string;
  experience?: string;
  notes?: string;
};

const ALLOWED_TRACKS = new Set([
  "Prompt Engineering (AI)",
  "Graphic Design",
  "Photo Editing",
  "Cartoon Video (Bonus)",
  "All Tracks",
]);

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegistrationBody;

    const fullName = (body.fullName || "").trim();
    const phone = (body.phone || "").trim();
    const email = (body.email || "").trim();
    const track = (body.track || "").trim();
    const age = (body.age || "").trim();
    const experience = (body.experience || "").trim();
    const notes = (body.notes || "").trim();

    if (fullName.length < 2 || fullName.length > 80) {
      return NextResponse.json(
        { error: "Please enter a valid full name." },
        { status: 400 }
      );
    }

    if (phone.length < 8 || phone.length > 20) {
      return NextResponse.json(
        { error: "Please enter a valid phone / WhatsApp number." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Please enter your email address." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TRACKS.has(track)) {
      return NextResponse.json(
        { error: "Please select a valid bootcamp track." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    let registration;
    try {
      registration = await createRegistration({
        fullName,
        phone,
        email,
        track,
        age,
        experience,
        notes,
      });
    } catch (err) {
      if (err instanceof DuplicateRegistrationError) {
        return NextResponse.json({ error: err.message, field: err.field }, { status: 409 });
      }
      throw err;
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const submittedAt = new Date().toLocaleString("en-NG", {
        timeZone: "Africa/Lagos",
        dateStyle: "medium",
        timeStyle: "short",
      });

      const text = [
        `<b>🎓 New Bootcamp Registration</b>`,
        ``,
        `<b>Name:</b> ${escapeHtml(fullName)}`,
        `<b>Phone:</b> ${escapeHtml(phone)}`,
        `<b>Email:</b> ${escapeHtml(email || "—")}`,
        `<b>Track:</b> ${escapeHtml(track)}`,
        `<b>Age:</b> ${escapeHtml(age || "—")}`,
        `<b>Experience:</b> ${escapeHtml(experience || "—")}`,
        `<b>Notes:</b> ${escapeHtml(notes || "—")}`,
        ``,
        `<i>Step Up 15 Days Bootcamp · ${escapeHtml(submittedAt)} WAT</i>`,
      ].join("\n");

      try {
        const telegramRes = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "HTML",
              disable_web_page_preview: true,
            }),
          }
        );
        const telegramData = await telegramRes.json();
        if (!telegramRes.ok || !telegramData.ok) {
          console.error("Telegram API error:", telegramData);
        }
      } catch (telegramErr) {
        console.error("Telegram send failed:", telegramErr);
      }
    }

    return NextResponse.json({ ok: true, id: registration.id });
  } catch (err) {
    console.error("Register route error:", err);
    const message =
      err instanceof Error && /EROFS|read-only|EACCES|Blob/i.test(err.message)
        ? "Registration storage is unavailable. Please try again shortly or call 07035965544."
        : "Unexpected error. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
