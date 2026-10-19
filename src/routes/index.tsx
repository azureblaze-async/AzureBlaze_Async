import { createFileRoute, Link } from "@tanstack/react-router";
import heroBg from "@/assets/web-page-background.png.asset.json";
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
            <p className="text-eyebrow flex items-center gap-2 text-primary"><span className="eyebrow-dot" aria-hidden="true" />Anonymous builder · Technology · Ideas</p>
            <h1 className="text-hero mt-5 text-foreground">The future isn't a limit. It's a <span className="text-primary">question.</span></h1>
            <p className="text-lead mt-6 max-w-xl text-muted-foreground">
              Question accepted limitations. Explore what technology could become. Build what doesn't exist yet.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink hash="writing">Explore the writing</ButtonLink>
              <ButtonLink hash="about" variant="ghost">About AzureBlaze</ButtonLink>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Technology", "Engineering", "Systems", "Ideas"].map((t) => <span key={t} className="tag-chip">{t}</span>)}
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

        <div className="border-y border-border bg-surface">
          <dl className="container-site grid grid-cols-2 md:grid-cols-4">
            {[
              ["Identity", "Anonymous"],
              ["Focus", "Technology & systems"],
              ["Articles", String(posts.length)],
              ["Motto", "Question. Build. Evolve."],
            ].map(([k, v], i) => (
              <div key={k} className={`py-4 ${i ? "md:border-l md:border-border md:pl-5" : ""}`}>
                <dt className="text-eyebrow text-subtle">{k}</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <section id="about" className="fade-in section-y scroll-mt-16">
          <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-eyebrow text-primary">About</p>
              <h2 className="text-section mt-2 text-foreground">Built on curiosity. Driven by questions.</h2>
            </div>
            <div className="space-y-5 text-muted-foreground">
              <p>AzureBlaze is an anonymous builder focused on technology, engineering, and the systems shaping our world.</p>
              <p>Through ideas, research, and the process of building, AzureBlaze explores accepted limitations and asks what could be done differently.</p>
              <p className="rule-block text-foreground">Not everything needs to be replaced. But everything worth improving begins with the willingness to question it.</p>
            </div>
          </div>
        </section>

        <section id="writing" className="fade-in section-y scroll-mt-16 border-t border-border">
          <div className="container-site">
            <p className="text-eyebrow text-primary">Writing</p>
            <h2 className="text-section mt-2 text-foreground">Ideas worth exploring.</h2>
            <p className="text-lead mt-3 max-w-xl text-muted-foreground">
              Thoughts on technology, accepted limitations, and possibilities beyond the present.
            </p>
            {posts.length === 0 ? (
              <p className="mt-10 text-subtle">New writing is on its way.</p>
            ) : (
              <ul className="mt-10 grid gap-5 md:grid-cols-2">
                {posts.map((p) => (
                  <li key={p.slug} className="group relative flex flex-col rounded-xl border border-border bg-surface p-7 transition-colors hover:border-primary-line hover:bg-card">
                    <p className="text-eyebrow text-primary">{p.category}</p>
                    <h3 className="mt-3 text-lg font-semibold leading-snug tracking-normal text-foreground">
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

        <section className="fade-in section-y border-t border-border">
          <div className="container-site summary-box px-6 py-14 text-center">
            <h2 className="text-section mx-auto max-w-2xl text-foreground">Better systems begin with better questions.</h2>
            <p className="text-lead mt-4 text-muted-foreground">Keep questioning. Keep exploring. Keep building.</p>
            <p className="text-eyebrow mt-8 text-primary">Question. Build. Evolve.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
