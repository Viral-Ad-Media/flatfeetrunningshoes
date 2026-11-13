import { NextResponse, type NextRequest } from "next/server";

/**
 * URLs that only ever existed as spam pages planted by the attacker, plus
 * WordPress endpoints bots will keep probing. Answer 410 Gone so search
 * engines drop them quickly.
 */
const GONE = [
  /^\/women(\/|$)/,
  /^\/kids(\/|$)/,
  /^\/wp-(admin|login|content|includes|json)/,
  /^\/xmlrpc\.php/,
  /^\/wp-[a-z-]+\.php/,
  /\.php$/,
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/wp-content/uploads/")) {
    // Old image URLs: serve the same file from /uploads.
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace("/wp-content/uploads/", "/uploads/");
    return NextResponse.redirect(url, 301);
  }
  if (GONE.some((re) => re.test(pathname))) {
    return new NextResponse("Gone", { status: 410, headers: { "X-Robots-Tag": "noindex" } });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|uploads|favicon.ico|icon|admin).*)"],
};
