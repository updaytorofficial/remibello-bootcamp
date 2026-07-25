"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/types";

type Props = {
  post?: BlogPost;
};

export default function PostEditor({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [author, setAuthor] = useState(post?.author || "the RemiBello");
  const [published, setPublished] = useState(post?.published ?? true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title,
      slug: slug || undefined,
      excerpt,
      content,
      coverImage,
      author,
      published,
    };

    try {
      const res = await fetch(
        post ? `/api/admin/posts/${post.id}` : "/api/admin/posts",
        {
          method: post ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block space-y-2">
        <span className="text-sm text-mist-100">Title *</span>
        <input
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Bootcamp week one highlights"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-mist-100">Slug (optional)</span>
          <input
            className="input-field"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-from-title"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-mist-100">Author</span>
          <input
            className="input-field"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-mist-100">Cover image URL (optional)</span>
        <input
          className="input-field"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://…"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-mist-100">Excerpt</span>
        <textarea
          className="input-field min-h-[80px]"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary for cards and social shares"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-mist-100">Content *</span>
        <textarea
          className="input-field min-h-[280px] font-mono text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Write your post… Use blank lines between paragraphs."
        />
      </label>

      <label className="flex items-center gap-3 text-sm text-mist-100">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-ink-800 text-ember-500 focus:ring-ember-500/40"
        />
        Publish now (visible on public blog)
      </label>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving…" : post ? "Update post" : "Create post"}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => router.push("/admin")}
        >
          Cancel
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}
    </form>
  );
}
