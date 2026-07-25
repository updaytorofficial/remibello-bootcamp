import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPostById } from "@/lib/posts";
import PostEditor from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="surface-glow min-h-screen">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <Link
          href="/admin"
          className="text-sm text-mist-400 transition hover:text-ember-400"
        >
          ← Back to posts
        </Link>
        <h1 className="mt-4 font-display text-5xl tracking-wide text-mist-50">
          Edit post
        </h1>
        <div className="mt-8 rounded-2xl border border-white/10 bg-ink-900/80 p-6 sm:p-8">
          <PostEditor post={post} />
        </div>
      </div>
    </div>
  );
}
