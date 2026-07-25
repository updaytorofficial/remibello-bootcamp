import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | the RemiBello Bootcamp",
  description:
    "News, tips, and updates from the RemiBello Step Up 15 Days Bootcamp Summer.",
};

export default async function BlogIndexPage() {
  const posts = await listPosts({ publishedOnly: true });

  return (
    <div className="surface-glow min-h-screen">
      <SiteHeader active="blog" />

      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-ember-500">
          From the RemiBello
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-wide text-mist-50 sm:text-6xl">
          Bootcamp blog
        </h1>
        <p className="mt-4 max-w-xl text-mist-300">
          Stories, training tips, and updates you can share with friends on any
          social platform.
        </p>

        {posts.length === 0 ? (
          <p className="mt-16 text-mist-400">
            No posts published yet. Check back soon.
          </p>
        ) : (
          <ul className="mt-14 grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.id}>
                <article className="group h-full border-t border-ember-500/30 pt-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-mist-400">
                    {new Date(post.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {" · "}
                    {post.author}
                  </p>
                  <h2 className="mt-3 font-display text-3xl tracking-wide text-mist-50 transition group-hover:text-ember-400">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="mt-3 line-clamp-3 text-mist-300">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex text-sm font-medium text-ember-400 hover:text-ember-300"
                  >
                    Read & share →
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
