import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { listPublishedPosts } = await import("@/lib/posts.server");
        const connection = {
          url: process.env["AZUREBLAZE_BLOG_URL"] ?? (process.env["SUPABASE_ANON_KEY"] ? process.env["SUPABASE_URL"] : import.meta.env['VITE_SUPABASE_ANON_KEY'] ? import.meta.env['VITE_SUPABASE_URL'] : undefined),
          key: process.env["AZUREBLAZE_BLOG_PUBLIC_KEY"] ?? process.env["SUPABASE_ANON_KEY"] ?? import.meta.env['VITE_SUPABASE_ANON_KEY'],
        };
        const escapeXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
        let posts;
        try { posts = await listPublishedPosts(connection); } catch { return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "Retry-After": "60" } }); }
        const origin = new URL(request.url).origin;
        const urls = [
          `<url><loc>${escapeXml(origin)}/</loc></url>`,
          ...posts.map((p) => `<url><loc>${escapeXml(origin)}/blog/${encodeURIComponent(p.slug)}</loc><lastmod>${escapeXml(p.updatedAt ?? p.publishedAt)}</lastmod></url>`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
