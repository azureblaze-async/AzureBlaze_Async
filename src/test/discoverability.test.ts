import { describe, expect, it } from 'vitest';
import { parseFrontmatter } from '../lib/frontmatter';
import { cleanLabel, unbrandedTitle, metaDescription } from '../lib/seo';
import { rssXml, sitemapXml } from '../lib/feeds';
import type { PostSummary } from '../lib/posts';
const post: PostSummary = { title: 'Who Decides & Why?', slug: 'who-decides', description: 'Questions about <systems>.', category: 'Systems', publishedAt: '2026-11-01T00:00:00Z', updatedAt: '2026-11-02T00:00:00Z', coverUrl: null, coverAlt: '', socialUrl: null, seoTitle: 'Who Decides & Why?', seoDescription: '' };
describe('Article normalization', () => {
  it('parses quoted and multiline YAML and keeps article wording unchanged', () => {
    const body = '# Who Decides?\n\nEvery word stays.\n';
    const result = parseFrontmatter(`---\ntitle: "Who Decides: the Rules?"\ndescription: >-\n  A question about\n  everyday systems.\n---\n${body}`);
    expect(result.data['title']).toBe('Who Decides: the Rules?');
    expect(result.data['description']).toBe('A question about everyday systems.');
    expect(result.content).toBe(body);
  });
  it('never strips prose without a frontmatter envelope', () => {
    expect(parseFrontmatter('title: A paragraph\n\n---\nProse').content).toBe('title: A paragraph\n\n---\nProse');
  });
  it('removes leaking field labels', () => {
    expect(cleanLabel('description: "Questions about systems."')).toBe('Questions about systems.');
  });
  it('removes repeated brand suffixes', () => {
    expect(unbrandedTitle('title: Who Decides | AzureBlaze — AzureBlaze')).toBe('Who Decides');
  });
  it('makes content-derived descriptions between 140 and 160 characters', () => {
    for (const text of ['', 'Short excerpt.', 'A long question about technology and systems. '.repeat(10)]) {
      const result = metaDescription(text, 'Who Decides');
      expect(result.length).toBeGreaterThanOrEqual(140);
      expect(result.length).toBeLessThanOrEqual(160);
    }
  });
});
describe('Public discovery feeds', () => {
  it('includes home, blog, about and post canonical URLs', () => {
    const xml = sitemapXml([post]);
    for (const path of ['/', '/blog', '/about', '/blog/who-decides']) expect(xml).toContain(`<loc>https://www.azureblaze.space${path}</loc>`);
  });
  it('uses a page-specific modified timestamp and never invents static page dates', () => {
    const xml = sitemapXml([post]);
    expect(xml).toContain('<lastmod>2026-11-02T00:00:00Z</lastmod>');
    expect(xml.match(/<lastmod>/g)?.length).toBe(1);
  });
  it('escapes RSS content and includes published date and canonical link', () => {
    const xml = rssXml([post]);
    expect(xml).toContain('<title>Who Decides &amp; Why?</title>');
    expect(xml).toContain('<description>Questions about &lt;systems&gt;.</description>');
    expect(xml).toContain('<pubDate>Sun, 01 Nov 2026 00:00:00 GMT</pubDate>');
    expect(xml).toContain('<link>https://www.azureblaze.space/blog/who-decides</link>');
  });
});