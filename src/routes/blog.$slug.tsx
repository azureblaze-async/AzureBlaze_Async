import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteFooter, SiteHeader } from "@/components/site";
import { formatDate, getPost, posts } from "@/lib/posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [{ title: "Article not found — AzureBlaze" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${p.title} — AzureBlaze` },
        { name: "description", content: p.description },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: p.publishedAt },
        ...(p.updatedAt ? [{ property: "article:modified_time", content: p.updatedAt }] : []),
        { name: "twitter:card", content: "summary_large_image" },
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
    <button
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
    </button>
  );
}

function Article() {
  const { post } = Route.useLoaderData();
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  return (
    <>
      <SiteHeader />
      <main className="container-site py-16 lg:py-24">
        <article className="mx-auto max-w-[700px]">
          <header>
            <p className="text-eyebrow flex items-center gap-2 text-primary"><span className="eyebrow-dot" aria-hidden="true" />{post.category}</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">{post.title}</h1>
            <p className="text-lead mt-5 text-muted-foreground">{post.description}</p>
            <p className="mt-6 text-sm text-subtle">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              {post.updatedAt && <> · Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time></>}
              {" "}· {post.readingTime} min read
            </p>
          </header>
          <div className="prose-article mt-12 border-t border-border pt-10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
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
                      <span className="mt-1 block text-sm text-subtle">{r.readingTime} min read</span>
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
