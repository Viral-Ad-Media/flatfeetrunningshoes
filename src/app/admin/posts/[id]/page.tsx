import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireDb } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { categories } from "@/lib/site";
import { deletePost, savePost } from "../../actions";
import { PostForm } from "../../post-form";

export const dynamic = "force-dynamic";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [row] = await requireDb().select().from(posts).where(eq(posts.id, id));
  if (!row) notFound();

  return (
    <>
      <div className="flex items-center justify-between">
        <Link href="/admin/" className="text-sm text-muted hover:text-navy">
          ← All articles
        </Link>
        <Link href={`/${row.slug}/`} className="text-sm font-semibold text-coral hover:underline">
          View live
        </Link>
      </div>
      <h1 className="mt-4 text-2xl font-bold text-navy">Edit article</h1>
      <PostForm
        action={savePost.bind(null, row.id)}
        initial={{ ...row, status: row.status }}
        categoryKeys={categories.map((c) => c.key)}
      />
      <form action={deletePost.bind(null, row.id)} className="mt-10 border-t border-line pt-6">
        <button className="text-sm font-semibold text-coral hover:underline">Delete this article</button>
      </form>
    </>
  );
}
