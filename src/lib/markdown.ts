import { Marked } from "marked";

const marked = new Marked({ gfm: true });

marked.use({
  renderer: {
    image({ href, title, text }) {
      const t = title ? ` title="${title}"` : "";
      return `<img src="${href}" alt="${text}"${t} loading="lazy" decoding="async" />`;
    },
  },
});

/** Renders trusted Markdown (our own articles and admin edits) to HTML. */
export function renderMarkdown(md: string) {
  return marked.parse(md, { async: false }) as string;
}

/** h2 headings for the table of contents. */
export function headings(md: string) {
  return [...md.matchAll(/^## (.+)$/gm)].map((m) => ({ text: m[1], id: slugify(m[1]) }));
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Adds ids to h2s so the table of contents can link to them. */
export function withHeadingIds(html: string) {
  return html.replace(/<h2>(.*?)<\/h2>/g, (_, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'");
    return `<h2 id="${slugify(text)}">${inner}</h2>`;
  });
}
