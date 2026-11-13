import Link from "next/link";
import { categories, site } from "@/lib/site";
import { Logo } from "./logo";

const groups = [
  { title: "Shoes", parent: "men/mens-shoes" },
  { title: "Injuries", parent: "men/injury" },
  { title: "Insoles", parent: "insoles-for-flat-feet" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-navy-dark text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="rounded-lg bg-white px-3 py-2 inline-block">
            <Logo />
          </div>
          <p className="mt-4 text-sm leading-relaxed">{site.description}</p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{g.title}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href={`/${g.parent}/`} className="hover:text-white">
                  All {g.title.toLowerCase()}
                </Link>
              </li>
              {categories
                .filter((c) => c.parent === g.parent)
                .map((c) => (
                  <li key={c.path}>
                    <Link href={`/${c.path}/`} className="hover:text-white">
                      {c.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-white/60">
          <p>
            The information on this site is for general education only and isn&apos;t medical advice. If you have
            ongoing foot, leg or joint pain, please see a doctor, podiatrist or physiotherapist.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
