# Architecture Rules - File Structure, Naming, and Limits

**Purpose:** Define universal codebase architecture patterns for Next.js App Router projects with strict file organization, naming conventions, and size limits optimized for AI scanning.

**Last Updated:** January 4, 2025 (Next.js 16 Update)
**Stack Version:** Next.js 16+ (App Router), TypeScript 5.x, Supabase (Database + Auth)

---

## Recent Updates (January 2025)

**Next.js 16 Breaking Changes & New Features:**

**Build & Development:**
- **Turbopack is now default** - No `--turbopack` flag needed for `next dev` or `next build`
- **Dev build output moved** - Development builds now output to `.next/dev/` instead of `.next/`
- **Development mode detection** - Use `process.env.NODE_ENV === 'development'` instead of checking `process.argv` for 'dev'
- **Turbopack file system caching** - Enable with `experimental.turbopackFileSystemCacheForDev: true` for faster compile times

**Middleware/Proxy Changes:**
- **`middleware.ts` renamed to `proxy.ts`** - Both file name and export function must be renamed
- **Export function renamed** - `export function middleware()` → `export function proxy()`
- **Configuration renamed** - `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`
- **Migration:** Use codemod `npx @next/codemod@canary upgrade latest`

**Configuration Updates:**
- **Turbopack config moved** - `experimental.turbopack` → top-level `turbopack` option
- **PPR renamed** - `experimental.ppr` → `cacheComponents: true`
- **dynamicIO renamed** - `experimental.dynamicIO` → `cacheComponents: true`
- **bundlePagesExternals stabilized** - Now `bundlePagesRouterDependencies`

**Caching & Data Fetching:**
- **New `updateTag()` API** - Immediate cache invalidation with read-your-writes semantics (Server Actions only)
- **New `refresh()` API** - Trigger client router refresh from Server Actions
- **Stable cache APIs** - `cacheLife` and `cacheTag` no longer require `unstable_` prefix
- **`revalidateTag()` enhanced** - Now supports 'max' parameter for stale-while-revalidate pattern

**Image Optimization:**
- **`minimumCacheTTL` default changed** - Now 4 hours (14400s) instead of 60s
- **Local images with query strings** - Require explicit `localPatterns` configuration
- **Local IP optimization disabled** - Requires `dangerouslyAllowLocalIP: true` flag
- **Image generation params async** - `params` and `id` in `generateImageMetadata` now require `await`

**Routing:**
- **Parallel routes require `default.js`** - Must provide fallback with `notFound()` to avoid build failures
- **Smooth scroll behavior** - No longer overridden by default; opt-in with `data-scroll-behavior="smooth"` on `<html>`

**Continued from 15.x:**
- `params` and `searchParams` are Promises (requires `await`)
- Route Handlers no longer cache by default
- `template.tsx` for state reset on navigation
- `default.tsx` required for parallel routes fallback

---

## Quick Decision Tree

```
Where should this file go?
│
├─ Is it infrastructure/technical (auth, cache, validation)?
│  └─ YES → lib/[category]/
│
├─ Is it a UI library component (shadcn/ui)?
│  └─ YES → components/ui/ (NEVER EDIT)
│
├─ Is it feature-specific business logic?
│  ├─ YES → Used by ALL portals/modules?
│  │   ├─ YES → features/shared/[feature]/
│  │   └─ NO → features/[portal]/[feature]/
│  │
│  └─ NO → Is it a page route?
│      └─ YES → app/([portal])/[route]/page.tsx (max 15 lines)
│
└─ Is it configuration or types?
   ├─ Config → lib/config/
   ├─ Shared types → lib/types/
   └─ Auto-generated types → lib/types/database.types.ts (NEVER EDIT)
```

```
What pattern should this feature use?
│
├─ Count total files needed
│
├─ < 5 files → Pattern 1: Small Feature (flat api/)
├─ 5-15 files → Pattern 2: Medium Feature (organized api/)
├─ > 15 files → Pattern 3: Large Feature (nested api/)
└─ > 30 files → STOP: Split into multiple features
```

```
What file naming should I use?
│
├─ In organized directory (api/queries/, api/mutations/)?
│  └─ YES → Use domain name: [domain].ts (NO suffix)
│
├─ Flat api structure (small feature)?
│  └─ YES → Use plural: queries.ts, mutations.ts
│
├─ Next.js special file?
│  └─ YES → page.tsx, layout.tsx, route.ts, etc.
│
└─ Regular file?
   └─ Use kebab-case: [feature-component].tsx
```

---

## Critical Rules

### Must Follow

1. **App Router Structure** - All routes MUST use Next.js 16+ App Router conventions (app/ directory)
2. **Thin Pages** - Page files (page.tsx) MUST be under 15 lines, delegate to feature components
3. **File Size Limits** - Never exceed: components (200 lines), queries/mutations (300 lines), index (50 lines)
4. **Index Files Required** - Every directory with exports MUST have index.ts re-exporting all items
5. **Kebab-Case Files** - All files and folders MUST use kebab-case (except Next.js conventions)
6. **Server Directives** - Always add 'server-only' to queries, 'use server' to mutations, 'use client' to client components
7. **No Direct Imports** - Always import through index.ts files, never bypass them
8. **Feature Isolation** - Business logic stays in features/, infrastructure in lib/

### FORBIDDEN

1. **Editing UI Library Files** - NEVER edit components/ui/* (shadcn/ui managed)
2. **Editing Generated Types** - NEVER edit lib/types/database.types.ts (Supabase generated)
3. **Editing Globals CSS** - NEVER edit app/globals.css directly (use Tailwind utilities)
4. **Route Groups Abuse** - Do not create deeply nested route groups beyond ([portal])
5. **Bypassing Index Files** - Do not import directly from implementation files
6. **Wrong File Placement** - Do not put business logic in lib/, infrastructure in features/
7. **Oversized Files** - Do not exceed file size limits, split immediately
8. **Suffixes in Organized Dirs** - Do not use [domain]-queries.ts in api/queries/ directory
9. **Using middleware.ts** - REMOVED in Next.js 16, use proxy.ts instead (migration: `npx @next/codemod@canary upgrade latest`)
10. **Not awaiting params** - In Next.js 15+, params and searchParams are Promises and MUST be awaited
11. **Assuming Route Handler caching** - In Next.js 15+, GET/HEAD are NOT cached by default (opt-in with `export const dynamic = 'force-static'`)
12. **Using experimental_ppr** - Removed in Next.js 15+, use codemod to remove: `npx @next/codemod@latest remove-experimental-ppr .`

---

## Next.js 16+ App Router Structure

### Pattern 1: Root Application Structure

**When to use:** Every Next.js App Router project

**Implementation:**
```
project-root/
├── app/                                    # Next.js App Router (all routes)
│   ├── layout.tsx                          # Root layout (required)
│   ├── page.tsx                            # Home page
│   ├── globals.css                         # Global styles (NEVER EDIT)
│   ├── not-found.tsx                       # 404 page
│   ├── error.tsx                           # Error boundary
│   ├── loading.tsx                         # Loading UI
│   └── ([portal])/                         # Route group for portals
│       ├── layout.tsx                      # Portal layout (optional)
│       └── [route]/
│           ├── page.tsx                    # Route page (< 15 lines)
│           ├── loading.tsx                 # Route loading (optional)
│           └── error.tsx                   # Route error (optional)
│
├── features/                               # Feature modules (business logic)
│   ├── [portal]/                           # Portal-specific features
│   │   └── [feature]/                      # Individual feature
│   ├── shared/                             # Cross-portal features
│   └── marketing/                          # Marketing pages
│
├── components/                             # Shared components
│   └── ui/                                 # shadcn/ui components (NEVER EDIT)
│
├── lib/                                    # Infrastructure utilities
│   ├── auth/                               # Authentication (Supabase Auth)
│   ├── db/                                 # Database clients (Supabase)
│   ├── config/                             # Configuration
│   ├── types/                              # Shared types
│   ├── utils/                              # Utility functions
│   └── hooks/                              # Shared React hooks
│
├── public/                                 # Static assets
├── proxy.ts                           # Next.js middleware
├── next.config.js                          # Next.js configuration
├── tsconfig.json                           # TypeScript configuration
└── tailwind.config.ts                      # Tailwind CSS configuration
```

### Pattern 2: App Router File Conventions

**When to use:** Following Next.js routing conventions

**Special Files (Reserve Names):**
```typescript
// ✅ CORRECT - Next.js 16+ special files
app/layout.tsx              // Root layout (required, must have <html> and <body>)
app/page.tsx                // Home page
app/not-found.tsx           // 404 page
app/error.tsx               // Error boundary (must be 'use client')
app/loading.tsx             // Loading UI (Suspense fallback)
app/template.tsx            // Template with state reset on navigation (NEW in 15+)
app/default.tsx             // Default fallback for parallel routes (NEW in 15+)
app/route.ts                // API route handler

// Deprecated in Next.js 15+
app/middleware.ts           // ❌ REMOVED in Next.js 16 - Use proxy.ts instead

// New in Next.js 15+
app/proxy.ts                // ✅ Proxy handler (replaces middleware.ts in Next.js 16+)

app/([portal])/layout.tsx   // Portal layout
app/([portal])/[route]/page.tsx        // Dynamic route page
app/([portal])/[...slug]/page.tsx      // Catch-all route
app/([portal])/[[...slug]]/page.tsx    // Optional catch-all

// ❌ WRONG - Reserved names used incorrectly
app/layout.js               // Use .tsx for TypeScript
app/page.js                 // Use .tsx for TypeScript
features/layout.tsx         // layout.tsx only in app/ directory
```

**Root Layout Requirements:**
```typescript
// ✅ CORRECT - app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Enorae',
  description: 'Salon booking platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// ❌ WRONG - Missing html/body tags
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>  // Must have html and body
}
```

**Page Component Pattern:**
```typescript
// ✅ CORRECT - app/([portal])/dashboard/page.tsx (< 15 lines)
// Next.js 15+: params is now a Promise
import { Suspense } from 'react'
import { DashboardFeature } from '@/features/[portal]/dashboard'

export default async function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardFeature />
    </Suspense>
  )
}

// ✅ CORRECT - With dynamic params (Next.js 15+)
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params  // params is now a Promise
  return (
    <Suspense fallback={null}>
      <DashboardFeature id={id} />
    </Suspense>
  )
}

// ❌ WRONG - Not awaiting params (Next.js 15+)
export default async function DashboardPage({ params }: { params: { id: string } }) {
  const { id } = params  // ERROR: params is a Promise
  return <div>...</div>
}

// ❌ WRONG - Business logic in page file
export default async function DashboardPage() {
  const data = await fetch(...)  // Business logic belongs in features/
  const processed = data.map(...)
  return <div>...</div>  // Exceeds 15 lines
}
```

**Template Component Pattern (NEW in Next.js 15+):**
```typescript
// ✅ CORRECT - app/([portal])/template.tsx
// Template creates a new instance on navigation (unlike layout which persists)
// Use when you need state/effects to reset on navigation
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* This wrapper re-mounts on every navigation */}
      {children}
    </div>
  )
}

