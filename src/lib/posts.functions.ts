import { createServerFn } from '@tanstack/react-start';

export const listPosts = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const { listPublishedPosts } = await import('./posts.server');
    return { posts: await listPublishedPosts(), error: null };
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
      const { getPublishedPost, listPublishedPosts } = await import('./posts.server');
      const post = await getPublishedPost(data.slug);
      const related = post ? await listPublishedPosts().catch(() => []) : [];
      return { post, related: related.filter(p => p.slug !== data.slug && p.category === post?.category).slice(0, 2), error: null };
    } catch {
      return { post: null, related: [], error: 'This article is temporarily unavailable. Please try again later.' };
    }
  });
