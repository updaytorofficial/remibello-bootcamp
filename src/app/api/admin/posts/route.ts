import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createPost, listPosts } from "@/lib/posts";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";

  if (all) {
    const ok = await isAdminAuthenticated();
    if (!ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const posts = await listPosts();
    return NextResponse.json({ posts });
  }

  const posts = await listPosts({ publishedOnly: true });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const post = await createPost({
      title: String(body.title || ""),
      content: String(body.content || ""),
      excerpt: body.excerpt ? String(body.excerpt) : undefined,
      coverImage: body.coverImage ? String(body.coverImage) : undefined,
      published: Boolean(body.published),
      author: body.author ? String(body.author) : undefined,
      slug: body.slug ? String(body.slug) : undefined,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create post." },
      { status: 400 }
    );
  }
}
