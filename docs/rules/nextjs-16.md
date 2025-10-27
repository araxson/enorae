# Next.js 16 Best Practices

Last updated: 2025-10-26
Version: 16.x

## App Router Patterns
- Organize SaaS surfaces with route groups like `app/(portals)/...` to keep URLs clean while scoping layouts per audience segment; nested groups can mount sibling layouts that share primitives without polluting URLs.
- Dynamic segments (e.g., `app/(portals)/customers/[id]/page.tsx`) receive params via the `params` prop; pair `generateStaticParams` with `dynamicParams = false` to tightly control crawlable slugs, and interpolate paths directly (`<Link href={`/customers/${id}`}>`) to satisfy App Router link validation.
- Parallel routes (`@modal`, `@analytics`) are mandatory for concurrent UI regions. As of 16, **every slot requires a `default.tsx`**; return `null` for no-op fallbacks or call `notFound()` for guardrails. Missing defaults now fail the build.
- Intercepting routes like `app/@modal/(.)login/page.tsx` keep canonical pages while letting in-app navigations render as overlays. Add a catch-all `(...)*` null page inside the slot to ensure the modal closes on unrelated navigations.
- Auth boundary now lives in `proxy.ts` (16 renamed `middleware.ts` for Node runtime interception). Rename the file and exported function to `proxy`, keep matchers restricted to `['/((?!api|_next/static|_next/image|.*\\.png$).*)']`, and leave Edge-only cases on legacy middleware until you opt into the new name.
- **Diff vs 15**: Next.js 15 introduced asynchronous `params`/`searchParams`; in 16 you must `await params` everywhere (warnings in 15 become hard errors). Audit layouts, metadata generators, and image routes accordingly.
- **Diff vs 14**: Partial Prerendering (PPR) previewed in 14 has evolved into Cache Components (opt-in in 16). Remove any lingering `experimental.ppr` flags—16 rejects them.

## Server Components
- Cache is opt-in in 16: use the new `"use cache"` directive (aka Cache Components) to persist the result of a layout, page, or helper function. Without it, dynamic code executes per-request, aligning with 15’s switch to uncached fetches/routes.
- Enable Cache Components globally by setting `cacheComponents: true` in `next.config.ts`; then annotate specific files with `"use cache"` for PPR-backed instant navigations.
- For fetches, continue to tag requests (`next: { tags: ['account', accountId] }`) and choose a revalidate window (`next: { revalidate: 3600 }`) when `"use cache"` should hydrate from stale-while-revalidate data.
- Wrap reusable loaders with `cache()` and expose `preload()` utilities so downstream components can warm caches ahead of render.
- Preserve streaming by kicking off data work (`const postsPromise = getPosts()`) then passing the promise into `<Suspense>` + `use(postsPromise)` readers; Cache Components cooperate with Suspense boundaries.
- Wire up the new **Next.js DevTools MCP** in development to give AI agents access to routing, cache state, unified logs, and stack traces—useful for debugging complex portal flows alongside the Codex CLI.
- **Diff vs 15**: Async request APIs (cookies, headers, draftMode, params/searchParams) must now be awaited; 15 emitted warnings, 16 enforces. `revalidateTag` also now requires a cache profile (e.g., `'max'`), or use the new `updateTag()` helper for read-your-writes semantics.
- **Diff vs 14**: Server Actions were stable in 14, but caching defaults were optimistic. 15 reset caches to `no-store`, so audit legacy code that assumed implicit caching.

## Server Actions
- Export mutations with `'use server'`, bind them directly to `<form action={createCustomer}>`, or import them into client components for imperative `onClick` flows.
- Post-mutation refresh paths with `revalidatePath('/portals/customers')` or data domains with `revalidateTag('customer:123', 'max')`; in 16 include a cache profile (`'max'`, `'force-no-store'`) or switch to `updateTag(tag)` when you want synchronous reads.
- Use the new `refresh()` Server Action helper when you only need to refetch uncached regions (e.g., live counters) without invalidating cached shells—pair it with `router.refresh()` for full refetches.
- Return serializable payloads (`{ message, fieldErrors }`) so React 19 hooks (`useFormState`, `useActionState`) can render inline errors. Combine with `aria-live="polite"` containers for accessibility.
- Validate on the server (Zod or domain logic) before executing side effects; immediately short-circuit with structured errors to preserve progressive enhancement.
- **Diff vs 15**: The `next/form` helper shipped in 15 for client-side navigation after submissions; continue to upgrade forms that need SPA transitions. 16 tightens Server Action endpoint generation—unused actions are elided at build time for security.
- **Diff vs 14**: Server Actions were introduced as stable in 14; prior projects using API routes should migrate to Actions to benefit from automatic revalidation and React form hooks.

