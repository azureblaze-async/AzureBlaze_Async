import { createFileRoute } from "@tanstack/react-router";
import { sitemapXml } from '@/lib/feeds';


export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { listPublishedPosts } = await import("@/lib/posts.server");
        const connection = {
          url: process.env["AZUREBLAZE_BLOG_URL"] ?? (process.env["SUPABASE_ANON_KEY"] ? process.env["SUPABASE_URL"] : import.meta.env['VITE_SUPABASE_ANON_KEY'] ? import.meta.env['VITE_SUPABASE_URL'] : undefined),
          key: process.env["AZUREBLAZE_BLOG_PUBLIC_KEY"] ?? process.env["SUPABASE_ANON_KEY"] ?? import.meta.env['VITE_SUPABASE_ANON_KEY'],
        };
        let posts;
        try { posts = await listPublishedPosts(connection); } catch { return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "Retry-After": "60" } }); }
        const xml = sitemapXml(posts);
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
