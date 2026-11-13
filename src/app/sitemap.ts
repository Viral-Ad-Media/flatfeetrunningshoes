import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";
import { categories, site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  return [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
    ...categories.map((c) => ({ url: `${site.url}/${c.path}/`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...posts.map((p) => ({
      url: `${site.url}/${p.slug}/`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
