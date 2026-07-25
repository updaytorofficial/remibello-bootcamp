"use client";

import { useState, FormEvent } from "react";

const TRACKS = [
  "Prompt Engineering (AI)",
  "Graphic Design",
  "Photo Editing",
  "All Tracks",
] as const;

type Status = "idle" | "loading" | "success" | "error";

export default function RegistrationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      fullName: String(data.get("fullName") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      track: String(data.get("track") || "").trim(),
      age: String(data.get("age") || "").trim(),
      experience: String(data.get("experience") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Registration failed. Please try again.");
      }

      setStatus("success");
      setMessage(
        "You're registered! We'll contact you soon. Check your phone for updates."
      );
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-mist-100">Full name *</span>
          <input
            name="fullName"
            required
            minLength={2}
            maxLength={80}
            placeholder="Your full name"
            className="input-field"
            autoComplete="name"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-mist-100">Phone / WhatsApp *</span>
          <input
            name="phone"
            required
            type="tel"
            placeholder="0703 596 5544"
            className="input-field"
            autoComplete="tel"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-mist-100">Email *</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            className="input-field"
            autoComplete="email"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-mist-100">Preferred track *</span>
          <select name="track" required defaultValue="" className="input-field">
            <option value="" disabled>
              Select a track
            </option>
            {TRACKS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-mist-100">Age</span>
          <input
            name="age"
            type="number"
            min={12}
            max={80}
            placeholder="e.g. 22"
            className="input-field"
          />
        </label>

        <label className="block space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-mist-100">Experience level</span>
          <select name="experience" defaultValue="Beginner" className="input-field">
            <option>Beginner</option>
            <option>Some experience</option>
            <option>Intermediate</option>
          </select>
        </label>

        <label className="block space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-mist-100">Anything else?</span>
          <textarea
            name="notes"
            rows={3}
            maxLength={400}
            placeholder="Goals, questions, or how you heard about us…"
            className="input-field resize-y"
          />
        </label>
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full sm:w-auto">
        {status === "loading" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" />
            Submitting…
          </>
        ) : (
          "Secure my free spot"
        )}
      </button>

      {message && (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm ${
            status === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-xs text-mist-400">
        Registration is free. One registration per phone number and email.
        Limited slots — your details are sent securely to our team.
      </p>
    </form>
  );
}
