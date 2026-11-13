import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/content";
import { categoryByKey } from "@/lib/site";

export function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  const cat = post.categories.map((k) => categoryByKey.get(k)).find(Boolean);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/${post.slug}/`} className="relative block aspect-[3/2] overflow-hidden bg-sky">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {cat && (
          <Link
            href={`/${cat.path}/`}
            className="text-xs font-semibold uppercase tracking-wider text-coral hover:underline"
          >
            {cat.title}
          </Link>
        )}
        <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">
          <Link href={`/${post.slug}/`} className="hover:text-navy">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{post.description}</p>
      </div>
    </article>
  );
}
