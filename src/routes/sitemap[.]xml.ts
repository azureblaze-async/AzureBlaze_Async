import { createFileRoute } from "@tanstack/react-router";
import { posts } from "@/lib/posts";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const urls = [
          `<url><loc>${origin}/</loc></url>`,
          ...posts.map((p) => `<url><loc>${origin}/blog/${p.slug}</loc><lastmod>${p.updatedAt ?? p.publishedAt}</lastmod></url>`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
