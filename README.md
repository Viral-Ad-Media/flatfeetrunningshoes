# Flat Feet Running Shoes

Clean rebuild of flatfeetrunningshoes.com in Next.js 15, Tailwind CSS 4, Neon Postgres (Drizzle ORM) and Better Auth.

The old WordPress site was hacked (spam pages, cloaking code and a hidden admin backdoor), and its database was lost. This rebuild carries over **no code** from the old site. What came across:

- **Site structure and URLs**, recovered from the Rank Math sitemaps in the backup, so existing links and rankings keep working.
- **Images**, checked to be real image files, in `public/uploads/` with the same paths as before.
- **Articles**, rewritten from scratch in `content/posts/` because the original text was in the lost database.

## How it works

- Public pages read articles from Neon when `DATABASE_URL` is set, and fall back to the Markdown files in `content/posts/` otherwise. Pages are statically generated and refresh every 5 minutes, or straight away when you save in the admin.
- `/admin/` is a small editor protected by Better Auth (email and password). Only emails listed in `ADMIN_EMAILS` can create an account.
- Old spam URLs (`/women/…`, `/kids/…`) and WordPress endpoints return **410 Gone**. Old article slugs the attacker reused get a **permanent redirect** to the matching new article (see `next.config.ts` and `src/middleware.ts`).
- `/wp-content/uploads/...` image links redirect to `/uploads/...`.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in Neon URL, auth secret, admin email
npm run db:push              # create tables in Neon (or apply drizzle/0000_init.sql)
npm run db:seed              # load the articles from content/posts
npm run dev
```

Then open http://localhost:3000/admin/ and create the admin account with an email from `ADMIN_EMAILS`.

## Deploying

Any Next.js host works (for example Vercel). Set the same environment variables there, with `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` set to the live domain.

## Content

Articles are general information and include a medical disclaimer. Product mentions are about long-running shoe and insole lines rather than specific model-year specs. Please review them before going live.
