export type PostSummary = {
  title: string;
  slug: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  coverUrl: string | null;
  coverAlt: string;
  socialUrl: string | null;
  seoTitle: string;
  seoDescription: string;
};
export type Post = PostSummary & { content: string; readingTime: number };
export const WPM = 220;
export function readingTime(text: string) {
  const words = text.replace(/[#>*_`\-\[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}
export const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
});
export function mediaUrl(base: string, path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https:\/\//i.test(path)) return path;
  if (/^[a-z]+:/i.test(path) || path.startsWith('//')) return null;
  return `${base.replace(/\/$/, '')}/storage/v1/object/public/azureblaze-media/${path.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/')}`;
}
