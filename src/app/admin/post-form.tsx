"use client";

import { useActionState } from "react";
import type { FormState } from "./actions";

type Values = {
  slug: string;
  title: string;
  description: string;
  categories: string;
  image: string;
  imageAlt: string;
  body: string;
  status: "draft" | "published";
};

export function PostForm({
  action,
  initial,
  categoryKeys,
}: {
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  initial: Values;
  categoryKeys: string[];
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const input = "mt-1 w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-navy";
  return (
    <form action={formAction} className="mt-6 space-y-5">
      <label className="block text-sm font-medium">
        Title
        <input name="title" defaultValue={initial.title} required className={input} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          URL slug
          <input name="slug" defaultValue={initial.slug} required className={input} />
        </label>
        <label className="block text-sm font-medium">
          Status
          <select name="status" defaultValue={initial.status} className={input}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium">
        Summary (meta description)
        <textarea name="description" defaultValue={initial.description} rows={2} required className={input} />
      </label>
      <label className="block text-sm font-medium">
        Categories (comma separated)
        <input name="categories" defaultValue={initial.categories} required className={input} />
        <span className="mt-1 block text-xs font-normal text-muted">Available: {categoryKeys.join(", ")}</span>
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Featured image path
          <input name="image" defaultValue={initial.image} required className={input} />
        </label>
        <label className="block text-sm font-medium">
          Image description (alt text)
          <input name="imageAlt" defaultValue={initial.imageAlt} className={input} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Article (Markdown)
        <textarea name="body" defaultValue={initial.body} rows={24} required className={`${input} font-mono text-sm`} />
      </label>
      {state.error && <p className="text-sm text-coral">{state.error}</p>}
      <button disabled={pending} className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
