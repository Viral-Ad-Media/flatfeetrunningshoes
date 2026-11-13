import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { descendantKeys } from "./site";

export type Post = {
  slug: string;
  title: string;
  description: string;
  categories: string[];
  image: string;
  imageAlt: string;
  body: string;
  publishedAt: string;
  updatedAt: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

/** Minimal frontmatter parser: `key: value` lines between --- fences. */
export function parsePostFile(raw: string, slug: string): Post {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Missing frontmatter in ${slug}`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  return {
    slug,
    title: meta.title,
    description: meta.description,
    categories: (meta.categories ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    image: meta.image,
    imageAlt: meta.imageAlt ?? meta.title,
    body: m[2].trim(),
    publishedAt: meta.published,
    updatedAt: meta.updated ?? meta.published,
  };
}

export function readFilePosts(): Post[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parsePostFile(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8"), f.replace(/\.md$/, "")));
}

function fromRow(r: typeof posts.$inferSelect): Post {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    categories: r.categories.split(",").map((s) => s.trim()).filter(Boolean),
    image: r.image,
    imageAlt: r.imageAlt,
    body: r.body,
    publishedAt: r.publishedAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

const byDateDesc = (a: Post, b: Post) => b.publishedAt.localeCompare(a.publishedAt);

/**
 * Published posts. Reads Neon when DATABASE_URL is set; otherwise falls back to
 * the Markdown files in content/posts (which are also what `npm run db:seed` loads).
 */
export const getAllPosts = cache(async (): Promise<Post[]> => {
  if (db) {
    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt));
    if (rows.length) return rows.map(fromRow);
  }
  return readFilePosts().sort(byDateDesc);
});

export async function getPost(slug: string) {
  return (await getAllPosts()).find((p) => p.slug === slug) ?? null;
}

export async function getPostsForCategory(categoryPath: string) {
  const all = await getAllPosts();
  if (categoryPath === "blog") return all;
  const keys = new Set(descendantKeys(categoryPath));
  return all.filter((p) => p.categories.some((c) => keys.has(c)));
}

export async function getRelated(post: Post, n = 3) {
  const all = await getAllPosts();
  const scored = all
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, s: p.categories.filter((c) => post.categories.includes(c)).length }))
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, n).map((x) => x.p);
}

export function readingTime(body: string) {
  return Math.max(1, Math.round(body.split(/\s+/).length / 220));
}
