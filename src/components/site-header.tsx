import Link from "next/link";
import { mainNav } from "@/lib/site";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
        <Link href="/" aria-label="Flat Feet Running Shoes home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-ink/80">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-coral">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-line px-3 py-1.5 text-sm font-medium">
            Menu
          </summary>
          <ul className="absolute right-0 mt-2 w-56 rounded-xl border border-line bg-white p-2 shadow-lg">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-sky">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </header>
  );
}
