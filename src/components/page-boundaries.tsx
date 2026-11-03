import { Link, useRouter, type ErrorComponentProps } from '@tanstack/react-router';
import { SiteFooter, SiteHeader } from './site';
import { Button } from './ui/button';
export function NotFoundPage() {
  return <><SiteHeader /><main className="container-site min-h-[60vh] py-32 text-center"><p className="text-eyebrow text-primary">404</p><h1 className="text-section mt-4 text-foreground">Page not found</h1><p className="mt-6 text-muted-foreground">This page doesn't exist or has been moved.</p><div className="mt-8 flex justify-center gap-6"><Link to="/" className="text-primary">Go home</Link><Link to="/blog" className="text-primary">Explore the blog</Link></div></main><SiteFooter /></>;
}
export function PageError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return <><SiteHeader /><main className="container-site min-h-[60vh] py-32 text-center"><h1 className="text-section text-foreground">Page unavailable</h1><p className="mt-6 text-muted-foreground">Please try again in a moment.</p><Button className="mt-8" onClick={async () => { await router.invalidate(); reset(); }}>Try again</Button></main><SiteFooter /></>;
}