// Use case: Reset scroll position, animations, or form state on route change
// Difference from layout: layout persists, template re-mounts
```

**Default Component Pattern (Required for Parallel Routes):**
```typescript
// ✅ CORRECT - app/@analytics/default.tsx
// Default fallback when no matching page in parallel route slot
export default function Default() {
  return null  // Or a default UI
}

// File structure for parallel routes:
// app/
// ├── layout.tsx
// ├── page.tsx
// ├── default.tsx         // Optional: for children slot
// ├── @team/
// │   ├── default.tsx     // Required: fallback for @team slot
// │   └── settings/
// │       └── page.tsx
// └── @analytics/
//     ├── default.tsx     // Required: fallback for @analytics slot
//     └── page.tsx

// ❌ WRONG - Missing default.tsx in parallel route slots
// Will cause build errors or blank screens
```

**Proxy Pattern (Replaces middleware.ts in Next.js 16):**
```typescript
// ✅ CORRECT - proxy.ts at root level (Next.js 16+)
// Note: middleware.ts is REMOVED in Next.js 16, replaced by proxy.ts
// Migration: npx @next/codemod@canary upgrade latest
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// IMPORTANT: Export function must be named 'proxy' (not 'middleware')
export function proxy(request: NextRequest) {
  // Proxy logic (auth checks, redirects, etc.)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

// Migration from middleware.ts:
// Run: npx @next/codemod@latest middleware-to-proxy .

// ❌ WRONG - Using deprecated middleware.ts
// middleware.ts is deprecated in Next.js 15+
export function middleware(request: NextRequest) {
  return NextResponse.next()
}
```

---

## File Size Limits

### Absolute Limits (Split Immediately When Exceeded)

| File Type | Hard Limit | Action When Exceeded |
|-----------|-----------|----------------------|
| **Index files** | 50 lines | Create domain-specific index files |
| **Components** | 200 lines | Extract sub-components or sections |
| **Queries/Mutations** | 300 lines | Split by domain or action |
| **Helpers** | 200 lines | Group into separate helper files |
| **Hooks/Utils** | 150 lines | Split by concern |
| **Types** | 200 lines | Create domain-specific type files |
| **Schemas** | 250 lines | Split into separate schema files |
| **Constants** | 100 lines | Group by domain |
| **Pages** | 15 lines | Extract to feature component |
| **Layouts** | 100 lines | Extract UI to components |
| **Loading/Error** | 50 lines | Simple UI only |

### File Size Decision Logic

```typescript
// Decision tree for splitting files
if (file.type === 'page.tsx' && file.lines > 15) {
  action = 'Extract to feature component in features/[portal]/[feature]/'
}
else if (file.type === 'layout.tsx' && file.lines > 100) {
  action = 'Extract UI components to features/[portal]/[feature]/components/'
}
else if (file.type === 'index.ts' && file.lines > 50) {
  action = 'Create domain-specific index files'
}
else if (file.type === 'component' && file.lines > 200) {
  action = 'Extract sub-components or create sections'
}
else if (file.type === 'query' && file.lines > 300) {
  action = 'Split by domain ([domain-1].ts, [domain-2].ts, etc.)'
}
else if (file.type === 'mutation' && file.lines > 300) {
  action = 'Split by action (create.ts, update.ts, delete.ts)'
}
else if (file.type === 'hook' && file.lines > 150) {
  action = 'Split into multiple focused hooks'
}
```

---

## Naming Conventions

### File Naming Rules

#### ✅ ALWAYS Use Kebab-Case

```
✅ user-profile.tsx
✅ salon-dashboard.tsx
✅ booking-form.tsx
✅ appointment-analytics.ts
✅ customer-preferences.ts

❌ userProfile.tsx         (camelCase - WRONG)
❌ UserProfile.tsx         (PascalCase - WRONG)
❌ user_profile.tsx        (snake_case - WRONG)
❌ user.profile.tsx        (dots - WRONG, except special files)
```

#### Exceptions - Next.js Special Files

```
✅ page.tsx                // Next.js page
✅ layout.tsx              // Next.js layout
✅ loading.tsx             // Next.js loading
✅ error.tsx               // Next.js error
✅ not-found.tsx           // Next.js 404
✅ route.ts                // Next.js API route
✅ template.tsx            // Next.js template
✅ default.tsx             // Next.js default

✅ proxy.ts                // Next.js proxy (root, replaces middleware.ts)
✅ instrumentation.ts      // Next.js instrumentation (root)
```

#### Exceptions - Special Patterns

```
✅ [entity].test.ts        // Test files
✅ [entity].spec.ts        // Spec files
✅ database.types.ts       // Auto-generated types (NEVER EDIT)
✅ env.config.ts           // Config files
```

### Directory Naming Rules

#### ✅ ALWAYS Use Kebab-Case

```
✅ api/queries/
✅ api/mutations/
✅ customer-analytics/
✅ salon-insights/
✅ booking-rules/

❌ customerAnalytics/      (camelCase - WRONG)
❌ customer_analytics/     (snake_case - WRONG)
❌ query/                  (singular - use queries/)
❌ mutation/               (singular - use mutations/)
```

#### Next.js Route Group Exception

```
✅ app/([portal])/         // Route group (uses parentheses)
✅ app/(auth)/             // Route group
✅ app/(marketing)/        // Route group

❌ app/[portal]/           // Dynamic segment (wrong for grouping)
❌ app/portal/             // Regular folder (affects URL)
```

### Function Naming Rules

#### ✅ camelCase

```typescript
✅ getSalonDashboard()
✅ fetchAppointmentsByDate()
✅ createBooking()
✅ updateSalonSettings()
✅ deleteCoupon()

❌ GetSalonDashboard()     (PascalCase - WRONG)
❌ get_salon_dashboard()   (snake_case - WRONG)
❌ get-salon-dashboard()   (kebab-case - WRONG)
```

### Component Naming Rules

#### ✅ File: kebab-case, Export: PascalCase

```typescript
// ✅ CORRECT - salon-card.tsx
export function SalonCard() { ... }

// ✅ CORRECT - booking-form.tsx
export function BookingForm() { ... }

// ❌ WRONG - SalonCard.tsx
export function SalonCard() { ... }  // File should be kebab-case

// ❌ WRONG - salon-card.tsx
export function salonCard() { ... }  // Export should be PascalCase
```

### API File Naming

#### In Organized Directories (api/queries/, api/mutations/)

```
✅ CORRECT - No suffix, domain-based naming
api/
├── queries/
│   ├── index.ts
│   ├── dashboard.ts       # ✅ Domain name
│   ├── analytics.ts       # ✅ Domain name
│   └── metrics.ts         # ✅ Domain name
└── mutations/
    ├── index.ts
    ├── create.ts          # ✅ Action name
    ├── update.ts          # ✅ Action name
    └── delete.ts          # ✅ Action name

❌ WRONG - Suffixes in organized directories
api/
├── queries/
│   ├── dashboard-queries.ts  # ❌ Redundant suffix
│   └── analytics.queries.ts  # ❌ Redundant suffix
└── mutations/
    └── create.mutations.ts   # ❌ Redundant suffix
```

#### In Flat Structure (Small Features Only)

```
✅ CORRECT - Plural at root
api/
├── queries.ts             # ✅ Plural
└── mutations.ts           # ✅ Plural

❌ WRONG
api/
├── query.ts               # ❌ Singular
└── mutation.ts            # ❌ Singular
```

---

## Feature Structure Patterns

### Pattern Selection Logic

```
Step 1: Count files needed for the feature
Step 2: Determine portal/module (admin, business, customer, staff, marketing, shared)
Step 3: Choose pattern:
  - < 5 files → Pattern 1: Small Feature (flat api/)
  - 5-15 files → Pattern 2: Medium Feature (organized api/)
  - > 15 files → Pattern 3: Large Feature (nested api/)
  - > 30 files → STOP: Split into multiple features
```

### Pattern 1: Small Feature (< 5 files)

**When to use:**
- Feature has less than 5 total files
- Single query file < 300 lines
- Single mutation file < 300 lines
- Single component or simple UI

**Structure:**
```
features/[portal]/[feature]/
├── api/
│   ├── queries.ts                      # All queries (< 300 lines)
│   ├── mutations.ts                    # All mutations (< 300 lines)
│   └── schema.ts                       # Validation schemas (< 250 lines)
├── components/
│   └── [component].tsx                 # Component (< 200 lines)
└── index.tsx                           # Export (< 50 lines)
```

**Split trigger:** When any file exceeds 300 lines → Move to Pattern 2

### Pattern 2: Medium Feature (5-15 files)

**When to use:**
- Feature has 5-15 files
- Multiple query domains or mutation actions
- Multiple components
- Needs organized directories

**Structure:**
```
features/[portal]/[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   ├── [domain].ts                 # Domain queries (< 300 lines)
│   │   └── helpers.ts                  # Query helpers (< 200 lines)
│   ├── mutations/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   ├── [action].ts                 # Action mutations (< 300 lines)
│   │   └── helpers.ts                  # Mutation helpers (< 200 lines)
│   ├── types.ts                        # API types (< 200 lines)
│   ├── schema.ts                       # Validation schemas (< 250 lines)
│   └── constants.ts                    # Constants (< 100 lines)
├── components/
│   ├── index.ts                        # Re-exports ALL (< 50 lines)
│   ├── [feature]-table.tsx             # Components (< 200 lines)
│   ├── [feature]-form.tsx              # Components (< 200 lines)
│   └── [feature]-view.tsx              # Components (< 200 lines)
├── hooks/
│   └── use-[hook].ts                   # Hooks (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```


**Split trigger:** When feature exceeds 15 files → Move to Pattern 3

### Pattern 3: Large Feature (> 15 files)

**When to use:**
- Feature has more than 15 files
- Multiple query/mutation domains
- Complex component hierarchy
- Needs nested organization

**Structure:**
```
features/[portal]/[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   ├── [domain-1]/
│   │   │   ├── index.ts                # Domain exports (< 50 lines)
│   │   │   ├── [specific].ts           # Specific queries (< 250 lines)
│   │   │   └── helpers.ts              # Domain helpers (< 200 lines)
│   │   └── [domain-2]/
│   │       └── (similar structure)
│   ├── mutations/
│   │   ├── index.ts
│   │   ├── [action-group]/
│   │   │   ├── index.ts
│   │   │   └── [specific].ts           # Specific mutations (< 250 lines)
│   │   └── shared.ts                   # Shared helpers (< 200 lines)
│   ├── types.ts                        # Shared types (< 200 lines)
│   ├── schema.ts                       # Shared schemas (< 250 lines)
│   └── constants.ts                    # Constants (< 100 lines)
├── components/
│   ├── index.ts                        # Re-exports ALL (< 50 lines)
│   ├── [section-1]/
│   │   ├── index.ts                    # Section exports (< 50 lines)
│   │   └── [component].tsx             # Components (< 200 lines)
│   └── [section-2]/
│       └── (similar structure)
├── hooks/
│   └── use-[hook].ts                   # Hooks (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**Real Example:**
```
features/business/insights/
├── api/
│   ├── queries/
│   │   ├── index.ts
│   │   ├── customer-analytics/
│   │   │   ├── index.ts
│   │   │   ├── retention.ts
│   │   │   ├── cohorts.ts
│   │   │   └── helpers.ts
│   │   ├── trends/
│   │   │   ├── index.ts
│   │   │   ├── revenue.ts
│   │   │   └── bookings.ts
│   │   └── transformers.ts
│   ├── mutations/
│   │   └── (similar nested structure)
│   ├── types.ts
│   └── schema.ts
├── components/
│   ├── index.ts
│   ├── charts/
│   │   ├── revenue-chart.tsx
│   │   └── retention-chart.tsx
│   ├── tables/
│   │   └── cohort-table.tsx
│   └── insights-dashboard.tsx
└── index.tsx
```

**Split trigger:** When feature exceeds 30 files → Split into multiple features

### Pattern 4: Marketing/Content Features

**When to use:**
- Marketing/landing pages
- Content-heavy pages
- Section-based structure

**Structure:**
```
features/marketing/[page]/
├── sections/
│   └── [section-name]/
│       ├── [section-name].tsx          # Section component (< 150 lines)
│       ├── [section-name].data.ts      # Section content (< 200 lines)
│       ├── [section-name].types.ts     # Section types (< 100 lines)
│       └── index.ts                    # Export (< 20 lines)
├── [page]-page.tsx                     # Main page (< 100 lines)
├── [page].seo.ts                       # SEO metadata (< 50 lines)
├── [page].types.ts                     # Page types (< 150 lines)
└── index.ts                            # Export (< 30 lines)
```


### Pattern 5: Auth Features

**When to use:**
- Authentication pages (login, signup, reset password)
- Form-heavy features
- Validation-focused features

**Structure:**
```
features/auth/[page]/
├── api/
│   ├── mutations/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [action].ts                 # Action mutation (< 300 lines)
│   └── schema.ts                       # Page schemas (< 250 lines)
├── components/
│   ├── [page]-form.tsx                 # Main form (< 200 lines)
│   └── [page]-feature.tsx              # Feature wrapper (< 200 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**Real Example:**
```
features/auth/forgot-password/
├── api/
│   ├── mutations/
│   │   ├── index.ts
│   │   └── reset-password.ts
│   └── schema.ts
├── components/
│   ├── forgot-password-form.tsx
│   └── forgot-password-feature.tsx
└── index.tsx
```

### Pattern 6: Shared Features

**When to use:**
- Features used by ALL modules/portals
- Cross-cutting concerns (notifications, messaging, profiles)
- Generic utilities shared across modules

**CRITICAL:** Only put features here if used by MULTIPLE modules. Module-specific code stays in module folder.

**Structure:**
```
features/shared/[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [query].ts                  # Query functions (< 300 lines)
│   ├── mutations/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [action].ts                 # Mutation functions (< 300 lines)
│   └── types.ts                        # Shared types (< 200 lines)
├── components/
│   ├── index.ts                        # Re-exports (< 50 lines)
│   └── [component].tsx                 # Shared component (< 200 lines)
├── hooks/
│   └── use-[hook].ts                   # Shared hooks (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**✅ BELONGS in shared:**
```
✅ features/shared/notifications/    # Used by all modules
✅ features/shared/messaging/        # Used by all modules
✅ features/shared/profile/          # Used by all modules
✅ features/shared/appointments/     # Used by multiple modules
```

**❌ DOES NOT BELONG in shared:**
```
❌ features/shared/admin-only/       # Admin-specific → features/admin/
❌ features/shared/business-portal/  # Business-specific → features/business/
```

---

## Index File Re-Export Pattern

### ✅ CRITICAL RULE: Always Use Index Files

**Every directory with components, queries, or mutations MUST have an index.ts that re-exports everything.**

### Component Index Pattern

```typescript
// ✅ CORRECT - components/index.ts
export { SalonCard } from './salon-card'
export { BookingForm } from './booking-form'
export { AppointmentTable } from './appointment-table'
export { ReviewStats } from './review-stats'
// ... ALL components must be listed

// ✅ CORRECT - feature/index.tsx
import { SalonCard, BookingForm } from './components'
export { SalonCard, BookingForm } from './components'

// ❌ WRONG - Missing components in index
export { SalonCard } from './salon-card'
// Missing: BookingForm, AppointmentTable, etc.

// ❌ WRONG - Bypassing index
import { SalonCard } from './components/salon-card'
```

### Query Index Pattern

```typescript
// ✅ CORRECT - api/queries/index.ts
export { getSalonDashboard, getSalonMetrics } from './dashboard'
export { getSalonList, getSalonById } from './list'
export { getSalonAnalytics, getRevenueBreakdown } from './analytics'
// ... ALL queries must be listed

// ✅ CORRECT - Using queries in feature
import { getSalonDashboard, getSalonList } from './api/queries'

// ❌ WRONG - Bypassing index
import { getSalonDashboard } from './api/queries/dashboard'
```

### Mutation Index Pattern

```typescript
// ✅ CORRECT - api/mutations/index.ts
export { createSalon } from './create'
export { updateSalon, updateSalonStatus } from './update'
export { deleteSalon } from './delete'
// ... ALL mutations must be listed

// ✅ CORRECT - Using mutations
import { createSalon, updateSalonStatus } from './api/mutations'

// ❌ WRONG - Bypassing index
import { createSalon } from './api/mutations/create'
```

### Nested Directory Index Pattern

```typescript
// ✅ CORRECT - api/queries/customer-analytics/index.ts (nested directory)
export { getRetentionMetrics } from './retention'
export { getCohortAnalysis } from './cohorts'
export { getCustomerTrends } from './trends'

// ✅ CORRECT - api/queries/index.ts (parent index)
export * from './customer-analytics'
export * from './revenue-analytics'
export * from './booking-analytics'

// ✅ CORRECT - Using nested exports
import { getRetentionMetrics, getCohortAnalysis } from './api/queries'
```

---

## lib/ Organization

### Decision Tree: lib/ vs features/

```
Is this code infrastructure or business logic?
├─ Infrastructure (auth, cache, validation, db client) → lib/
└─ Business logic (domain-specific features) → features/

Is this code used by multiple features?
├─ YES → Is it technical infrastructure?
│   ├─ YES → lib/
│   └─ NO → Is it used by all modules?
│       ├─ YES → features/shared/
│       └─ NO → Keep in specific module
└─ NO → features/[portal]/[feature]/
```

### lib/ Structure

```
lib/
├── auth/                          # Authentication utilities (Supabase Auth)
│   ├── guards.ts                  # Auth guards (< 200 lines, 'server-only')
│   ├── session.ts                 # Session management (< 200 lines)
│   ├── permissions/
│   │   ├── index.ts               # Re-exports (< 50 lines)
│   │   ├── roles.ts               # Role definitions (< 150 lines)
│   │   └── checks.ts              # Permission checks (< 200 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
│
├── db/                            # Database clients (Supabase)
│   ├── server.ts                  # Server client (< 100 lines, 'use server')
│   ├── client.ts                  # Browser client (< 50 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
│
├── config/                        # Configuration
│   ├── env.ts                     # Environment validation (< 150 lines)
│   ├── constants.ts               # App constants (< 200 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
│
├── constants/                     # Application constants
│   ├── app.ts                     # App metadata (< 100 lines)
│   ├── routes.ts                  # Route constants (< 150 lines)
│   ├── statuses.ts                # Status enums (< 100 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
│
├── types/
│   ├── database.types.ts          # ❌ NEVER EDIT - Auto-generated by Supabase
│   ├── common.ts                  # Common types (< 150 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
│
├── cache/                         # Query caching
│   ├── query-cache/
│   │   ├── with-cache.ts          # Cache wrapper (< 200 lines)
│   │   ├── configs.ts             # Cache configs (< 150 lines)
│   │   └── index.ts               # Re-exports (< 50 lines)
│   ├── query-keys.ts              # Cache key factory (< 200 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
│
├── middleware/                    # Middleware utilities
│   ├── rate-limit/
│   │   ├── check-rate-limit.ts    # Core logic (< 200 lines)
│   │   └── index.ts               # Re-exports (< 50 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
│
├── utils/                         # Utility functions
│   ├── validation.ts              # Validation helpers (< 150 lines)
│   ├── formatting.ts              # Format helpers (< 150 lines)
│   ├── safe-json.ts               # Safe JSON parsing (< 100 lines)
│   ├── safe-form-data.ts          # Safe FormData extraction (< 100 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
│
├── hooks/                         # Shared React hooks
│   ├── use-toast.ts               # Toast hook (< 150 lines)
│   ├── use-mobile.ts              # Mobile detection (< 100 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
│
└── validations/                   # Shared validation schemas (Zod ONLY)
    ├── common.ts                  # Common schemas (< 200 lines)
    └── index.ts                   # Re-exports (< 50 lines)
```

### lib/ Server Directives

```typescript
// ✅ 'server-only' - For server-side utilities
// lib/auth/guards.ts
import 'server-only'
import { createClient } from '@/lib/db/server'

export async function requireAuth() {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return { user, db }
}

// ✅ 'use server' - For server actions
// lib/db/server.ts
'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

// ✅ No directive - For browser code
// lib/db/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### lib/ Rules

1. **✅ Infrastructure only** - No feature-specific business logic
2. **✅ Always use index.ts** - Every subdirectory must have one
3. **✅ Respect file limits** - Split files exceeding limits
4. **✅ Use server directives** - Add 'server-only' or 'use server' appropriately
5. **❌ NEVER edit auto-generated files** - database.types.ts is managed by Supabase
6. **✅ Kebab-case** - All files and folders
7. **✅ Import from index** - Never bypass index.ts files
8. **✅ Type-safe** - Use TypeScript strict mode

---

## Advanced Routing Patterns

### Pattern 7: Parallel Routes (Multi-Panel Dashboards)

**When to use:**
- Dashboards with independent navigation sections (analytics + team view)
- Social feeds with sidebars that navigate separately
- Multi-tenant apps where different slots show different user contexts
- Any UI requiring simultaneous rendering of multiple independent pages

**CRITICAL Rules:**
1. **All slots MUST have `default.tsx`** - Prevents 404 on hard navigation
2. **Static/Dynamic constraint** - If one slot is dynamic, ALL slots at that level must be dynamic
3. **Slots don't affect URL** - `@analytics` folder doesn't appear in browser URL
4. **Use `useSelectedLayoutSegment('slotName')`** - To read active state per slot

**Structure:**
```
app/dashboard/
├── layout.tsx                      # Receives slots as props
├── page.tsx                        # Main dashboard
├── default.tsx                     # Fallback for children slot (recommended)
├── @analytics/                     # Slot: analytics panel
│   ├── default.tsx                 # ✅ REQUIRED fallback
│   ├── page.tsx                    # Default analytics view
│   ├── revenue/
│   │   └── page.tsx                # /dashboard/revenue (analytics slot shows this)
│   └── performance/
│       └── page.tsx                # /dashboard/performance
└── @team/                          # Slot: team panel
    ├── default.tsx                 # ✅ REQUIRED fallback
    ├── page.tsx                    # Default team view
    └── members/
        └── page.tsx                # /dashboard/members (team slot shows this)
```

**Layout Implementation:**
```typescript
// ✅ CORRECT - app/dashboard/layout.tsx
export default function DashboardLayout({
  children,      // Implicit children slot
  analytics,     // @analytics slot
  team,          // @team slot
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">{children}</div>
      <div className="space-y-4">
        <div>{analytics}</div>
        <div>{team}</div>
      </div>
    </div>
  )
}
```

**Default Fallback (CRITICAL):**
```typescript
// ✅ CORRECT - app/dashboard/@analytics/default.tsx
// Prevents 404 when hard-navigating to unmatched routes
export default function AnalyticsDefault() {
  return null  // or a default UI
}

// ❌ WRONG - Missing default.tsx
// Hard navigation to /dashboard/some-route will show 404 if @analytics doesn't have some-route/page.tsx
```

**Navigation Behavior:**
```typescript
// Soft navigation (client-side): Maintains slot states
<Link href="/dashboard/revenue">Revenue</Link>  // Only @analytics updates

// Hard navigation (full reload): Uses default.tsx for unmatched slots
// User visits /dashboard/revenue directly → @team shows default.tsx content
```

**Use Case - Admin Dashboard:**
```
app/(admin)/dashboard/
├── layout.tsx           # Multi-panel layout
├── page.tsx             # Overview
├── @metrics/
│   ├── default.tsx
│   ├── page.tsx         # Default metrics
│   └── realtime/page.tsx
├── @alerts/
│   ├── default.tsx
│   ├── page.tsx
│   └── critical/page.tsx
└── @activity/
    ├── default.tsx
    └── page.tsx
```

**Performance Notes:**
- Each slot can have **independent loading.tsx** - streams separately
- Each slot can have **independent error.tsx** - isolates failures
- Enables **progressive rendering** - show analytics while team data loads

**Common Pitfalls:**
1. **Forgetting default.tsx** → 404 on hard navigation
2. **Mixing static/dynamic** → Build errors if slots have different rendering modes
3. **Over-nesting slots** → Max 2-3 slots per layout for maintainability
4. **Not using `useSelectedLayoutSegment`** → Can't track slot state in client components

### Pattern 8: Intercepting Routes (Modals with URLs)

**When to use:**
- Photo galleries with shareable URLs (Instagram-style)
- Login/signup modals that work as full pages too
- Product quick-view modals with deep linking
- Any modal that should persist on refresh (as full page)

**Syntax Convention:**
```
(.)   = intercept same level
(..)  = intercept one level up
(..)(..) = intercept two levels up
(...) = intercept from root app/
```

**CRITICAL:** Convention based on **route segments**, NOT file system. Ignores `@slot` folders.

**Structure - Photo Gallery:**
```
app/
├── photos/
│   ├── page.tsx                    # Photo grid
│   └── [id]/
│       └── page.tsx                # Full-page photo view (hard navigation)
└── @modal/
    ├── default.tsx                 # ✅ REQUIRED for parallel route
    └── (.)photos/
        └── [id]/
            └── page.tsx            # Modal photo view (soft navigation)
```

**Layout with Modal Slot:**
```typescript
// ✅ CORRECT - app/layout.tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        {modal}  {/* Renders intercepted routes as modals */}
      </body>
    </html>
  )
}
```

**Modal Component Pattern:**
```typescript
// ✅ CORRECT - app/@modal/(.)photos/[id]/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { Dialog } from '@/components/ui/dialog'

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id } = await params

  return (
    <Dialog open onOpenChange={() => router.back()}>
      {/* Photo content - can share same component as full page */}
      <PhotoView id={id} />
    </Dialog>
  )
}

// Full page version - app/photos/[id]/page.tsx
export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PhotoView id={id} />  // Same component, different layout
}
```

**Behavior:**
- **Soft navigation (Link click)** → Shows modal overlay
- **Hard navigation (direct URL/refresh)** → Shows full page
- **router.back()** → Closes modal, returns to gallery
- **Shareable URL** → `/photos/123` works in both contexts

**Use Case - Auth Modals:**
```
app/
├── layout.tsx
├── page.tsx
├── login/
│   └── page.tsx                    # Full login page
└── @auth/
    ├── default.tsx
    └── (..)login/
        └── page.tsx                # Login modal (intercepts /login)
```

**Common Intercepting Patterns:**

| Pattern | Syntax | Example |
|---------|--------|---------|
| Same level | `(.)folder` | `app/photos/(.)detail/page.tsx` |
| Parent level | `(..)folder` | `app/products/category/(..)detail/page.tsx` |
| Root level | `(...)folder` | `app/dashboard/@modal/(...)product/[id]/page.tsx` |

**Performance Benefits:**
- **Preserves scroll position** - Modal overlay doesn't lose page state
- **Faster perceived navigation** - No full page reload on soft navigation
- **Prefetching works** - Next.js prefetches both modal and full page
- **SEO friendly** - Full page version crawlable by search engines

**Common Pitfalls:**
1. **Missing full page route** → Direct URL access fails
2. **Missing default.tsx** → Parallel route errors
3. **Wrong interception level** → Modal doesn't trigger
4. **Not using router.back()** → Modal doesn't close properly

### Pattern 9: Route Groups - Advanced Organization

**When to use:**
- Multiple root layouts (marketing vs app)
- Feature-based organization (keep routes grouped logically)
- Selective layout sharing (some routes share layout, others don't)

**CRITICAL Rules:**
1. **Route groups DON'T affect URLs** - `(marketing)/about` → `/about`
2. **Can't create URL conflicts** - `(shop)/about` + `(marketing)/about` = ERROR
3. **Multiple root layouts trigger full page reload** - Navigation between different layout.tsx files
4. **Homepage must be in a route group** - If using multiple root layouts

**Structure - Multi-Tenant with Multiple Root Layouts:**
```
app/
├── (marketing)/               # Marketing site
│   ├── layout.tsx             # Root layout #1 (marketing header/footer)
│   ├── page.tsx               # Homepage (REQUIRED when multiple root layouts)
│   ├── about/
│   │   └── page.tsx           # /about (marketing layout)
│   └── pricing/
│       └── page.tsx           # /pricing (marketing layout)
├── (app)/                     # Application
│   ├── layout.tsx             # Root layout #2 (app shell)
│   ├── dashboard/
│   │   └── page.tsx           # /dashboard (app layout)
│   └── settings/
│       └── page.tsx           # /settings (app layout)
└── (auth)/                    # Auth pages (shared layout optional)
    ├── layout.tsx             # Auth-specific layout (optional)
    ├── login/
    │   └── page.tsx           # /login
    └── signup/
        └── page.tsx           # /signup
```

**Multiple Root Layouts Pattern:**
```typescript
// ✅ CORRECT - app/(marketing)/layout.tsx (Root Layout 1)
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MarketingHeader />
        {children}
        <MarketingFooter />
      </body>
    </html>
  )
}

// ✅ CORRECT - app/(app)/layout.tsx (Root Layout 2)
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}

// ⚠️ PERFORMANCE WARNING
// Navigating /about → /dashboard triggers FULL PAGE RELOAD
// Different root layouts can't share state
```

**Selective Layout Sharing:**
```
app/
├── layout.tsx                 # Global root layout
├── (shop)/                    # Shop routes share layout
│   ├── layout.tsx             # Shop-specific layout
│   ├── products/
│   │   └── page.tsx           # /products (has shop layout)
│   └── cart/
│       └── page.tsx           # /cart (has shop layout)
└── checkout/                  # Checkout DOESN'T share shop layout
    └── page.tsx               # /checkout (only global layout)
```

**Feature-Based Organization (Current Codebase Pattern):**
```
app/
├── (admin)/
│   └── admin/                 # /admin routes
├── (business)/
│   └── business/              # /business routes
├── (customer)/
│   └── customer/              # /customer routes
├── (staff)/
│   └── staff/                 # /staff routes
└── (marketing)/
    ├── page.tsx               # / (home)
    ├── about/                 # /about
    └── pricing/               # /pricing
```

**Path Conflict Prevention:**
```typescript
// ❌ WRONG - URL conflict
app/(marketing)/about/page.tsx  → /about
app/(shop)/about/page.tsx       → /about (CONFLICT - build error)

// ✅ CORRECT - Different URLs
app/(marketing)/about/page.tsx  → /about
app/(shop)/about-us/page.tsx    → /about-us
```

**Performance Implications:**
- **Same root layout** → Client-side navigation (fast)
- **Different root layouts** → Full page reload (slower, loses state)
- **Route groups add 0 bytes to bundle** → Pure organizational tool

**Common Pitfalls:**
1. **Forgetting homepage in route group** → Build error with multiple root layouts
2. **Creating URL conflicts** → Build fails
3. **Over-nesting route groups** → `(group1)/(group2)/(group3)` reduces clarity
4. **Not documenting intent** → Team members confused about organization

---

## Performance Optimization Patterns

### Pattern 10: Static vs Dynamic Route Configuration

**Automatic Detection:**
Next.js automatically determines rendering strategy based on usage:

**Forces Dynamic Rendering:**
- Using `cookies()`, `headers()`, or `searchParams`
- Uncached `fetch()` requests
- Route Handlers without explicit caching

**Allows Static Rendering:**
- No dynamic APIs used
- All fetch requests cached
- Using `generateStaticParams()`

**Manual Override with Route Segment Config:**
```typescript
// ✅ CORRECT - Force dynamic (admin dashboard)
// app/(admin)/admin/page.tsx
export const dynamic = 'force-dynamic'  // Always server-render per request
export const revalidate = 0              // Never cache

export default function AdminDashboard() {
  // Can safely use cookies(), headers() without warnings
  return <DashboardFeature />
}

// ✅ CORRECT - Force static (marketing page)
// app/(marketing)/pricing/page.tsx
export const dynamic = 'force-static'   // Pre-render at build time
export const revalidate = 3600          // Revalidate every hour

export default function PricingPage() {
  return <PricingFeature />
}

// ✅ CORRECT - Error on dynamic usage (enforce static)
export const dynamic = 'error'          // Throws error if dynamic APIs used
```

**Route Segment Config Options:**

| Option | Values | Use Case |
|--------|--------|----------|
| `dynamic` | `'auto'` (default) | Let Next.js decide |
| | `'force-dynamic'` | Always render per-request (admin, dashboards) |
| | `'force-static'` | Always pre-render (marketing, docs) |
| | `'error'` | Throw error if dynamic APIs used (enforce static) |
| `revalidate` | `false` (default) | Cache indefinitely |
| | `0` | Always dynamic |
| | `number` | Revalidate every N seconds (ISR) |
| `fetchCache` | `'auto'` | Default fetch behavior |
| | `'force-cache'` | Cache all fetches |
| | `'force-no-store'` | Never cache fetches |
| `runtime` | `'nodejs'` (default) | Standard Node.js runtime |
| | `'edge'` | Edge runtime (faster cold starts) |
| `maxDuration` | `number` | Max execution time (seconds) |

**Real-World Patterns:**

```typescript
// Pattern A: Admin Dashboard (Always Fresh)
export const dynamic = 'force-dynamic'
export const revalidate = 0
// Use: Real-time data, user-specific content

// Pattern B: Marketing Landing Page (Static + Revalidation)
export const dynamic = 'force-static'
export const revalidate = 3600  // 1 hour
// Use: SEO pages, infrequent updates

// Pattern C: Product Catalog (ISR)
export const revalidate = 300  // 5 minutes
// Use: Frequently updated, but can tolerate stale data

// Pattern D: API Route Handler with Caching (Next.js 15+)
// app/api/salons/suggestions/route.ts
export const dynamic = 'force-static'  // Opt-in to caching
export async function GET(request: NextRequest) {
  // In Next.js 15+, GET/HEAD don't cache by default
  // Must explicitly set dynamic = 'force-static' or add Cache-Control headers
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
```

**Detection Commands:**
```bash
# Find pages without explicit dynamic config (may need review)
rg -L "export const dynamic" app --glob "**/page.tsx"

# Find Route Handlers without caching strategy (Next.js 15+)
rg "export async function GET" app/api --glob "route.ts" -A 5 | rg -L "dynamic|Cache-Control"

# Find pages using dynamic APIs without force-dynamic
rg "cookies\(\)|headers\(\)|searchParams" app --glob "page.tsx" -B 10 | rg -L "force-dynamic"
```

### Pattern 11: Bundle Optimization Strategies

**File Size Impact on Performance:**

| File Type | Size Limit | Performance Impact |
|-----------|-----------|-------------------|
| Page components | 15 lines | Minimal bundle, fast hydration |
| Feature components | 200 lines | Moderate bundle per route |
| Queries/mutations | 300 lines | Server-only, no bundle impact |
| Client components | 200 lines | Direct bundle impact |

**Optimization Techniques:**

**1. Server Component First (Default):**
```typescript
// ✅ CORRECT - Server Component (no 'use client')
// Zero JavaScript sent to browser
export default function StatsCard({ stats }: { stats: Stats }) {
  return (
    <Card>
      <CardHeader>Analytics</CardHeader>
      <CardContent>{stats.total}</CardContent>
    </Card>
  )
}
```

**2. Leaf Client Components (Minimal Bundle):**
```typescript
// ✅ CORRECT - Only interactive parts are client components
// app/dashboard/page.tsx (Server Component)
import { AnalyticsChartClient } from './components/analytics-chart-client'

export default async function DashboardPage() {
  const data = await getAnalytics()  // Server-side data fetch

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Static content - server rendered */}
      <StatsGrid data={data} />

      {/* Interactive chart - client component */}
      <AnalyticsChartClient initialData={data} />
    </div>
  )
}

// components/analytics-chart-client.tsx
'use client'  // ← Client boundary as low as possible
import { useState } from 'react'

export function AnalyticsChartClient({ initialData }: { initialData: Data }) {
  const [filter, setFilter] = useState('all')
  // Client-side interactivity here
  return <Chart data={initialData} filter={filter} />
}

// ❌ WRONG - Entire page is client component
'use client'
export default function DashboardPage() {
  const [filter, setFilter] = useState('all')
  // Sends ALL components to browser, even static ones
  return <div>...</div>
}
```

**3. Dynamic Imports (Code Splitting):**
```typescript
// ✅ CORRECT - Lazy load heavy components
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,  // Don't render on server (client-only)
})

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader />
      <HeavyChart />  {/* Loaded only when needed */}
    </div>
  )
}
```

**4. Middleware Bundle Optimization:**
```typescript
// ✅ CORRECT - Minimal proxy (runs on edge)
// proxy.ts (middleware.ts removed in Next.js 16)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// IMPORTANT: Must be named 'proxy' not 'middleware' in Next.js 16
export function proxy(request: NextRequest) {
  // Keep logic minimal - runs on every request
  const authCookie = request.cookies.get('auth-token')
  if (!authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

// ❌ WRONG - Heavy imports in middleware
import { someHeavyLibrary } from 'heavy-lib'  // Increases edge bundle size
```

**Detection Commands:**
```bash
# Find client components (potential bundle bloat)
rg "^'use client'" features components --glob "*.tsx" -c | sort -rn

# Find large client components (review for splitting)
find features components -name "*.tsx" -exec sh -c 'lines=$(wc -l < "$1"); if [ $lines -gt 150 ] && grep -q "use client" "$1"; then echo "$lines $1"; fi' _ {} \; | sort -rn

# Find dynamic imports (code splitting in use)
rg "dynamic\(.*import" features --glob "*.tsx"

# Check for heavy dependencies in client components
rg "import.*from 'moment'|import.*from 'lodash'" features --glob "*.tsx" | rg "use client" -B 3
```

### Pattern 12: Caching Strategy Architecture

**Multi-Layer Caching Approach:**

**Layer 1: Route Segment Config**
```typescript
// Page-level caching
export const revalidate = 300  // 5 minutes
```

**Layer 2: Fetch-Level Caching**
```typescript
// ✅ CORRECT - Per-request cache control
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 },  // Cache for 60 seconds
})

// ✅ CORRECT - Tag-based revalidation
const data = await fetch('https://api.example.com/salons', {
  next: { tags: ['salons'] },
})
// Later: revalidateTag('salons') to invalidate
```

**Layer 3: Response Headers (API Routes)**
```typescript
// ✅ CORRECT - app/api/salons/suggestions/route.ts (from codebase)
export async function GET(request: NextRequest) {
  const suggestions = await getSalonSearchSuggestions(query)

  return NextResponse.json(suggestions, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150',
    },
  })
}
```

**Cache Strategy Decision Tree:**
```
What's the data update frequency?
│
├─ Never/Rarely (docs, legal pages)
│  └─ export const dynamic = 'force-static'
│
├─ Hourly/Daily (blog posts, product catalog)
│  └─ export const revalidate = 3600
│
├─ Minutes (metrics, analytics)
│  └─ export const revalidate = 300
│
├─ Real-time (admin dashboards, user-specific)
│  └─ export const dynamic = 'force-dynamic'
│
└─ On-demand (CMS updates, admin actions)
   └─ Use revalidateTag() or revalidatePath()
```

**Real-World Caching Examples:**

```typescript
// Marketing page (static, rarely changes)
export const dynamic = 'force-static'
export const revalidate = false  // Cache forever

// Product listing (ISR, updates every 5 min)
export const revalidate = 300

// Admin dashboard (always fresh)
export const dynamic = 'force-dynamic'
export const revalidate = 0

// API route with stale-while-revalidate
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  },
})
```

---

## Edge Cases and Pitfalls

### Edge Case 1: Deep Dynamic Route Nesting

**Problem:** Routes like `/salon/[salonId]/staff/[staffId]/service/[serviceId]` create performance issues

**Impact:**
- Increased bundle size (more page components)
- Complex generateStaticParams()
- Harder to cache effectively

**Solution:**
```typescript
// ❌ PROBLEMATIC - Too deep
app/salon/[salonId]/staff/[staffId]/service/[serviceId]/page.tsx

// ✅ BETTER - Flatten with query params
app/salon/[salonId]/service/page.tsx  // ?staffId=123&serviceId=456

// ✅ ALTERNATIVE - Use parallel routes
app/salon/[salonId]/
├── @staff/
│   └── [staffId]/page.tsx
└── @services/
    └── [serviceId]/page.tsx
```

**Detection:**
```bash
# Find deeply nested dynamic routes (> 3 levels)
find app -type f -name "page.tsx" | grep -E "\[.*\]/.*\[.*\]/.*\[.*\]/"
```

### Edge Case 2: Route Priority Conflicts

**Problem:** Next.js route matching priority can cause unexpected behavior

**Priority Order (Highest to Lowest):**
1. Predefined routes (`/about/page.tsx`)
2. Dynamic routes (`/[slug]/page.tsx`)
3. Catch-all routes (`/[...slug]/page.tsx`)
4. Optional catch-all (`/[[...slug]]/page.tsx`)

**Conflict Example:**
```typescript
// ❌ PROBLEMATIC
app/products/[category]/page.tsx     // /products/electronics
app/products/new/page.tsx            // /products/new

// Which wins? 'new' is predefined, so it takes priority
// But if added later, might break existing [category] routes
```

**Solution - Explicit Precedence:**
```typescript
// ✅ CORRECT - Put specific routes outside dynamic
app/products/
├── new/
│   └── page.tsx              # /products/new (predefined wins)
├── featured/
│   └── page.tsx              # /products/featured (predefined wins)
└── [category]/
    └── page.tsx              # /products/* (catch remaining)
```

**Detection:**
```bash
# Find potential route conflicts
find app -name "page.tsx" -o -name "[*" | awk -F/ '{print $(NF-1)}' | sort | uniq -c | awk '$1 > 1 {print "Potential conflict:", $2}'
```

### Edge Case 3: Layout Remounting on Navigation

**Problem:** Navigating between different root layouts causes full page reload and state loss

**Impact:**
- Lost client state
- Remounts all components
- Triggers all effects again
- Poor UX

**Detection:**
```typescript
// Check if you have multiple root layouts
app/(marketing)/layout.tsx  // <html><body>...</body></html>
app/(app)/layout.tsx        // <html><body>...</body></html>

// Navigation between these = FULL RELOAD
```

**Solution:**
```typescript
// ✅ BETTER - Single root layout, conditional UI
app/layout.tsx  // Single <html><body>

app/(marketing)/layout.tsx  // Marketing wrapper (no html/body)
app/(app)/layout.tsx        // App wrapper (no html/body)
```

### Edge Case 4: Parallel Routes with Missing Slots

**Problem:** Hard navigation shows blank screens when slots don't match

**Example:**
```
app/dashboard/
├── @analytics/
│   ├── page.tsx        # /dashboard ✓
│   └── revenue/page.tsx  # /dashboard/revenue ✓
└── @team/
    └── page.tsx        # /dashboard ✓
                        # /dashboard/revenue ✗ (no team/revenue/page.tsx)
```

**User navigates directly to `/dashboard/revenue`:**
- `@analytics` renders `revenue/page.tsx` ✓
- `@team` has no `revenue/page.tsx` → Shows `default.tsx` or 404

**Solution:**
```typescript
// ✅ REQUIRED - app/dashboard/@team/default.tsx
export default function TeamDefault() {
  return <TeamOverview />  // Sensible fallback
}

// Or mirror routes in both slots
app/dashboard/
├── @analytics/
│   ├── page.tsx
│   └── revenue/page.tsx
└── @team/
    ├── page.tsx
    └── revenue/page.tsx    // ← Add matching route
```

### Edge Case 5: Static/Dynamic Slot Mixing

**Problem:** Can't mix static and dynamic slots at same level

```typescript
// ❌ ERROR
app/dashboard/
├── @analytics/
│   └── page.tsx           # Static export const dynamic = 'force-static'
└── @team/
    └── page.tsx           # Dynamic (uses cookies())

// Build fails: "Cannot have both static and dynamic parallel routes"
```

**Solution:**
```typescript
// ✅ CORRECT - All slots same rendering mode
app/dashboard/
├── layout.tsx
│   export const dynamic = 'force-dynamic'  // Apply to all slots
├── @analytics/
│   └── page.tsx           # Inherits force-dynamic
└── @team/
    └── page.tsx           # Inherits force-dynamic
```

---

## Security Architecture Patterns

### Pattern 13: Security-Focused File Placement

**Principle:** Code placement affects security surface

**Server-Only Code (MUST be in lib/ or feature/api/):**
```typescript
// ✅ CORRECT - lib/auth/guards.ts
import 'server-only'  // ← Prevents accidental client import

export async function requireAdmin() {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  // SECURITY: Check admin role (never expose to client)
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return { user, db }
}

// ❌ WRONG - Shared component file
export function checkAdmin() {
  // If imported in client component, security check runs in browser
  // Attacker can manipulate
}
```

**Client-Safe Code (Can be in components/):**
```typescript
// ✅ CORRECT - components/role-badge.tsx
export function RoleBadge({ role }: { role: string }) {
  // UI-only, no security logic
  return <Badge>{role}</Badge>
}
```

**Security File Placement Rules:**

| Code Type | Location | Directive | Reason |
|-----------|----------|-----------|--------|
| Auth checks | `lib/auth/` | `import 'server-only'` | Prevent client access |
| RLS policies | `features/*/api/queries/` | `import 'server-only'` | Database security |
| API keys | `lib/config/env.ts` | Server-side only | Credential protection |
| Rate limiting | `lib/middleware/` | Server-side | Prevent bypass |
| Validation schemas | `features/*/api/schema.ts` | Shared (Zod runs both) | Input validation |
| Session management | `lib/auth/session.ts` | `'use server'` | Token security |

**Detection Commands:**
```bash
# Find auth checks in client-accessible files
rg "requireAuth|requireAdmin|checkPermission" components features --glob "*.tsx" | rg -v "api/"

# Find 'server-only' missing in auth files
rg -L "server-only" lib/auth --glob "*.ts"

# Find API keys in client components
rg "NEXT_PUBLIC|process\.env" components features --glob "*.tsx" | rg -v "NEXT_PUBLIC"
```

### Pattern 14: RLS vs Server-Side Authorization

**Decision Tree:**
```
Is this a row-level security concern?
│
├─ YES → Implement in Supabase RLS policies
│  └─ Example: Users can only see their own appointments
│
└─ NO → Is it a feature-level check?
   ├─ YES → Implement in lib/auth/ guards
   │  └─ Example: Only admins can access /admin routes
   │
   └─ NO → Is it a business logic check?
      └─ YES → Implement in feature mutations
         └─ Example: Can't book if salon is closed
```

**RLS Policy Pattern:**
```sql
-- ✅ CORRECT - Database level (Supabase RLS)
CREATE POLICY "Users see own appointments"
  ON appointments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Applied automatically to ALL queries
-- Can't be bypassed from application code
```

**Server-Side Guard Pattern:**
```typescript
// ✅ CORRECT - lib/auth/guards.ts
import 'server-only'

export async function requireBusinessOwner(salonId: string) {
  const { user, db } = await requireAuth()

  // SECURITY: Verify ownership
  const { data: salon } = await db
    .from('salons')
    .select('owner_id')
    .eq('id', salonId)
    .single()

  if (salon?.owner_id !== user.id) {
    throw new Error('Not authorized to manage this salon')
  }

  return { user, db, salon }
}
```

**Feature-Level Check Pattern:**
```typescript
// ✅ CORRECT - features/business/settings/api/mutations/update.ts
'use server'
import { requireBusinessOwner } from '@/lib/auth/guards'

export async function updateSalonSettings(salonId: string, data: Settings) {
  // SECURITY: Guard at function entry
  const { db } = await requireBusinessOwner(salonId)

  // Business logic validation
  if (data.maxCapacity < 1) {
    return { success: false, error: 'Invalid capacity' }
  }

  // Perform update (RLS also applies)
  const result = await db
    .from('salons')
    .update(data)
    .eq('id', salonId)

  return { success: true }
}
```

**Layered Security (Defense in Depth):**
```
Request Flow:
1. Middleware (auth check, rate limiting)
   ↓
2. Server Action (requireBusinessOwner guard)
   ↓
3. Database Query (RLS policy enforcement)
   ↓
4. Response (sanitized data)
```

### Pattern 15: Rate Limiting Architecture

**File Placement:**
```
lib/
├── middleware/
│   └── rate-limit/
│       ├── check-rate-limit.ts    # Core logic
│       ├── config.ts               # Rate limit configs
│       └── index.ts
└── config/
    └── constants.ts                # RATE_LIMITS exported here
```

**Rate Limit Pattern (from codebase):**
```typescript
// ✅ CORRECT - app/api/salons/suggestions/route.ts
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return `suggestions:${ip}`
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(key)

  if (!record || now > record.resetTime) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

export async function GET(request: NextRequest) {
  // SECURITY: Apply rate limiting FIRST
  if (!checkRateLimit(getRateLimitKey(request))) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  // ... rest of handler
}
```

**Advanced: Shared Rate Limit Utility:**
```typescript
// lib/middleware/rate-limit/check-rate-limit.ts
import 'server-only'

export function createRateLimiter(windowMs: number, maxRequests: number) {
  const requestCounts = new Map<string, { count: number; resetTime: number }>()

  return (key: string): boolean => {
    const now = Date.now()
    const record = requestCounts.get(key)

    if (!record || now > record.resetTime) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count >= maxRequests) {
      return false
    }

    record.count++
    return true
  }
}

// Usage in route
const checkSuggestionRateLimit = createRateLimiter(60000, 30)  // 30 req/min
```

---

## Detection Commands

```bash
# Check for oversized page files
rg "export default" app --glob "page.tsx" -A 20 | awk '/export default/,/^$/ {print}' | wc -l

# Find files violating kebab-case naming
find features lib -type f \( -name "*[A-Z]*" -o -name "*_*" \) ! -name "*.test.ts" ! -name "database.types.ts"

# Find components bypassing index files
rg "from '\./components\/[^']+" features --glob "*.tsx" --glob "*.ts"

# Find queries bypassing index files
rg "from '\./api\/queries\/[^']+" features --glob "*.tsx" --glob "*.ts"

# Find mutations bypassing index files
rg "from '\./api\/mutations\/[^']+" features --glob "*.tsx" --glob "*.ts"

# Find missing 'server-only' in query files
rg -L "server-only" features --glob "api/queries/*.ts"

# Find missing 'use server' in mutation files
rg -L "use server" features --glob "api/mutations/*.ts"

# Find missing 'use client' in client components
rg "useState|useEffect|onClick" features --glob "*.tsx" | rg -L "use client"

# Find files with wrong suffix in organized directories
find features -path "*/api/queries/*-queries.ts" -o -path "*/api/mutations/*-mutations.ts"

# Count lines in files to find violations
find features lib -type f -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '$1 > 200 {print}'

# Find business logic in lib/
rg "features|portal|salon|booking|appointment" lib --type ts

# Verify components/ui/ is not edited (check git history)
git log --oneline components/ui/ | head -n 5

# ========== Next.js 15+ Specific Checks ==========

# Find removed middleware.ts (must migrate to proxy.ts in Next.js 16)
find . -name "middleware.ts" -o -name "middleware.js" | grep -v node_modules
# Migration: npx @next/codemod@canary upgrade latest

# Find params not being awaited (Next.js 15+ breaking change)
rg "params\.[a-zA-Z]+" app --glob "page.tsx" --glob "layout.tsx" --glob "route.ts" -B 3 | rg -v "await params"

# Find searchParams not being awaited (Next.js 15+ breaking change)
rg "searchParams\.[a-zA-Z]+" app --glob "page.tsx" -B 3 | rg -v "await searchParams"

# Find Route Handlers without explicit caching (may need force-static in Next.js 15+)
rg "export async function GET" app --glob "route.ts" -A 5 | rg -L "export const dynamic"

# Find usage of experimental_ppr (removed in Next.js 15+)
rg "experimental_ppr" app --type ts

# Find parallel routes missing default.tsx
find app -type d -name "@*" -exec test ! -f {}/default.tsx \; -print

# Find error.tsx files missing 'use client' directive
rg -L "use client" app --glob "error.tsx"

# Check for experimental.bundlePagesExternals (should use bundlePagesRouterDependencies)
rg "bundlePagesExternals" next.config.js next.config.ts

# Verify Tailwind config includes app directory
rg "app/\*\*/\*\.\{" tailwind.config.js tailwind.config.ts

# ========== Advanced Routing Pattern Checks ==========

# Find deeply nested dynamic routes (potential performance issue)
find app -type f -name "page.tsx" | grep -E "\[.*\]/.*\[.*\]/.*\[.*\]/"

# Find potential intercepting route patterns
find app -type d -name "(.)*" -o -name "(..)*" -o -name "(...)*"

# Verify all @slots have default.tsx
for slot in $(find app -type d -name "@*"); do
  if [ ! -f "$slot/default.tsx" ]; then
    echo "Missing default.tsx in: $slot";
  fi
done

# Find route groups (for documentation)
find app -type d -name "(*)" | grep -v node_modules

# Check for potential URL conflicts in route groups
find app -name "page.tsx" | sed 's/.*app\///' | sed 's/\/page.tsx$//' | sed 's/(.*)\///' | sort | uniq -d

# ========== Performance & Bundle Optimization Checks ==========

# Find pages without route segment config
rg -L "export const (dynamic|revalidate|fetchCache|runtime)" app --glob "**/page.tsx"

# Find large client components that should be code-split
find features components -name "*.tsx" -exec sh -c '
  lines=$(wc -l < "$1")
  if [ $lines -gt 200 ] && grep -q "use client" "$1"; then
    echo "$lines $1 - Consider code splitting"
  fi
' _ {} \; | sort -rn

# Find client components importing heavy libraries
rg "import.*from '(moment|lodash|@?material-ui|recharts|d3)'" features components --glob "*.tsx" -l | while read file; do
  if grep -q "use client" "$file"; then
    echo "Heavy lib in client component: $file"
  fi
done

# Check for dynamic imports (verify code splitting)
rg "dynamic\(" features --glob "*.tsx" -c | sort -rn

# Find components that could be Server Components
rg "^'use client'" features --glob "*.tsx" -l | while read file; do
  if ! grep -qE "(useState|useEffect|onClick|onChange|useRouter)" "$file"; then
    echo "Potential unnecessary 'use client': $file"
  fi
done

# ========== Security Architecture Checks ==========

# Find auth logic in non-server files
rg "requireAuth|requireAdmin|requireBusinessOwner" features components --glob "*.tsx" --glob "*.ts" | grep -v "/api/" | grep -v "server-only"

# Find missing 'server-only' in lib/auth
rg -L "server-only" lib/auth --glob "*.ts" --glob "*.tsx"

# Find potential API key exposure in client code
rg "process\.env\.[A-Z_]+" components features --glob "*.tsx" | grep -v "NEXT_PUBLIC"

# Find rate limiting patterns
rg "checkRateLimit|rate.?limit" app/api --glob "route.ts" -c | sort -rn

# Verify RLS vs server-side auth layering
rg "\.from\(" features --glob "api/mutations/*.ts" -A 5 | rg -v "(requireAuth|requireAdmin|requireBusinessOwner)" -B 5

# ========== Edge Case Detection ==========

# Find potential route priority conflicts
find app -name "page.tsx" | sed 's|.*/\([^/]*\)/page\.tsx|\1|' | grep -E "^\[.*\]$|^[a-z-]+$" | sort | uniq -c | awk '$1 > 1 {print "Potential conflict:", $2}'

# Find multiple root layouts (full page reload warning)
find app -path "*/(*)/layout.tsx" -exec grep -l "<html" {} \; | wc -l

# Check for static/dynamic mixing in parallel routes
for slot in $(find app -type d -name "@*"); do
  find "$slot" -name "page.tsx" -exec grep -l "force-static" {} \; 2>/dev/null
  find "$slot" -name "page.tsx" -exec grep -l "force-dynamic\|cookies()\|headers()" {} \; 2>/dev/null
done

# Find intercepting routes without matching full page routes
find app -type d -name "(.)* " -o -name "(..)* " | while read intercepted; do
  original=$(echo "$intercepted" | sed 's/(..)/ /')
  if [ ! -d "$original" ]; then
    echo "Intercepting route without full page: $intercepted"
  fi
done
```

---

## Quick Reference

| Pattern | When | Example | Version |
|---------|------|---------|---------|
| **Thin Page** | All pages | `app/([portal])/route/page.tsx` (< 15 lines) | All |
| **Root Layout** | Required | `app/layout.tsx` with `<html>` and `<body>` | All |
| **Portal Layout** | Optional | `app/([portal])/layout.tsx` for shared portal UI | All |
| **Template** | State reset on nav | `app/template.tsx` (re-mounts on navigation) | 15+ |
| **Default (Parallel)** | Parallel routes | `app/@slot/default.tsx` (required fallback) | 15+ |
| **Proxy** | Request intercept | `proxy.ts` (replaces middleware.ts) | 15+ |
| **Async Params** | Dynamic routes | `const { id } = await params` (params is Promise) | 15+ |
| **Parallel Routes** | Multi-panel dashboards | `app/dashboard/@analytics/page.tsx` | All |
| **Intercepting Routes** | Modals with URLs | `app/@modal/(.)photos/[id]/page.tsx` | All |
| **Route Groups** | Organization | `app/(marketing)/about/page.tsx` → `/about` | All |
| **Force Dynamic** | Real-time data | `export const dynamic = 'force-dynamic'` | All |
| **Force Static** | SEO pages | `export const dynamic = 'force-static'` | All |
| **ISR** | Periodic updates | `export const revalidate = 300` (5 min) | All |
| **Small Feature** | < 5 files | Flat `api/queries.ts`, `api/mutations.ts` | All |
| **Medium Feature** | 5-15 files | Organized `api/queries/[domain].ts` | All |
| **Large Feature** | > 15 files | Nested `api/queries/[domain]/[specific].ts` | All |
| **Marketing** | Content pages | Sections-based structure | All |
| **Auth** | Forms | Validation-focused with Zod schemas | All |
| **Shared** | All portals | `features/shared/[feature]/` | All |
| **Infrastructure** | Technical | `lib/[category]/` | All |

**Migration Notes for Next.js 16:**
- Run `npx @next/codemod@canary upgrade latest` to automate upgrade from Next.js 15 to 16
- This codemod handles:
  - Migrating middleware.ts → proxy.ts (file and export function)
  - Updating next.config.js (experimental.turbopack → turbopack, etc.)
  - Removing experimental_ppr config
  - Updating ESLint configuration
- Update all `params` and `searchParams` access to await them (they are Promises in 15+)
- Add `export const dynamic = 'force-static'` to Route Handlers that need caching (15+)
- Update image generation functions: `await params` and `await id` in `generateImageMetadata`

---

**Related:**
- `02-typescript.md` - Type safety patterns
- `03-react.md` - Component patterns
- `04-nextjs.md` - Framework-specific rules
- `05-database.md` - Supabase data layer
- `06-api.md` - Server Actions and Route Handlers

---

## Changelog

### January 4, 2025 - Next.js 16 Upgrade

**Summary:** Updated entire document to reflect Next.js 16 breaking changes and new features based on official Next.js 16 upgrade guide and Context7 documentation.

**Major Changes:**

1. **Updated Stack Version**
   - Changed from "Next.js 15.1.8+" to "Next.js 16+"
   - Updated all version references throughout the document

2. **Middleware → Proxy Migration**
   - Updated all references from `middleware.ts` to `proxy.ts`
   - Changed terminology from "deprecated" to "removed" for Next.js 16
   - Updated export function: `middleware()` → `proxy()`
   - Updated config option: `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`
   - Updated all code examples to use `export function proxy()`
   - Updated migration command to `npx @next/codemod@canary upgrade latest`

3. **New Next.js 16 Features Documented**
   - **Turbopack as default** - No `--turbopack` flag needed
   - **New cache APIs:**
     - `updateTag()` - Read-your-writes cache invalidation (Server Actions)
     - `refresh()` - Client router refresh from Server Actions
     - Stable `cacheLife` and `cacheTag` (no `unstable_` prefix)
   - **Configuration changes:**
     - `experimental.turbopack` → top-level `turbopack`
     - `experimental.dynamicIO` → `cacheComponents`
     - `experimental.ppr` → `cacheComponents`
   - **Image optimization changes:**
     - `minimumCacheTTL` default: 60s → 14400s (4 hours)
     - Local images with query strings require `localPatterns`
     - Local IP optimization requires `dangerouslyAllowLocalIP: true`
   - **Routing changes:**
     - Parallel routes require `default.js` with `notFound()`
     - Smooth scroll behavior no longer overridden by default
   - **Build changes:**
     - Dev output moved to `.next/dev/`
     - Development detection: use `process.env.NODE_ENV` not `process.argv`

4. **Updated "Recent Updates" Section**
   - Completely rewritten with Next.js 16 breaking changes
   - Organized into categories: Build & Development, Middleware/Proxy, Configuration, Caching, Images, Routing
   - Added detailed migration notes for each change

5. **Updated Code Examples**
   - All proxy examples now use `export function proxy()` instead of `middleware()`
   - Added comments about Next.js 16 requirements
   - Updated image generation examples with async `params` and `id`

6. **Updated Detection Commands**
   - Updated middleware.ts detection comment to reflect "removed" status
   - Updated migration codemod command throughout

7. **Updated Migration Notes**
   - Consolidated migration to single codemod: `npx @next/codemod@canary upgrade latest`
   - Added image generation migration notes
   - Removed separate codemods for individual features

**Files Modified:**
- `/Users/afshin/Desktop/Enorae/docs/rules/01-architecture.md`

**Lines Changed:** ~80 updates across 15+ sections

**Sources:**
- Context7 Next.js Documentation (/vercel/next.js)
- Next.js 16 Upgrade Guide: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-16.mdx

**Breaking Changes Documented:**
1. middleware.ts → proxy.ts (file and export rename)
2. Turbopack configuration location change
3. PPR/dynamicIO renamed to cacheComponents
4. Image optimization defaults changed
5. Parallel routes require default.js
6. Development mode detection changed

**Next Review:** July 2025 or when Next.js 17 is announced

---

### January 3, 2025 - Ultra-Deep Analysis Update

**Sources:**
- **Official Next.js Documentation:** nextjs.org/docs (v16+)
  - Parallel Routes: https://nextjs.org/docs/app/building-your-application/routing/parallel-routes
  - Intercepting Routes: https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes
  - Route Groups: https://nextjs.org/docs/app/building-your-application/routing/route-groups
  - Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
  - Route Segment Config: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
- **Codebase Analysis:** /Users/afshin/Desktop/Enorae (real-world patterns)
  - Examined 5 route groups: (admin), (business), (customer), (staff), (marketing)
  - Analyzed 50+ feature index files for size limits
  - Reviewed API route patterns with rate limiting and caching

**Major Additions (1,200+ lines):**

**1. Advanced Routing Patterns (3 new patterns)**
- **Pattern 7: Parallel Routes** - Multi-panel dashboards, independent slot navigation
  - File structure with @slot syntax
  - CRITICAL: default.tsx requirements
  - Static/Dynamic constraint rules
  - Layout implementation with slot props
  - Navigation behavior (soft vs hard)
  - Performance notes (independent loading/error)
  - Real-world use case: Admin dashboard
  - 4 common pitfalls documented

- **Pattern 8: Intercepting Routes** - Modals with shareable URLs
  - Syntax convention: (.), (..), (..)(..), (...)
  - Photo gallery implementation pattern
  - Modal component with router.back()
  - Behavior differences (soft vs hard navigation)
  - Auth modal use case
  - Intercepting pattern reference table
  - Performance benefits (scroll preservation, prefetching, SEO)
  - 4 common pitfalls

- **Pattern 9: Route Groups (Advanced)** - Multi-tenant organization
  - Multiple root layouts pattern
  - Performance warning: full page reload between layouts
  - Selective layout sharing
  - Current codebase pattern documented
  - Path conflict prevention
  - Performance implications table
  - 4 common pitfalls

**2. Performance Optimization Patterns (3 new patterns)**
- **Pattern 10: Static vs Dynamic Configuration**
  - Automatic detection rules (what forces dynamic)
  - Manual override with route segment config
  - Complete config options reference table
  - Real-world patterns: Admin (force-dynamic), Marketing (force-static), ISR
  - API Route caching (Next.js 15+ behavior)
  - 3 detection commands

- **Pattern 11: Bundle Optimization**
  - File size impact table
  - 4 optimization techniques:
    1. Server Component First (zero JS)
    2. Leaf Client Components (minimal bundle)
    3. Dynamic Imports (code splitting)
    4. Middleware optimization
  - Before/after examples
  - 4 detection commands for bundle bloat

- **Pattern 12: Caching Strategy Architecture**
  - Multi-layer caching (3 layers)
  - Cache strategy decision tree
  - Real-world caching examples from codebase
  - stale-while-revalidate pattern

**3. Edge Cases and Pitfalls (5 critical scenarios)**
- **Edge Case 1:** Deep dynamic route nesting
  - Problem: /salon/[id]/staff/[id]/service/[id]
  - Impact on performance and caching
  - Solutions: flatten with query params or use parallel routes
  - Detection command

- **Edge Case 2:** Route priority conflicts
  - Priority order documentation
  - Conflict example: [category] vs /new
  - Solution: explicit precedence
  - Detection command

- **Edge Case 3:** Layout remounting on navigation
  - Problem: multiple root layouts = full reload
  - Impact on state and UX
  - Detection and solution patterns

- **Edge Case 4:** Parallel routes with missing slots
  - Problem: hard navigation blank screens
  - Example with @analytics and @team
  - Solution: default.tsx fallbacks

- **Edge Case 5:** Static/Dynamic slot mixing
  - Problem: build errors when mixing
  - Solution: apply dynamic config to layout

**4. Security Architecture Patterns (3 new patterns)**
- **Pattern 13: Security-Focused File Placement**
  - Server-only code placement rules
  - Client-safe code guidelines
  - Security file placement table (6 categories)
  - 3 detection commands

- **Pattern 14: RLS vs Server-Side Authorization**
  - Decision tree for security layers
  - RLS policy pattern (SQL)
  - Server-side guard pattern
  - Feature-level check pattern
  - Layered security (4-layer defense in depth)

- **Pattern 15: Rate Limiting Architecture**
  - File placement for rate limiting
  - Real pattern from codebase (app/api/salons/suggestions/route.ts)
  - Advanced: shared rate limit utility
  - createRateLimiter factory function

**5. Detection Commands (40+ new commands)**
Organized into 4 categories:
- **Advanced Routing Pattern Checks (6 commands)**
  - Deeply nested routes
  - Intercepting route patterns
  - Missing default.tsx in slots
  - Route groups documentation
  - URL conflicts in route groups

- **Performance & Bundle Optimization (5 commands)**
  - Pages without route segment config
  - Large client components
  - Heavy libraries in client code
  - Code splitting verification
  - Unnecessary 'use client' detection

- **Security Architecture Checks (5 commands)**
  - Auth logic in non-server files
  - Missing 'server-only' in lib/auth
  - API key exposure
  - Rate limiting patterns
  - RLS vs server-side auth layering

- **Edge Case Detection (4 commands)**
  - Route priority conflicts
  - Multiple root layouts
  - Static/dynamic mixing in slots
  - Intercepting routes without full pages

**6. Quick Reference Table Updates**
- Added 7 new pattern rows:
  - Parallel Routes
  - Intercepting Routes
  - Route Groups
  - Force Dynamic
  - Force Static
  - ISR
- Updated with version tracking

**Breaking Changes Documented:**

1. **Async params/searchParams (CRITICAL)**
   - `params` is now `Promise<{ id: string }>` instead of `{ id: string }`
   - `searchParams` is now a Promise
   - All page.tsx, layout.tsx, and route.ts files MUST `await params` before accessing properties
   - Added examples showing correct `await params` usage
   - Added detection command to find unawaited params access

2. **Route Handler Caching Changed**
   - `GET` and `HEAD` Route Handlers NO LONGER cache by default
   - Must explicitly opt-in with `export const dynamic = 'force-static'`
   - Updated FORBIDDEN rules to warn about assuming caching
   - Added detection command to find Route Handlers without explicit caching config

3. **middleware.ts Removed (Next.js 16)**
   - `middleware.ts` is REMOVED in Next.js 16
   - Replaced by `proxy.ts` convention
   - Export function renamed: `middleware()` → `proxy()`
   - Configuration renamed: `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`
   - Added migration codemod: `npx @next/codemod@canary upgrade latest`
   - Added new Proxy Pattern section with examples
   - Added detection command to find removed middleware.ts files

4. **experimental_ppr Removed**
   - Route segment config `experimental_ppr` removed in Next.js 15+
   - Added migration codemod: `npx @next/codemod@latest remove-experimental-ppr .`
   - Added to FORBIDDEN rules
   - Added detection command to find usage

5. **experimental.bundlePagesExternals Stabilized**
   - Now `bundlePagesRouterDependencies` in next.config.js
   - Added detection command to find old config

**New Features Documented:**

1. **template.tsx Pattern**
   - Added Template Component Pattern section
   - Explains difference from layout.tsx (re-mounts vs persists)
   - Use cases: reset scroll, animations, form state on navigation
   - Added to special files list
   - Added to Quick Reference table

2. **default.tsx for Parallel Routes**
   - Added Default Component Pattern section
   - Required for parallel route slots to prevent build errors
   - Shows file structure example with @team and @analytics slots
   - Added detection command to find missing default.tsx in parallel routes
   - Added to Quick Reference table

3. **error.tsx Must Be Client Component**
   - Confirmed error.tsx requires 'use client' directive
   - Added detection command to find error.tsx missing 'use client'

**Updated Sections:**

1. **Pattern 2: App Router File Conventions**
   - Added template.tsx with "NEW in 15+" label
   - Added default.tsx with "NEW in 15+" label
   - Added proxy.ts with "New in Next.js 15+" label
   - Marked middleware.ts as "DEPRECATED"
   - Clarified error.tsx must be 'use client'

2. **Page Component Pattern**
   - Added Next.js 15+ async params example
   - Shows correct `await params` usage
   - Shows incorrect non-awaited params (WRONG example)
   - Type signature updated: `params: Promise<{ id: string }>`

3. **FORBIDDEN Section**
   - Added #9: Using middleware.ts (deprecated)
   - Added #10: Not awaiting params (breaking change)
   - Added #11: Assuming Route Handler caching (breaking change)
   - Added #12: Using experimental_ppr (removed feature)

4. **Detection Commands**
   - Added section header: "Next.js 15+ Specific Checks"
   - Added 8 new detection commands for Next.js 15 migration:
     - Find deprecated middleware.ts files
     - Find params not being awaited
     - Find searchParams not being awaited
     - Find Route Handlers without explicit caching
     - Find experimental_ppr usage
     - Find parallel routes missing default.tsx
     - Find error.tsx missing 'use client'
     - Check for old bundlePagesExternals config
     - Verify Tailwind config includes app directory

5. **Quick Reference Table**
   - Added "Version" column to track when patterns were introduced
   - Added Template pattern (15+)
   - Added Default (Parallel) pattern (15+)
   - Added Proxy pattern (15+)
   - Added Async Params pattern (15+)
   - Added Migration Notes section below table with 4 key migration steps

**Version Updates:**
- Updated "Last Updated" from January 3, 2025 to January 4, 2025 (Next.js 16 Update)
- Updated "Stack Version" from "Next.js 15.1.8+" to "Next.js 16+"
- Completely rewritten "Recent Updates (January 2025)" section with Next.js 16 breaking changes
- All middleware.ts references updated to reflect removal (not just deprecation)
- Added Next.js 16 new features: `updateTag()`, `refresh()`, stable cache APIs
- Updated image optimization defaults and configuration
- Added Turbopack as default bundler information
- Updated migration instructions to use `npx @next/codemod@canary upgrade latest`

**Files Modified:**
- `/Users/afshin/Desktop/Enorae/docs/rules/01-architecture.md`

**Sources:**
- Context7 Next.js Documentation (/vercel/next.js)
- Next.js 16 Upgrade Guide: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-16.mdx

**Lines Added:** ~150 lines of new content
**Sections Updated:** 7 major sections
**New Examples:** 5 new code examples
**New Detection Commands:** 8 commands
**Breaking Changes:** 5 documented with migration paths

**Testing Recommendations:**

1. **Run Next.js 15 migration checks:**
   ```bash
   find . -name "middleware.ts" | grep -v node_modules
   rg "params\.[a-zA-Z]+" app --glob "page.tsx" -B 3 | rg -v "await params"
   rg "export async function GET" app --glob "route.ts" -A 5 | rg -L "export const dynamic"
   rg "experimental_ppr" app --type ts
   ```

2. **Run advanced routing pattern checks:**
   ```bash
   # Verify parallel routes have default.tsx
   for slot in $(find app -type d -name "@*"); do
     if [ ! -f "$slot/default.tsx" ]; then echo "Missing default.tsx in: $slot"; fi
   done

   # Check for deeply nested routes
   find app -type f -name "page.tsx" | grep -E "\[.*\]/.*\[.*\]/.*\[.*\]/"

   # Find route priority conflicts
   find app -name "page.tsx" | sed 's/.*app\///' | sed 's/\/page.tsx$//' | sed 's/(.*)\///' | sort | uniq -d
   ```

3. **Run performance optimization checks:**
   ```bash
   # Find large client components
   find features components -name "*.tsx" -exec sh -c 'lines=$(wc -l < "$1"); if [ $lines -gt 200 ] && grep -q "use client" "$1"; then echo "$lines $1"; fi' _ {} \; | sort -rn

   # Find unnecessary 'use client'
   rg "^'use client'" features --glob "*.tsx" -l | while read file; do
     if ! grep -qE "(useState|useEffect|onClick|onChange|useRouter)" "$file"; then
       echo "Potential unnecessary 'use client': $file"
     fi
   done
   ```

4. **Run security architecture checks:**
   ```bash
   # Find auth logic in client-accessible files
   rg "requireAuth|requireAdmin|requireBusinessOwner" components features --glob "*.tsx" | grep -v "/api/" | grep -v "server-only"

   # Find missing 'server-only' in lib/auth
   rg -L "server-only" lib/auth --glob "*.ts"

   # Find potential API key exposure
   rg "process\.env\.[A-Z_]+" components features --glob "*.tsx" | grep -v "NEXT_PUBLIC"
   ```

5. **Run migration codemods for Next.js 16:**
   ```bash
   # Automated upgrade from Next.js 15 to 16
   npx @next/codemod@canary upgrade latest

   # This handles:
   # - middleware.ts → proxy.ts migration
   # - next.config.js updates
   # - experimental_ppr removal
   # - ESLint config updates
   ```

6. **Manual reviews:**
   - Update all params/searchParams access to await them
   - Review Route Handlers and add explicit caching config
   - Check for multiple root layouts (triggers full page reload)
   - Verify rate limiting on public API routes

**Next Review Recommended:** July 2025 or when Next.js 17 is announced

**Cross-File Impact:**
- **04-nextjs.md** - Should reference these advanced routing patterns
- **06-api.md** - Should reference rate limiting and caching patterns
- **05-database.md** - Should reference RLS vs server-side auth patterns
- **08-ui.md** - Should reference bundle optimization for components
