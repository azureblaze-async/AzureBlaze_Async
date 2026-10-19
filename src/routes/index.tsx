import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-character.jpg";
import { ButtonLink, SiteFooter, SiteHeader } from "@/components/site";
import { formatDate, posts } from "@/lib/posts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AzureBlaze — Question. Build. Evolve." },
      { name: "description", content: "An anonymous builder exploring technology, accepted limitations, and what could be built next." },
      { property: "og:title", content: "AzureBlaze — Question. Build. Evolve." },
      { property: "og:description", content: "An anonymous builder exploring technology, accepted limitations, and what could be built next." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="container-site grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p className="text-eyebrow text-primary">Anonymous builder · Technology · Ideas</p>
            <h1 className="text-hero mt-5 text-foreground">The future isn't a limit. It's a question.</h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Question accepted limitations. Explore what technology could become. Build what doesn't exist yet.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink hash="writing">Explore the writing</ButtonLink>
              <ButtonLink hash="about" variant="ghost">About AzureBlaze</ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="glow-azure absolute inset-0 -z-10 scale-110" aria-hidden="true" />
            <img
              src={hero}
              width={1024}
              height={1280}
              fetchPriority="high"
              alt="Anonymous AzureBlaze figure in a black cap and dark glasses, lit by blue rim light"
              className="h-auto w-full rounded-2xl"
            />
          </div>
        </section>

        <section id="about" className="section-y scroll-mt-16 border-t border-border">
          <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="text-section text-foreground">Built on curiosity. Driven by questions.</h2>
            <div className="space-y-5 text-lg text-muted-foreground">
              <p>AzureBlaze is an anonymous builder focused on technology, engineering, and the systems shaping our world.</p>
              <p>Through ideas, research, and the process of building, AzureBlaze explores accepted limitations and asks what could be done differently.</p>
              <p className="text-foreground">Not everything needs to be replaced. But everything worth improving begins with the willingness to question it.</p>
            </div>
          </div>
        </section>

        <section id="writing" className="section-y scroll-mt-16 border-t border-border">
          <div className="container-site">
            <h2 className="text-section text-foreground">Ideas worth exploring.</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Thoughts on technology, accepted limitations, and possibilities beyond the present.
            </p>
            {posts.length === 0 ? (
              <p className="mt-10 text-subtle">New writing is on its way.</p>
            ) : (
              <ul className="mt-10 grid gap-5 md:grid-cols-2">
                {posts.map((p) => (
                  <li key={p.slug} className="group relative flex flex-col rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary/50 hover:bg-elevated">
                    <p className="text-eyebrow text-primary">{p.category}</p>
                    <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-foreground">
                      <Link to="/blog/$slug" params={{ slug: p.slug }} className="after:absolute after:inset-0 after:rounded-xl">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="mt-3 flex-1 text-muted-foreground">{p.description}</p>
                    <div className="mt-6 flex items-center justify-between text-sm text-subtle">
                      <span>{formatDate(p.publishedAt)} · {p.readingTime} min read</span>
                      <span aria-hidden="true" className="text-primary transition-transform group-hover:translate-x-1">Read article →</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="section-y border-t border-border text-center">
          <div className="container-site">
            <h2 className="text-section mx-auto max-w-2xl text-foreground">Better systems begin with better questions.</h2>
            <p className="mt-4 text-muted-foreground">Keep questioning. Keep exploring. Keep building.</p>
            <p className="text-eyebrow mt-8 text-primary">Question. Build. Evolve.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
