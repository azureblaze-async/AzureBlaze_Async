import { queryOptions } from '@tanstack/react-query';
import { listPosts, readPost } from './posts.functions';
export const postsQuery = queryOptions({ queryKey: ['published-posts'], queryFn: () => listPosts(), staleTime: 60000 });
export const postQuery = (slug: string) => queryOptions({ queryKey: ['published-post', slug], queryFn: () => readPost({ data: { slug } }), staleTime: 60000 });
