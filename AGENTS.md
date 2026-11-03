<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Public writing reader
- Read published editor posts through server-only fetch helpers exposed by public server functions; use only the external editor's anon/publishable key so its read policies remain authoritative.
- Keep formatting/types in posts.ts, requests in posts.server.ts, RPC boundaries in posts.functions.ts and shared query options in posts.queries.ts so browser navigation and SSR use the same reader.
- Prefer dedicated blog connection variables over generated Cloud variables to avoid mixing the separate editor and site backends.

## Discoverability
- Normalize frontmatter only at the public reader boundary; preserve the Markdown body and never write changes back to the editor database.
- Centralize page metadata and XML serialization in browser-safe seo.ts and feeds.ts; only leaf content routes supply canonical and image tags to avoid duplicate head links.
- Enumerate public post slugs during build for prerendering with a 10,000-page safety cap; long-tail posts remain SSR and live feeds query the public editor on each request so new posts are discoverable between publishes.
