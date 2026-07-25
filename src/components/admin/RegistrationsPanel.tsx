"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Registration } from "@/lib/registration-types";

export default function RegistrationsPanel({
  registrations,
}: {
  registrations: Registration[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState("All");
  const [busyId, setBusyId] = useState<string | null>(null);

  const tracks = useMemo(() => {
    const set = new Set(registrations.map((r) => r.track));
    return ["All", ...Array.from(set).sort()];
  }, [registrations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return registrations.filter((r) => {
      if (track !== "All" && r.track !== track) return false;
      if (!q) return true;
      return (
        r.fullName.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.track.toLowerCase().includes(q)
      );
    });
  }, [registrations, query, track]);

  function exportCsv() {
    const headers = [
      "Full Name",
      "Phone",
      "Email",
      "Track",
      "Age",
      "Experience",
      "Notes",
      "Registered At",
    ];
    const rows = filtered.map((r) =>
      [
        r.fullName,
        r.phone,
        r.email,
        r.track,
        r.age,
        r.experience,
        r.notes,
        new Date(r.createdAt).toLocaleString("en-NG"),
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `remibello-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(href);
  }

  async function remove(id: string) {
    if (!confirm("Remove this registration?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/registrations?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ember-500">
            Admin panel
          </p>
          <h1 className="mt-2 font-display text-5xl tracking-wide text-mist-50">
            Registered members
          </h1>
          <p className="mt-2 text-sm text-mist-400">
            {registrations.length} total · {filtered.length} showing
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={exportCsv} className="btn-primary">
            Export CSV
          </button>
          <Link href="/admin" className="btn-ghost">
            Blog posts
          </Link>
          <Link href="/#register" className="btn-ghost">
            Registration form
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <input
          className="input-field"
          placeholder="Search name, phone, email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input-field"
          value={track}
          onChange={(e) => setTrack(e.target.value)}
        >
          {tracks.map((t) => (
            <option key={t} value={t}>
              {t === "All" ? "All tracks" : t}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center text-mist-400">
          No registrations found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-ink-900/70">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-mist-400">
              <tr>
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Track</th>
                <th className="px-4 py-3 font-medium">Details</th>
                <th className="px-4 py-3 font-medium">Registered</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((r) => (
                <tr key={r.id} className="align-top text-mist-200">
                  <td className="px-4 py-4">
                    <p className="font-medium text-mist-50">{r.fullName}</p>
                    {r.age && (
                      <p className="mt-1 text-xs text-mist-400">Age {r.age}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <a
                      href={`tel:${r.phone}`}
                      className="block text-ember-400 hover:underline"
                    >
                      {r.phone}
                    </a>
                    {r.email ? (
                      <a
                        href={`mailto:${r.email}`}
                        className="mt-1 block text-xs text-mist-400 hover:text-mist-200"
                      >
                        {r.email}
                      </a>
                    ) : (
                      <span className="mt-1 block text-xs text-mist-500">
                        No email
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-ember-500/15 px-2.5 py-1 text-xs text-ember-300">
                      {r.track}
                    </span>
                  </td>
                  <td className="max-w-[220px] px-4 py-4">
                    <p className="text-xs text-mist-300">
                      {r.experience || "—"}
                    </p>
                    {r.notes && (
                      <p className="mt-1 line-clamp-2 text-xs text-mist-400">
                        {r.notes}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-xs text-mist-400">
                    {new Date(r.createdAt).toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => remove(r.id)}
                      className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
