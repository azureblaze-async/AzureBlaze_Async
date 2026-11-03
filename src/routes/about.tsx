import { createFileRoute } from '@tanstack/react-router';
import { SiteHeader, SiteFooter } from '@/components/site';
import { metaDescription, pageHead } from '@/lib/seo';
export const Route = createFileRoute('/about')({
  head: () => pageHead('/about', 'About | AzureBlaze', metaDescription('Meet AzureBlaze, an anonymous, vision-driven builder questioning the foundations of everyday technology through curiosity, research, engineering and ideas.', 'About')),
  component: About,
});
function About() {
  return <><SiteHeader /><main className="container-site min-h-[60vh] py-16 lg:py-24"><div className="max-w-3xl"><p className="text-eyebrow text-primary">About</p><h1 className="text-section mt-3 text-foreground">AzureBlaze</h1><p className="text-lead mt-6 text-muted-foreground">Built on curiosity. Driven by questions.</p><div className="mt-10 space-y-6 text-muted-foreground"><p>AzureBlaze is an anonymous, vision-driven builder focused on technology, engineering, and the systems shaping our world.</p><p>Through ideas, research, and the process of building, AzureBlaze questions the foundations of everyday technology, explores accepted limitations, and asks what could be done differently.</p><p className="rule-block text-foreground">Not everything needs to be replaced. But everything worth improving begins with the willingness to question it.</p></div></div></main><SiteFooter /></>;
}