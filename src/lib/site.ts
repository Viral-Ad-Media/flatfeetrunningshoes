export const site = {
  name: "Flat Feet Running Shoes",
  shortName: "FlatFeet",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://flatfeetrunningshoes.com",
  description:
    "Honest, practical guides to running shoes, insoles and foot care for runners with flat feet.",
};

export type Category = {
  /** URL path without leading/trailing slash, e.g. "men/injury/bunions" */
  path: string;
  /** Short key used in post frontmatter */
  key: string;
  title: string;
  intro: string;
  parent?: string;
};

/**
 * Hub pages. Paths match the original WordPress page URLs recovered from the
 * Rank Math sitemaps so existing links and search rankings keep working.
 */
export const categories: Category[] = [
  {
    path: "blog",
    key: "blog",
    title: "All Articles",
    intro: "Every guide, review and foot-health article on the site, newest first.",
  },
  {
    path: "men",
    key: "men",
    title: "Shoes & Injuries",
    intro: "Shoe guides by activity and help with the injuries flat-footed runners run into most.",
  },
  {
    path: "men/mens-shoes",
    key: "shoes",
    parent: "men",
    title: "Shoes for Flat Feet",
    intro: "Running, hiking and cross-training shoes that give flat feet the stability they need.",
  },
  {
    path: "men/mens-shoes/running",
    key: "running",
    parent: "men/mens-shoes",
    title: "Running Shoes",
    intro:
      "How to choose stability and support running shoes for flat feet, what to look for in fit, and when to replace them.",
  },
  {
    path: "men/mens-shoes/hiking",
    key: "hiking",
    parent: "men/mens-shoes",
    title: "Hiking Shoes",
    intro: "Trail shoes and boots with the arch support and stable platforms flat feet need on uneven ground.",
  },
  {
    path: "men/mens-shoes/cross-training",
    key: "cross-training",
    parent: "men/mens-shoes",
    title: "Cross-Training Shoes",
    intro: "Gym and cross-training shoes that stay stable for lifting, jumping and lateral moves.",
  },
  {
    path: "men/injury",
    key: "injury",
    parent: "men",
    title: "Injuries & Foot Problems",
    intro: "Causes, warning signs and practical self-care for the injuries most linked to flat feet.",
  },
  {
    path: "men/injury/overpronation",
    key: "overpronation",
    parent: "men/injury",
    title: "Overpronation",
    intro: "What overpronation is, how it relates to flat feet, and how shoes and insoles can help.",
  },
  {
    path: "men/injury/bunions",
    key: "bunions",
    parent: "men/injury",
    title: "Bunions",
    intro: "Easing bunion pain with better footwear, simple exercises and knowing when to see a specialist.",
  },
  {
    path: "men/injury/supination",
    key: "supination",
    parent: "men/injury",
    title: "Supination",
    intro: "Underpronation explained: signs, causes and shoe choices for feet that roll outward.",
  },
  {
    path: "men/injury/shin-splints",
    key: "shin-splints",
    parent: "men/injury",
    title: "Shin Splints",
    intro: "Why shin splints happen, how to recover, and how to keep them from coming back.",
  },
  {
    path: "men/injury/plantar-fasciitis",
    key: "plantar-fasciitis",
    parent: "men/injury",
    title: "Plantar Fasciitis",
    intro: "Heel pain causes, home remedies and support options for plantar fasciitis.",
  },
  {
    path: "insoles-for-flat-feet",
    key: "insoles",
    title: "Insoles for Flat Feet",
    intro: "Orthotic insoles and arch supports: how they work, who they help, and how to pick a pair.",
  },
  {
    path: "insoles-for-flat-feet/featured-insoles",
    key: "featured-insoles",
    parent: "insoles-for-flat-feet",
    title: "Featured Insoles",
    intro: "In-depth looks at specific insole brands popular with flat-footed runners.",
  },
  {
    path: "insoles-for-flat-feet/featured-insoles/samurai-insoles-orthotics",
    key: "samurai",
    parent: "insoles-for-flat-feet/featured-insoles",
    title: "Samurai Insoles",
    intro: "Our coverage of Samurai orthotic insoles for flat feet.",
  },
  {
    path: "foot-health",
    key: "foot-health",
    title: "Foot Health",
    intro: "The basics of flat feet, gait and keeping your feet healthy as a runner.",
  },
];

export const categoryByPath = new Map(categories.map((c) => [c.path, c]));
export const categoryByKey = new Map(categories.map((c) => [c.key, c]));

/** Keys whose posts also appear in a parent hub. */
export function descendantKeys(path: string): string[] {
  return categories
    .filter((c) => c.path === path || c.path.startsWith(path + "/"))
    .map((c) => c.key);
}

export const mainNav = [
  { href: "/men/mens-shoes/running/", label: "Running Shoes" },
  { href: "/men/mens-shoes/", label: "Shoes" },
  { href: "/insoles-for-flat-feet/", label: "Insoles" },
  { href: "/men/injury/", label: "Injuries" },
  { href: "/foot-health/", label: "Foot Health" },
  { href: "/blog/", label: "Blog" },
];
