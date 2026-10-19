import { createServerFn } from '@tanstack/react-start';

export const listPosts = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const connection = {
      url: process.env['AZUREBLAZE_BLOG_URL'] ?? (process.env['SUPABASE_ANON_KEY'] ? process.env['SUPABASE_URL'] : import.meta.env.VITE_SUPABASE_ANON_KEY ? import.meta.env.VITE_SUPABASE_URL : undefined),
      key: process.env['AZUREBLAZE_BLOG_PUBLIC_KEY'] ?? process.env['SUPABASE_ANON_KEY'] ?? import.meta.env.VITE_SUPABASE_ANON_KEY,
    };

    const { listPublishedPosts } = await import('./posts.server');
    return { posts: await listPublishedPosts(connection), error: null };
  } catch {
    return { posts: [], error: 'Writing is temporarily unavailable. Please try again later.' };
  }
});
export const readPost = createServerFn({ method: 'GET' })
  .inputValidator((input: { slug: string }) => {
    if (typeof input.slug !== 'string') throw new Error('Invalid article');
    return input;
  })
  .handler(async ({ data }) => {
    try {
    const connection = {
      url: process.env['AZUREBLAZE_BLOG_URL'] ?? (process.env['SUPABASE_ANON_KEY'] ? process.env['SUPABASE_URL'] : import.meta.env.VITE_SUPABASE_ANON_KEY ? import.meta.env.VITE_SUPABASE_URL : undefined),
      key: process.env['AZUREBLAZE_BLOG_PUBLIC_KEY'] ?? process.env['SUPABASE_ANON_KEY'] ?? import.meta.env.VITE_SUPABASE_ANON_KEY,
    };
      const { getPublishedPost, listPublishedPosts } = await import('./posts.server');
      const post = await getPublishedPost(data.slug, connection);
      const related = post ? await listPublishedPosts(connection).catch(() => []) : [];
      return { post, related: related.filter(p => p.slug !== data.slug && p.category === post?.category).slice(0, 2), error: null };
    } catch {
      return { post: null, related: [], error: 'This article is temporarily unavailable. Please try again later.' };
    }
  });
