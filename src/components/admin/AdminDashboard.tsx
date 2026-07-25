"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BlogPost } from "@/lib/types";

export default function AdminDashboard({
  posts,
  registrationCount,
}: {
  posts: BlogPost[];
  registrationCount: number;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
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
            Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/posts/new" className="btn-primary">
            New post
          </Link>
          <Link href="/blog" className="btn-ghost">
            View blog
          </Link>
          <button type="button" onClick={logout} className="btn-ghost">
            Log out
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/registrations"
          className="rounded-2xl border border-ember-500/30 bg-ember-500/10 p-6 transition hover:border-ember-400/50 hover:bg-ember-500/15"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-ember-400">
            Registrations
          </p>
          <p className="mt-3 font-display text-5xl tracking-wide text-mist-50">
            {registrationCount}
          </p>
          <p className="mt-2 text-sm text-mist-300">
            View all registered members →
          </p>
        </Link>
        <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-mist-400">
            Blog posts
          </p>
          <p className="mt-3 font-display text-5xl tracking-wide text-mist-50">
            {posts.length}
          </p>
          <p className="mt-2 text-sm text-mist-300">Published & drafts</p>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-3xl tracking-wide text-mist-50">
            Blog posts
          </h2>
          <Link
            href="/admin/registrations"
            className="text-sm text-ember-400 hover:text-ember-300"
          >
            Registered members →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
            <p className="text-mist-300">No posts yet.</p>
            <Link
              href="/admin/posts/new"
              className="btn-primary mt-6 inline-flex"
            >
              Write your first post
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/70">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-medium text-mist-50">
                      {post.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-wide ${
                        post.published
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-white/10 text-mist-400"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-mist-400">
                    /blog/{post.slug} ·{" "}
                    {new Date(post.updatedAt).toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-mist-200 hover:border-ember-500/40"
                  >
                    Open
                  </Link>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-mist-200 hover:border-ember-500/40"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    disabled={busyId === post.id}
                    onClick={() => remove(post.id)}
                    className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
