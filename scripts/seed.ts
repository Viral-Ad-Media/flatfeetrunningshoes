/**
 * Loads the Markdown articles in content/posts into Neon.
 * Existing posts with the same slug are updated, so it is safe to re-run.
 *   npm run db:seed
 */
import { sql } from "drizzle-orm";
import { requireDb } from "../src/db";
import { posts } from "../src/db/schema";
import { readFilePosts } from "../src/lib/content";

async function main() {
  const db = requireDb();
  const items = readFilePosts();
  for (const p of items) {
    await db
      .insert(posts)
      .values({
        slug: p.slug,
        title: p.title,
        description: p.description,
        categories: p.categories.join(","),
        image: p.image,
        imageAlt: p.imageAlt,
        body: p.body,
        status: "published",
        publishedAt: new Date(p.publishedAt),
        updatedAt: new Date(p.updatedAt),
      })
      .onConflictDoUpdate({
        target: posts.slug,
        set: {
          title: sql`excluded.title`,
          description: sql`excluded.description`,
          categories: sql`excluded.categories`,
          image: sql`excluded.image`,
          imageAlt: sql`excluded.image_alt`,
          body: sql`excluded.body`,
          updatedAt: sql`excluded.updated_at`,
        },
      });
    console.log("seeded", p.slug);
  }
  console.log(`Done: ${items.length} posts.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
