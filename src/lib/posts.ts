import { BlogPost, excerptFrom, slugify } from "./types";
import { readJsonArray, writeJsonArray } from "./json-store";
import { promises as fs } from "fs";
import path from "path";

const STORE = "remibello";
const KEY = "posts";
const LOCAL_FILE = "data/posts.json";

async function seedFromRepoIfEmpty(rows: BlogPost[]): Promise<BlogPost[]> {
  if (rows.length > 0) return rows;
  try {
    const seedPath = path.join(process.cwd(), LOCAL_FILE);
    const raw = await fs.readFile(seedPath, "utf8");
    const seed = JSON.parse(raw) as BlogPost[];
    if (Array.isArray(seed) && seed.length > 0) {
      await writeJsonArray(STORE, KEY, LOCAL_FILE, seed);
      return seed;
    }
  } catch {
    // no seed available
  }
  return rows;
}

async function readAll(): Promise<BlogPost[]> {
  const rows = await readJsonArray<BlogPost>(STORE, KEY, LOCAL_FILE);
  return seedFromRepoIfEmpty(rows);
}

async function writeAll(posts: BlogPost[]) {
  await writeJsonArray(STORE, KEY, LOCAL_FILE, posts);
}

export async function listPosts(options?: {
  publishedOnly?: boolean;
}): Promise<BlogPost[]> {
  const posts = await readAll();
  const filtered = options?.publishedOnly
    ? posts.filter((p) => p.published)
    : posts;
  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await readAll();
  return posts.find((p) => p.slug === slug) || null;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const posts = await readAll();
  return posts.find((p) => p.id === id) || null;
}

function uniqueSlug(base: string, posts: BlogPost[], ignoreId?: string) {
  let slug = slugify(base) || "post";
  let i = 2;
  while (posts.some((p) => p.slug === slug && p.id !== ignoreId)) {
    slug = `${slugify(base)}-${i}`;
    i += 1;
  }
  return slug;
}

export type PostInput = {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  author?: string;
  slug?: string;
};

export async function createPost(input: PostInput): Promise<BlogPost> {
  const posts = await readAll();
  const now = new Date().toISOString();
  const title = input.title.trim();
  const content = input.content.trim();

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  const post: BlogPost = {
    id: crypto.randomUUID(),
    title,
    slug: uniqueSlug(input.slug || title, posts),
    excerpt: (input.excerpt || excerptFrom(content)).trim(),
    content,
    coverImage: input.coverImage?.trim() || "",
    published: Boolean(input.published),
    createdAt: now,
    updatedAt: now,
    author: (input.author || "the RemiBello").trim(),
  };

  posts.unshift(post);
  await writeAll(posts);
  return post;
}

export async function updatePost(
  id: string,
  input: Partial<PostInput>
): Promise<BlogPost> {
  const posts = await readAll();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Post not found.");

  const current = posts[index];
  const title = input.title?.trim() ?? current.title;
  const content = input.content?.trim() ?? current.content;

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  const updated: BlogPost = {
    ...current,
    title,
    content,
    excerpt: (
      input.excerpt?.trim() ||
      current.excerpt ||
      excerptFrom(content)
    ).trim(),
    coverImage:
      input.coverImage !== undefined
        ? input.coverImage.trim()
        : current.coverImage,
    published:
      input.published !== undefined ? Boolean(input.published) : current.published,
    author: input.author?.trim() || current.author,
    slug: input.slug
      ? uniqueSlug(input.slug, posts, id)
      : input.title
        ? uniqueSlug(title, posts, id)
        : current.slug,
    updatedAt: new Date().toISOString(),
  };

  posts[index] = updated;
  await writeAll(posts);
  return updated;
}

export async function deletePost(id: string): Promise<void> {
  const posts = await readAll();
  const next = posts.filter((p) => p.id !== id);
  if (next.length === posts.length) throw new Error("Post not found.");
  await writeAll(next);
}
