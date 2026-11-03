import type { PostSummary } from './posts';
import { SITE_ORIGIN } from './seo';
export const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
export function sitemapXml(posts: PostSummary[]) {
  const staticUrls = ['/', '/blog', '/about'].map(path => `<url><loc>${SITE_ORIGIN}${path}</loc></url>`);
  const articles = posts.map(p => {
    const date = p.updatedAt ?? p.publishedAt;
    const lastmod = date && Number.isFinite(Date.parse(date)) ? `<lastmod>${escapeXml(date)}</lastmod>` : '';
    return `<url><loc>${SITE_ORIGIN}/blog/${encodeURIComponent(p.slug)}</loc>${lastmod}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...staticUrls, ...articles].join('')}</urlset>`;
}
export function rssXml(posts: PostSummary[]) {
  const items = posts.map(p => `<item><title>${escapeXml(p.title)}</title><link>${SITE_ORIGIN}/blog/${encodeURIComponent(p.slug)}</link><guid isPermaLink="true">${SITE_ORIGIN}/blog/${encodeURIComponent(p.slug)}</guid><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><description>${escapeXml(p.description)}</description></item>`);
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>AzureBlaze</title><link>${SITE_ORIGIN}/blog</link><description>Questions on technology, engineering and the systems shaping our world.</description><language>en</language><atom:link href="${SITE_ORIGIN}/rss.xml" rel="self" type="application/rss+xml"/>${items.join('')}</channel></rss>`;
}