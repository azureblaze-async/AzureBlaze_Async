import { mediaUrl, readingTime, type Post, type PostSummary } from './posts';

export const LIST_COLS = 'title,slug,excerpt,category,cover_image_path,cover_image_alt,published_at,updated_at,seo_title,seo_description,social_image_path';
type Row = {
  title: string; slug: string; excerpt: string | null; category: string | null;
  cover_image_path: string | null; cover_image_alt: string | null;
  published_at: string; updated_at: string; seo_title: string | null;
  seo_description: string | null; social_image_path: string | null; content_markdown?: string;
};
export type BlogConnection = { url: string | undefined; key: string | undefined };
function configuration({ url, key }: BlogConnection) {
  if (!url || !key) throw new Error('Blog connection is not configured');
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw new Error('Blog connection requires HTTPS');
  if (key.startsWith('sb_secret_')) throw new Error('Blog reader requires a public key');
  if (!key.startsWith('sb_publishable_')) {
    try {
      const payload = JSON.parse(atob(key.split('.')[1] ?? '')) as { role?: string };
      if (payload.role !== 'anon') throw new Error();
    } catch { throw new Error('Blog reader requires an anon or publishable key'); }
  }
  return { base: url.replace(/\/$/, ''), key };
}
async function query(connection: BlogConnection, params: URLSearchParams): Promise<{ rows: Row[]; base: string }> {
  const { base, key } = configuration(connection);
  params.set('status', 'eq.published');
  const headers = new Headers({ apikey: key });
  if (!key.startsWith('sb_')) headers.set('Authorization', `Bearer ${key}`);
  const response = await fetch(`${base}/rest/v1/posts?${params}`, { headers, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Blog database could not be read');
  const rows: unknown = await response.json();
  if (!Array.isArray(rows)) throw new Error('Invalid blog response');
  return { rows: rows as Row[], base };
}
function summary(row: Row, base: string): PostSummary {
  return {
    title: row.title, slug: row.slug, description: row.excerpt ?? '', category: row.category ?? '',
    publishedAt: row.published_at, updatedAt: row.updated_at,
    coverUrl: mediaUrl(base, row.cover_image_path), coverAlt: row.cover_image_alt ?? '',
    socialUrl: mediaUrl(base, row.social_image_path ?? row.cover_image_path),
    seoTitle: row.seo_title || row.title, seoDescription: row.seo_description || row.excerpt || '',
  };
}
export async function listPublishedPosts(connection: BlogConnection): Promise<PostSummary[]> {
  const posts: PostSummary[] = [];
  // Page through all published rows so the count and sitemap aren't silently truncated.
  for (let offset = 0; ; offset += 1000) {
    const { rows, base } = await query(connection, new URLSearchParams({ select: LIST_COLS, order: 'published_at.desc,slug.asc', limit: '1000', offset: String(offset) }));
    posts.push(...rows.map(row => summary(row, base)));
    if (rows.length < 1000) return posts;
  }
}
export async function getPublishedPost(slug: string, connection: BlogConnection): Promise<Post | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const { rows, base } = await query(connection, new URLSearchParams({ select: `${LIST_COLS},content_markdown`, slug: `eq.${slug}`, limit: '1' }));
  const row = rows[0];
  if (!row) return null;
  const content = row.content_markdown ?? '';
  return { ...summary(row, base), content, readingTime: readingTime(content) };
}
