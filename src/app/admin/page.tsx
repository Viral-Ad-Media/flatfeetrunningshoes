import { desc } from "drizzle-orm";
import Link from "next/link";
import { requireDb } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { SignOutButton } from "./sign-out-button";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const session = await requireAdmin();
  const rows = await requireDb()
    .select({ id: posts.id, slug: posts.slug, title: posts.title, status: posts.status, updatedAt: posts.updatedAt })
    .from(posts)
    .orderBy(desc(posts.publishedAt));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Articles</h1>
          <p className="text-sm text-muted">Signed in as {session.user.email}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/posts/new/" className="rounded-full bg-coral px-5 py-2 text-sm font-semibold text-white">
            New article
          </Link>
          <SignOutButton />
        </div>
      </div>
      <table className="mt-8 w-full text-left text-sm">
        <thead className="border-b border-line text-muted">
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2">Status</th>
            <th className="py-2">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-line">
              <td className="py-3 pr-4">
                <Link href={`/admin/posts/${r.id}/`} className="font-medium text-navy hover:underline">
                  {r.title}
                </Link>
                <div className="text-xs text-muted">/{r.slug}/</div>
              </td>
              <td className="py-3 capitalize">{r.status}</td>
              <td className="py-3 whitespace-nowrap">{r.updatedAt.toISOString().slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="mt-6 text-muted">No articles yet. Run <code>npm run db:seed</code>.</p>}
    </>
  );
}
