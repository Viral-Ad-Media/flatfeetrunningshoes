import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getPostsForCategory } from "@/lib/content";
import { site } from "@/lib/site";

export const revalidate = 300;

const topics = [
  { href: "/men/mens-shoes/running/", title: "Running shoes", text: "Stability and support picks for flat feet." },
  { href: "/insoles-for-flat-feet/", title: "Insoles & orthotics", text: "Arch support that fits your feet and shoes." },
  { href: "/men/injury/", title: "Injuries", text: "Shin splints, plantar fasciitis, bunions and more." },
  { href: "/men/mens-shoes/hiking/", title: "Hiking", text: "Stable trail shoes and boots." },
  { href: "/men/mens-shoes/cross-training/", title: "Gym & cross-training", text: "Flat, firm shoes for lifting and drills." },
  { href: "/foot-health/", title: "Foot health", text: "Understand your arch and your gait." },
];

export default async function Home() {
  const posts = await getAllPosts();
  const [lead, ...rest] = posts;
  const insoles = (await getPostsForCategory("insoles-for-flat-feet")).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-sand">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">For runners with flat feet</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">
              Find shoes and support that let you run without pain.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              Plain-English guides to stability shoes, insoles and the injuries flat feet are prone to, so you can
              spend less time hurting and more time running.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/running-shoes-for-flat-feet-in-2026-guide/"
                className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral/90"
              >
                Start with running shoes
              </Link>
              <Link
                href="/flat-feet-vs-overpronation-differences/"
                className="rounded-full border border-navy/20 bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:border-navy"
              >
                Flat feet or overpronation?
              </Link>
            </div>
          </div>
          {lead && (
            <Link href={`/${lead.slug}/`} className="group relative block overflow-hidden rounded-3xl shadow-xl">
              <div className="relative aspect-[3/2]">
                <Image src={lead.image} alt={lead.imageAlt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Latest</p>
                <p className="mt-1 text-lg font-semibold text-white group-hover:underline">{lead.title}</p>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-navy">Browse by topic</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-2xl border border-line p-5 transition hover:border-navy hover:bg-sky"
            >
              <p className="font-semibold text-ink">{t.title}</p>
              <p className="mt-1 text-sm text-muted">{t.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-navy">Latest guides</h2>
          <Link href="/blog/" className="text-sm font-semibold text-coral hover:underline">
            All articles
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(0, 6).map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      <section className="mt-12 bg-sky">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-navy">Insoles for flat feet</h2>
            <Link href="/insoles-for-flat-feet/" className="text-sm font-semibold text-coral hover:underline">
              More on insoles
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {insoles.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