## Client Components
- Only mark files with `'use client'` when they need hooks, browser APIs, or event handlers. Keep layouts/pages server-rendered to leverage streaming and Cache Components.
- Compose providers in server files by wrapping children with client providers (`<ThemeProvider>{children}</ThemeProvider>`); the provider file carries the `'use client'` directive, not the layout.
- Import server actions straight into client modules (`onClick={() => createInvoice()}`) to avoid bespoke fetch wrappers; React serializes the call automatically.
- Use navigation hooks (`useSelectedLayoutSegment`, `useSelectedLayoutSegments`) to drive active states in nav chrome; remember these hooks require client boundaries.
- **Diff vs 15**: Turbopack is now the default bundler in 16 (opt out with `next build --webpack`). Monitor client bundle output via `ANALYZE=true npm run build` since Turbopack rewrites bundling heuristics.
- **Diff vs 14**: 14 introduced `useFormState`/`useFormStatus`; upgrade any legacy mutation flows that still rely on custom loading state to the built-in hooks for consistent UX.

## Metadata & SEO
- Use `generateMetadata` in route segments that depend on runtime data; merge with existing parent metadata using the `ResolvingMetadata` helper to extend images/titles rather than replace them.
- Keep a project-level `metadata` export (or `layout.tsx` metadata) for defaults like keywords, referrer policy, and format detection, then override per segment where needed.
- Generate dynamic OG/Twitter images via `opengraph-image.tsx`/`twitter-image.tsx` or the `generateImageMetadata` API. Declare `export const size = { width: 1200, height: 630 }` and `export const alt = '...'` for accessibility.
- **Diff vs 16**: Metadata image routes now receive async params (`id` becomes `Promise<string>`); await them before use. If you relied on synchronous params in 15, you must refactor.
- **Diff vs 15**: `next/image` local sources with query strings now require `images.localPatterns` for security; configure Supabase buckets or internal asset hosts explicitly.
- **Diff vs 14**: OG/Twitter automation existed but `generateMetadata` was optional—standardize on it to avoid mixing with legacy `next/head`.

## Performance
- `next/image` defaults changed in 16: cache TTL increased to 4 hours, small `imageSizes` entries trimmed, `qualities` defaults to `[75]`, and local IP optimization is blocked (`images.dangerouslyAllowLocalIP = false`). Explicitly opt in only when needed.
- Configure `images.remotePatterns` instead of `images.domains`; 16 deprecates the old field. Add `images.localPatterns` for local assets with query params.
- Turbopack is now default for dev/build. Expect faster cold starts and incremental builds, but add bundle analysis to ensure new optimizations don’t hide regressions (`ANALYZE=true npm run build`).
- Build logs are more granular in 16 (Compile vs Render). Use them to track hotspots in complex routes.
- Fonts: continue using `next/font` (self-hosted). 15 removed `@next/font` legacy package and font-family hashing—clean up any lingering imports.
- For streaming UX, keep using `loading.tsx` per segment and drop skeleton components inside `<Suspense>`. Cache Components + PPR favor mixing static shells with streamed interior content.
- **Diff vs 15**: Next.js 15 changed fetch, GET handlers, and client navigations to `no-store` by default; Cache Components in 16 let you reintroduce caching intentionally. Revisit performance-critical queries to opt into `"use cache"` where beneficial.
- **Diff vs 14**: Turbopack was preview-only in 14; verifying bundler parity is essential when migrating older workspaces.

## Forms
- Prefer progressive enhancement: native `<form>` with Server Actions handles the happy path without JS; `next/form` (added in 15) upgrades to SPA-style navigation when hydration completes.
- Use `useFormState`/`useActionState` for server-returned payloads (success, field errors) and `useFormStatus` within shared submit buttons for pending state. Surface errors near inputs and announce via `aria-live`.
- On the server, validate via Zod or domain logic, returning `{ errors }` alongside meaningful `message` copies. Keep actions idempotent to tolerate retries from unstable connections.
- Handle optimistic UI with `useOptimistic` for partial updates; combine with `revalidateTag`/`updateTag` to keep cached views consistent.
- **Diff vs 15**: `revalidateTag` requires a cache profile in 16; adjust forms that previously called `revalidateTag('foo')` to `revalidateTag('foo', 'max')` or swap to `updateTag`.
- **Diff vs 14**: Server Actions-based forms replaced bespoke API routes. If any flows still rely on client fetch + `/api/*`, migrate to Actions to inherit caching, revalidation, and security improvements.
