import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-coral">404</p>
      <h1 className="mt-3 text-3xl font-bold text-navy">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-muted">It may have moved when we rebuilt the site.</p>
      <Link href="/blog/" className="mt-8 inline-block rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white">
        Browse all articles
      </Link>
    </div>
  );
}
