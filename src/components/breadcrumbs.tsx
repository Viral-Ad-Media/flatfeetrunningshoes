import Link from "next/link";

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-navy">
            Home
          </Link>
        </li>
        {items.map((it) => (
          <li key={it.href} className="flex items-center gap-1.5">
            <span aria-hidden>/</span>
            <Link href={it.href} className="hover:text-navy">
              {it.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
