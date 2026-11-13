import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getPost, getPostsForCategory, getRelated, readingTime, type Post } from "@/lib/content";
import { headings, renderMarkdown, withHeadingIds } from "@/lib/markdown";
import { categories, categoryByKey, categoryByPath, site, type Category } from "@/lib/site";

export const revalidate = 300;
export const dynamicParams = true;

type Params = { path: string[] };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return [...posts.map((p) => ({ path: [p.slug] })), ...categories.map((c) => ({ path: c.path.split("/") }))];
}

async function resolve(path: string[]) {
  const joined = path.join("/");
  const category = categoryByPath.get(joined);
  if (category) return { kind: "category" as const, category };
  if (path.length === 1) {
    const post = await getPost(path[0]);
    if (post) return { kind: "post" as const, post };
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const r = await resolve((await params).path);
  if (!r) return {};
  if (r.kind === "category") {
    return {
      title: r.category.title,
      description: r.category.intro,
      alternates: { canonical: `/${r.category.path}/` },
    };
  }
  const p = r.post;
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/${p.slug}/` },
    openGraph: {
      type: "article",
      title: p.title,
      description: p.description,
      images: [{ url: p.image }],
      publishedTime: p.publishedAt,
      modifiedTime: p.updatedAt,
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const r = await resolve((await params).path);
  if (!r) notFound();
  return r.kind === "post" ? <PostView post={r.post} /> : <CategoryView category={r.category} />;
}

function trail(cat: Category | undefined): { href: string; label: string }[] {
  const out: { href: string; label: string }[] = [];
  let c = cat;
  while (c) {
    out.unshift({ href: `/${c.path}/`, label: c.title });
    c = c.parent ? categoryByPath.get(c.parent) : undefined;
  }
  return out;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

async function PostView({ post }: { post: Post }) {
  const primary = post.categories.map((k) => categoryByKey.get(k)).find(Boolean);
  const toc = headings(post.body);
  const html = withHeadingIds(renderMarkdown(post.body));
  const related = await getRelated(post);
  const updated = post.updatedAt && post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: new URL(post.image, site.url).toString(),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: new URL(`/${post.slug}/`, site.url).toString(),
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="bg-sand">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-8">
          <Breadcrumbs items={trail(primary)} />
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.description}</p>
          <p className="mt-4 text-sm text-muted">
            {updated ? `Updated ${fmt(post.updatedAt)}` : fmt(post.publishedAt)} · {readingTime(post.body)} min read
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4">
        <div className="relative -mt-2 aspect-[3/2] overflow-hidden rounded-3xl shadow-lg md:mx-auto md:max-w-3xl">
          <Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_minmax(0,46rem)_1fr]">
        <div className="hidden lg:block" />
        <div>
          {toc.length > 2 && (
            <nav aria-label="On this page" className="mb-8 rounded-2xl border border-line bg-sky/60 p-5">
              <p className="text-sm font-semibold text-navy">On this page</p>
              <ol className="mt-3 space-y-1.5 text-sm">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-ink/80 hover:text-coral">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div
            className="prose prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-navy prose-a:text-coral prose-a:no-underline hover:prose-a:underline prose-strong:text-ink"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <aside className="mt-10 rounded-2xl border-l-4 border-coral bg-sand p-5 text-sm leading-relaxed text-muted">
            This article is general information, not medical advice. If you have pain that lasts more than a couple of
            weeks or keeps you from running, see a doctor, podiatrist or physiotherapist.
          </aside>
        </div>
        <div />
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-navy">Keep reading</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

async function CategoryView({ category }: { category: Category }) {
  const posts = await getPostsForCategory(category.path);
  const children = categories.filter((c) => c.parent === category.path);
  const crumbs = trail(category);

  return (
    <>
      <header className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-8">
          <Breadcrumbs items={crumbs.slice(0, -1)} />
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-navy md:text-4xl">{category.title}</h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{category.intro}</p>
          {children.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {children.map((c) => (
                <li key={c.path}>
                  <Link
                    href={`/${c.path}/`}
                    className="inline-block rounded-full border border-navy/15 bg-white px-4 py-1.5 text-sm font-medium text-navy transition hover:border-navy"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-12">
        {posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <PostCard key={p.slug} post={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="text-muted">New articles are on the way.</p>
        )}
      </section>
    </>
  );
}
