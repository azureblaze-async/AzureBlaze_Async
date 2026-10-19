import { Link } from "@tanstack/react-router";

export const SITE = {
  name: "AzureBlaze",
  tagline: "Question. Build. Evolve.",
  description:
    "AzureBlaze is an anonymous builder exploring technology, engineering, and the systems shaping our world.",
  socials: [] as { label: string; href: string }[], // add verified profile URLs here
};

export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 3 L29 29 H22.5 L16 15.5 L9.5 29 H3 Z" fill="currentColor" />
      <path d="M12.2 23 H19.8 L18.4 20 H13.6 Z" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground">
      <span className="text-primary"><LogoMark /></span>
      <span className="text-lg">AzureBlaze</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <nav aria-label="Main" className="container-site flex h-16 items-center justify-between">
        <Brand />
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" hash="about" className="transition-colors hover:text-foreground">About</Link>
          <Link to="/" hash="writing" className="transition-colors hover:text-foreground">Writing</Link>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container-site flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Brand />
          <p className="text-sm text-subtle">{SITE.tagline}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-subtle sm:items-end">
          {SITE.socials.length > 0 && (
            <ul className="flex gap-4">
              {SITE.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                    {s.label} <span className="sr-only">(opens in new tab)</span>↗
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p>© {new Date().getFullYear()} AzureBlaze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function ButtonLink({
  hash, children, variant = "primary",
}: { hash: string; children: React.ReactNode; variant?: "primary" | "ghost" }) {
  const base = "inline-flex h-12 items-center justify-center rounded-lg px-6 text-sm font-medium transition-colors";
  const v =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary-hover"
      : "border border-border text-foreground hover:bg-card";
  return <Link to="/" hash={hash} className={`${base} ${v}`}>{children}</Link>;
}
