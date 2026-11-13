import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { categories } from "@/lib/site";
import { savePost } from "../../actions";
import { PostForm } from "../../post-form";

export const dynamic = "force-dynamic";

export default async function NewPost() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/" className="text-sm text-muted hover:text-navy">
        ← All articles
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-navy">New article</h1>
      <PostForm
        action={savePost.bind(null, null)}
        initial={{ slug: "", title: "", description: "", categories: "", image: "/uploads/", imageAlt: "", body: "", status: "draft" }}
        categoryKeys={categories.map((c) => c.key)}
      />
    </>
  );
}
