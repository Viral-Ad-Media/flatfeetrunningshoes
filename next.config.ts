import type { NextConfig } from "next";

/**
 * Old WordPress slugs that the hacked site reused for spam pages. Each one
 * points to the matching rebuilt article so any remaining links and search
 * rankings land on real content.
 */
const legacyRedirects: [string, string][] = [
  ["/samurai-orthotic-insoles-2023", "/samurai-orthotic-insoles-for-flatfooted-runners/"],
  ["/cross-training-shoe", "/cross-training-shoes-important-tips-flat-feet/"],
  ["/hiking-shoes-2023", "/hiking-shoes-for-flat-feet-in-2026-guide/"],
  ["/best-orthotic-insoles-2022", "/orthotic-insoles-for-flat-feet-2026/"],
  ["/supination-5-major-solutions", "/5-simple-supination-of-the-foot/"],
  ["/best-arch-support-203", "/arch-support-for-flat-feet-what/"],
  ["/remedies-plantar-fasciitis", "/plantar-fasciitis-causes-and-simple-home/"],
  ["/shin-splints-2023", "/shin-splints-5-things-to-know/"],
  ["/overpronation-causes-2023", "/overpronation-causes-2026/"],
  ["/shrink-your-bunions-naturally", "/7-natural-ways-to-shrink-your-bunions/"],
  ["/2022/05/27/insoles-for-work-boots", "/insoles-for-work-boots-2026/"],
  ["/2022/05/27/insoles-for-work-boots-2026", "/insoles-for-work-boots-2026/"],
  ["/insoles-for-flat-feet/featured-insoles/superfeet-insoles", "/superfeet-green-insoles-review-for-flat/"],
  ["/insoles-for-flat-feet/best-insoles/:rest*", "/insoles-for-flat-feet/"],
  ["/insoles-for-flat-feet/best-insoles", "/insoles-for-flat-feet/"],
  ["/running-shoes-for-flat-feet", "/running-shoes-for-flat-feet-in-2026-guide/"],
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
