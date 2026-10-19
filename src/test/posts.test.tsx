import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { getPublishedPost, listPublishedPosts } from '../lib/posts.server';
import { shouldShowWriting } from '../lib/posts';

const connection = { url: 'https://editor.example.test', key: 'sb_publishable_test' };
const row = { title: 'Published post', slug: 'published-post', excerpt: 'An excerpt', category: 'Systems', published_at: '2026-10-19T00:00:00Z', updated_at: '2026-10-19T00:00:00Z', content_markdown: '# Database article', cover_image_path: null, social_image_path: null };
afterEach(() => vi.unstubAllGlobals());
describe('Writing visibility', () => {
  it('hides writing when no blogs are available', () => {
    expect(shouldShowWriting([], null)).toBe(false);
  });
  it('hides writing when loading fails even if cached posts exist', () => {
    expect(shouldShowWriting([row], 'Load failed')).toBe(false);
  });
  it('shows writing when published blogs are loaded', () => {
    expect(shouldShowWriting([row], null)).toBe(true);
  });
});
describe('Published-only database reader', () => {
  it('requests published rows only without sending a publishable key as a bearer token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([row])));
    vi.stubGlobal('fetch', fetchMock);
    const posts = await listPublishedPosts(connection);
    const call = fetchMock.mock.calls[0];
    if (!call) throw new Error("Expected a database request");
    const [url, init] = call;
    expect(new URL(url).searchParams.get('status')).toBe('eq.published');
    expect(new URL(url).searchParams.get('select')).not.toContain('content_markdown');
    expect(init.headers.get('Authorization')).toBeNull();
    expect(posts[0]?.slug).toBe('published-post');
  });
  it('restricts direct slug reads to published posts and returns null for invisible rows', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('[]'));
    vi.stubGlobal('fetch', fetchMock);
    expect(await getPublishedPost('draft-post', connection)).toBeNull();
    const call = fetchMock.mock.calls[0];
    if (!call) throw new Error("Expected a database request");
    const params = new URL(call[0]).searchParams;
    expect(params.get('status')).toBe('eq.published');
    expect(params.get('slug')).toBe('eq.draft-post');
  });
  it('reads article Markdown from the database', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([row]))));
    expect((await getPublishedPost('published-post', connection))?.content).toBe('# Database article');
  });
  it('does not render author-supplied raw HTML', () => {
    const html = renderToStaticMarkup(<ReactMarkdown skipHtml>{'<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\nSafe paragraph'}</ReactMarkdown>);
    expect(html).not.toContain('<script');
    expect(html).not.toContain('onerror');
    expect(html).toContain('Safe paragraph');
  });
  it('rejects privileged keys before making any database request', async () => {
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    await expect(listPublishedPosts({ ...connection, key: 'sb_secret_forbidden' })).rejects.toThrow('public key');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
