import { createFileRoute } from '@tanstack/react-router';
import { rssXml } from '@/lib/feeds';
export const Route = createFileRoute('/rss.xml')({
  server: { handlers: { GET: async () => {
    const { listPublishedPosts } = await import('@/lib/posts.server');
    const connection = {
      url: process.env['AZUREBLAZE_BLOG_URL'] ?? (process.env['SUPABASE_ANON_KEY'] ? process.env['SUPABASE_URL'] : import.meta.env['VITE_SUPABASE_ANON_KEY'] ? import.meta.env['VITE_SUPABASE_URL'] : undefined),
      key: process.env['AZUREBLAZE_BLOG_PUBLIC_KEY'] ?? process.env['SUPABASE_ANON_KEY'] ?? import.meta.env['VITE_SUPABASE_ANON_KEY'],
    };
    try { return new Response(rssXml(await listPublishedPosts(connection)), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } }); }
    catch { return new Response('RSS temporarily unavailable', { status: 503, headers: { 'Retry-After': '60' } }); }
  } } },
});