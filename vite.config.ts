// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv, type ConfigEnv } from 'vite';
import { listPublishedPosts } from './src/lib/posts.server';

const MAX_PRERENDER_PAGES = 10000;
export default async (configEnv: ConfigEnv) => {
  const { command, mode } = configEnv;
  const pages = [{ path: '/' }, { path: '/blog' }, { path: '/about' }];
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), '');
    const url = process.env['AZUREBLAZE_BLOG_URL'] ?? env['AZUREBLAZE_BLOG_URL'] ?? process.env['SUPABASE_URL'] ?? env['VITE_SUPABASE_URL'];
    const key = process.env['AZUREBLAZE_BLOG_PUBLIC_KEY'] ?? env['AZUREBLAZE_BLOG_PUBLIC_KEY'] ?? process.env['SUPABASE_ANON_KEY'] ?? env['VITE_SUPABASE_ANON_KEY'];
    if (url && key) {
      // Keep the same public connection available to SSR during the prerender pass.
      process.env['AZUREBLAZE_BLOG_URL'] = url;
      process.env['AZUREBLAZE_BLOG_PUBLIC_KEY'] = key;
      const posts = await listPublishedPosts({ url, key });
      pages.push(...posts.slice(0, MAX_PRERENDER_PAGES - pages.length).map(p => ({ path: `/blog/${encodeURIComponent(p.slug)}` })));
      if (posts.length > MAX_PRERENDER_PAGES - 3) console.warn('Prerender page cap reached; remaining posts use server-rendered HTML and remain in the sitemap.');
    } else {
      console.warn('Blog connection is missing: static post generation cannot run. Only home, Blog and About will be prerendered.');
    }
  }
  return defineConfig({ tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    pages,
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  } })(configEnv);
};
