import { createFileRoute, Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { SiteHeader, SiteFooter } from '@/components/site';
import { NotFoundPage, PageError } from '@/components/page-boundaries';
import { postsQuery } from '@/lib/posts.queries';
import { formatDate } from '@/lib/posts';
import { metaDescription, pageHead } from '@/lib/seo';
export const Route = createFileRoute('/blog/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => pageHead('/blog', 'Blog | AzureBlaze', metaDescription('Read AzureBlaze’s latest questions on technology, engineering and everyday systems. Explore ideas, accepted limitations and possibilities beyond the present.', 'Blog')),
  component: Blog,
  errorComponent: PageError,
  notFoundComponent: NotFoundPage,
});
function Blog() {
  const { data: { posts, error } } = useSuspenseQuery(postsQuery);
  return <><SiteHeader /><main className="container-site min-h-[60vh] py-16 lg:py-24"><p className="text-eyebrow text-primary">Writing</p><h1 className="text-section mt-3 text-foreground">Blog</h1><p className="text-lead mt-5 text-muted-foreground">Ideas worth exploring.</p>{error ? <p role="status" className="mt-12 text-muted-foreground">Writing is temporarily unavailable.</p> : posts.length === 0 ? <p className="mt-12 text-muted-foreground">No published articles yet.</p> : <ul className="mt-12 divide-y divide-border">{posts.map(p => <li key={p.slug} className="py-8"><time dateTime={p.publishedAt} className="text-eyebrow text-subtle">{formatDate(p.publishedAt)}</time><h2 className="mt-3 text-xl font-semibold text-foreground"><Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-primary">{p.title}</Link></h2><p className="mt-3 line-clamp-1 text-muted-foreground">{p.description}</p></li>)}</ul>}</main><SiteFooter /></>;
}