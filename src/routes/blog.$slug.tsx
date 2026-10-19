import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteFooter, SiteHeader } from "@/components/site";
import { formatDate } from "@/lib/posts";
import { postQuery } from "@/lib/posts.queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    const result = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!result.error && !result.post) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [
      { title: "Article unavailable — AzureBlaze" }, { name: "robots", content: "noindex" },
      { name: "description", content: "This AzureBlaze article is unavailable." },
      { property: "og:title", content: "Article unavailable — AzureBlaze" },
      { property: "og:description", content: "This AzureBlaze article is unavailable." },
      { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" },
    ] };
    return {
      meta: [
        { title: `${p.seoTitle} — AzureBlaze` },
        { name: "description", content: p.seoDescription },
        { property: "og:title", content: p.seoTitle },
        { property: "og:description", content: p.seoDescription },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: p.publishedAt },
        ...(p.updatedAt ? [{ property: "article:modified_time", content: p.updatedAt }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        ...(p.socialUrl ? [{ property: "og:image", content: p.socialUrl }, { name: "twitter:image", content: p.socialUrl }] : []),
      ],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          description: p.description,
          datePublished: p.publishedAt,
          dateModified: p.updatedAt ?? p.publishedAt,
          author: { "@type": "Person", name: "AzureBlaze" },
        }),
      }],
    };
  },
  component: Article,
  notFoundComponent: () => (
    <>
      <SiteHeader />
      <main className="container-site py-32 text-center">
        <h1 className="text-section">Article not found</h1>
        <Link to="/" hash="writing" className="mt-6 inline-block text-primary">← Back to writing</Link>
      </main>
      <SiteFooter />
    </>
  ),
});

function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      type="button"
      onClick={async () => {
        const url = window.location.href;
        if (navigator.share) {
          try { await navigator.share({ title, url }); } catch { /* cancelled */ }
        } else {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }}
      className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-card"
    >
      {copied ? "Link copied" : "Share"}
    </Button>
  );
}

function Article() {
  const { slug } = Route.useParams();
  const { data: { post, related, error } } = useSuspenseQuery(postQuery(slug));
  if (!post) return <><SiteHeader /><main className="container-site py-32 text-center"><h1 className="text-section">Article unavailable</h1><p role="status" className="mt-6 text-muted-foreground">{error}</p><Link to="/" hash="writing" className="mt-6 inline-block text-primary">← Back to writing</Link></main><SiteFooter /></>;
  return (
    <>
      <SiteHeader />
      <main className="container-site py-16 lg:py-24">
        <article className="mx-auto max-w-[700px]">
          <header>
            <p className="text-eyebrow flex items-center gap-2 text-primary"><span className="eyebrow-dot" aria-hidden="true" />{post.category}</p>
            <h1 className="mt-4 text-3xl font-extrabold leading-snug tracking-normal text-foreground sm:text-4xl">{post.title}</h1>
            <p className="text-lead mt-5 text-muted-foreground">{post.description}</p>
            <p className="mt-6 text-sm text-subtle">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              {post.updatedAt && <> · Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time></>}
              {" "}· {post.readingTime} min read
            </p>
          </header>
          {post.coverUrl && <img src={post.coverUrl} alt={post.coverAlt} className="mt-10 aspect-video w-full rounded-lg object-cover" />}
          <div className="prose-article mt-12 border-t border-border pt-10">
            <ReactMarkdown skipHtml remarkPlugins={[remarkGfm]} components={{ h1: ({ children }) => <h2>{children}</h2>, img: ({ src, alt }) => <img src={src} alt={alt ?? ""} loading="lazy" />, a: ({ href, children }) => <a href={href} {...(href?.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a> }}>{post.content}</ReactMarkdown>
          </div>
          <div className="mt-14 flex items-center justify-between border-t border-border pt-8">
            <Link to="/" hash="writing" className="text-sm text-primary hover:text-primary-hover">← Back to writing</Link>
            <ShareButton title={post.title} />
          </div>
          {related.length > 0 && (
            <aside className="mt-16">
              <h2 className="text-eyebrow text-subtle">Keep reading</h2>
              <ul className="mt-4 grid gap-4">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link to="/blog/$slug" params={{ slug: r.slug }} className="block rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-card">
                      <span className="font-medium text-foreground">{r.title}</span>
                      <span className="mt-1 block text-sm text-subtle">{formatDate(r.publishedAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
