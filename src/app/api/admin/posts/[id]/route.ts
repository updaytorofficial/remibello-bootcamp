import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deletePost, getPostById, updatePost } from "@/lib/posts";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: Ctx) {
  const { id } = await context.params;
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function PUT(req: NextRequest, context: Ctx) {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await req.json();
    const post = await updatePost(id, {
      title: body.title !== undefined ? String(body.title) : undefined,
      content: body.content !== undefined ? String(body.content) : undefined,
      excerpt: body.excerpt !== undefined ? String(body.excerpt) : undefined,
      coverImage:
        body.coverImage !== undefined ? String(body.coverImage) : undefined,
      published:
        body.published !== undefined ? Boolean(body.published) : undefined,
      author: body.author !== undefined ? String(body.author) : undefined,
      slug: body.slug !== undefined ? String(body.slug) : undefined,
    });
    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update post." },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: Ctx) {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete post." },
      { status: 400 }
    );
  }
}
