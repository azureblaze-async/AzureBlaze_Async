// Articles live as Markdown files in /content/blogs with frontmatter.
const files = import.meta.glob("/content/blogs/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export type Post = {
  title: string;
  slug: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  published: boolean;
  tags?: string[];
  content: string;
  readingTime: number;
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const WPM = 220;

export function readingTime(text: string) {
  const words = text.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WPM));
}

export function parsePost(raw: string, file = "article"): Post {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing frontmatter`);
  const data: { [k: string]: string } & Partial<Record<"title"|"slug"|"description"|"category"|"publishedAt"|"published"|"updatedAt"|"tags", string>> = {};
  for (const line of (m[1] ?? "").split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  for (const k of ["title", "slug", "description", "category", "publishedAt", "published"]) {
    if (!(data as Record<string,string>)[k]) throw new Error(`${file}: missing required field "${k}"`);
  }
  if (!SLUG_RE.test(data.slug!)) throw new Error(`${file}: invalid slug "${data.slug}"`);
  if (data.published !== "true" && data.published !== "false")
    throw new Error(`${file}: "published" must be true or false`);
  for (const k of ["publishedAt", "updatedAt"]) {
    const v = (data as Record<string,string>)[k]; if (v && isNaN(Date.parse(v))) throw new Error(`${file}: invalid date "${k}"`);
  }
  const content = (m[2] ?? "").trim();
  if (!content) throw new Error(`${file}: empty content`);
  return {
    title: data.title!,
    slug: data.slug!,
    description: data.description!,
    category: data.category!,
    publishedAt: data.publishedAt!,
    updatedAt: data.updatedAt || undefined,
    published: data.published === "true",
    tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : undefined,
    content,
    readingTime: readingTime(content),
  };
}

const all = Object.entries(files).map(([f, raw]) => parsePost(raw, f));
const seen = new Set<string>();
for (const p of all) {
  if (seen.has(p.slug)) throw new Error(`Duplicate slug "${p.slug}"`);
  seen.add(p.slug);
}

export const posts = all
  .filter((p) => p.published)
  .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
