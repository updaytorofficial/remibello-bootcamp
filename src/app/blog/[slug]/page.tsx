import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import ShareButtons from "@/components/ShareButtons";
import { getPostBySlug, listPosts } from "@/lib/posts";
import { renderPostHtml } from "@/lib/render";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) {
    return { title: "Post not found | the RemiBello" };
  }

  return {
    title: `${post.title} | the RemiBello Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  const shareUrl = `${siteUrl.replace(/\/$/, "")}/blog/${post.slug}`;
  const html = renderPostHtml(post.content);

  const related = (await listPosts({ publishedOnly: true }))
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="surface-glow min-h-screen">
      <SiteHeader active="blog" />

      <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <Link
          href="/blog"
          className="text-sm text-mist-400 transition hover:text-ember-400"
        >
          ← All posts
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-mist-400">
          {new Date(post.createdAt).toLocaleDateString("en-NG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {post.author}
        </p>

        <h1 className="mt-4 font-display text-5xl tracking-wide text-mist-50 sm:text-6xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-5 text-lg text-mist-300">{post.excerpt}</p>
        )}

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className="mt-8 max-h-[420px] w-full rounded-2xl object-cover"
          />
        )}

        <div
          className="mt-10"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-12 border-t border-white/10 pt-8">
          <ShareButtons
            url={shareUrl}
            title={post.title}
            excerpt={post.excerpt}
          />
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-white/5 py-14">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <h2 className="font-display text-3xl tracking-wide text-mist-50">
              More from the blog
            </h2>
            <ul className="mt-6 space-y-4">
              {related.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="text-mist-200 transition hover:text-ember-400"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
