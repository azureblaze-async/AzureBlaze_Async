import logo from "@/assets/blaze-logo.png";
import { Link } from "@tanstack/react-router";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaProductHunt,
  FaReddit,
  FaXTwitter,
} from "react-icons/fa6";

export const SITE = {
  name: "AzureBlaze",
  tagline: "Question. Build. Evolve.",
  description:
    "AzureBlaze is an anonymous builder exploring technology, engineering, and the systems shaping our world.",
  socials: [
    { label: "GitHub", href: "https://github.com/azureblaze-async", Icon: FaGithub },
    { label: "Instagram", href: "https://www.instagram.com/azureblazesince2022/", Icon: FaInstagram },
    { label: "X", href: "https://x.com/azureblazeasync", Icon: FaXTwitter },
    { label: "Reddit", href: "https://www.reddit.com/user/Strict-Big-9235/", Icon: FaReddit },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/azure-blaze-b59a2b41a/", Icon: FaLinkedin },
    { label: "Product Hunt", href: "https://www.producthunt.com/@azure_blaze", Icon: FaProductHunt },
  ],
};

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return <img src={logo} alt="" width={32} height={32} className={className} />;
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display font-bold tracking-normal text-foreground">
      <LogoMark />
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
    <footer className="border-t border-border bg-surface">
      <div className="container-site flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Brand />
          <p className="text-sm text-subtle">{SITE.tagline}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-subtle sm:items-end">
          {SITE.socials.length > 0 && (
            <ul className="flex gap-2">
              {SITE.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary-line hover:text-primary"
                  >
                    <s.Icon size={15} aria-hidden="true" />
                    <span className="sr-only"> (opens in new tab)</span>
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
  const base = "inline-flex h-12 items-center justify-center rounded-lg px-6 text-xs font-medium uppercase tracking-wider transition-colors";
  const v =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary-hover"
      : "border border-input text-foreground hover:bg-card";
  return <Link to="/" hash={hash} className={`${base} ${v}`}>{children}</Link>;
}
