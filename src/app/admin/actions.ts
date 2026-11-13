"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDb } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { categoryByKey } from "@/lib/site";

const PostInput = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes"),
  title: z.string().trim().min(3),
  description: z.string().trim().min(10).max(300),
  categories: z
    .string()
    .transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean))
    .refine((arr) => arr.length > 0 && arr.every((k) => categoryByKey.has(k)), "Unknown category key"),
  image: z.string().trim().startsWith("/uploads/", "Images must live under /uploads/"),
  imageAlt: z.string().trim(),
  body: z.string().min(50),
  status: z.enum(["draft", "published"]),
});

export type FormState = { error?: string };

function parse(form: FormData) {
  const r = PostInput.safeParse(Object.fromEntries(form));
  if (!r.success) return { error: r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
  return { data: { ...r.data, categories: r.data.categories.join(",") } };
}

function refresh(slug: string) {
  revalidatePath("/", "layout");
  revalidatePath(`/${slug}/`);
}

export async function savePost(id: string | null, _prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const db = requireDb();
  const parsed = parse(form);
  if ("error" in parsed) return { error: parsed.error };
  try {
    if (id) {
      await db.update(posts).set({ ...parsed.data, updatedAt: new Date() }).where(eq(posts.id, id));
    } else {
      await db.insert(posts).values(parsed.data);
    }
  } catch (e) {
    return { error: e instanceof Error && e.message.includes("unique") ? "That slug is already used." : "Could not save." };
  }
  refresh(parsed.data.slug);
  redirect("/admin/");
}

export async function deletePost(id: string) {
  await requireAdmin();
  const db = requireDb();
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/");
}
