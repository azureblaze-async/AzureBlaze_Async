# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## AzureBlaze writing connection

Articles are now read from the **existing editor database** `public.posts` table.
Files in `content/blogs/` are retained as old source material but are no longer loaded.
Do not create a second posts table in the site's new Cloud backend.

### Deployment configuration

Recommended server environment variables (local or hosting settings):

- `AZUREBLAZE_BLOG_URL`: the existing editor's project URL.
- `AZUREBLAZE_BLOG_PUBLIC_KEY`: that editor's **anon or publishable** key, never a service-role or secret key.

Alternatively the guide's build-time pair `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` is supported. Both must point to the existing editor.
Server-only `SUPABASE_URL` + `SUPABASE_ANON_KEY` also works.
Dedicated `AZUREBLAZE_BLOG_*` values take priority and avoid colliding with generated
Lovable Cloud settings. Do not overwrite generated settings in Lovable.
Set values on the deployment host and redeploy; do not commit a credential-bearing environment file.

The existing editor must already allow anon SELECT on published rows only, with
RLS enabled, and public media reads from `azureblaze-media`. The reader adds a
published-only filter too. Drafts and archived articles are never requested.
Lists omit Markdown bodies; detail reads fetch Markdown and render it with HTML
disabled. Cover and social images are resolved from the media bucket.
Homepage and article reads cache for one minute. The sitemap reads current
published rows and paginates beyond 1,000 entries. Missing configuration or
upstream failures show an unavailable message (no static fallback); sitemap
failures return HTTP 503 rather than a misleading empty sitemap.

### Check after configuration

1. Confirm a published editor post appears in Writing with its date and cover.
2. Open it and confirm its Markdown, metadata, and related posts.
3. Open a draft or archived slug directly: it must return 404.
4. Check `/sitemap.xml` contains published URLs only.
5. Publish/edit a post in the editor and check the site again after a minute.

No editor credentials were supplied during implementation, so live database
reads and hosted access policies remain unverified until these values are set.
