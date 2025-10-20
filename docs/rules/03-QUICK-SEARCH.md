# Rules Index (Searchable)

**Quick Search**: Use `Cmd/Ctrl+F` to find any rule code (e.g., "DB-P001", "REACT-H102")

This index lists all rules across all domains. Click rule codes to jump to definitions, or click file links to read full documentation.

## 🎨 UI Quick Reference

**Most Common Violations - Check These First:**

1. **Colors** ([UI-H102](#ui-h102)): ONLY use these 34 color tokens from globals.css:
   - `bg-background`, `bg-card`, `bg-muted`, `bg-primary`, `bg-secondary`, `bg-accent`
   - `text-foreground`, `text-muted-foreground`, `text-primary-foreground`, `text-destructive`
   - `text-success`, `text-warning`, `text-info`
   - `border-border`, `border-input`
   - ❌ **NEVER**: `bg-blue-500`, `text-gray-600`, `border-slate-200`, `bg-[#fff]`

2. **Components** ([UI-P003](#ui-p003)): ONLY use shadcn/ui components
   - ✅ `import { Button } from '@/components/ui/button'`
   - ❌ `<button className="...">`, custom UI, other libraries

3. **Typography** ([UI-P004](#ui-p004)): Remove `@/components/ui/typography` imports
   - ✅ Use shadcn slots (CardTitle, CardDescription, Badge)
   - ✅ Semantic HTML + design tokens when no primitive exists
   - ❌ `import { H1, P, Muted } from '@/components/ui/typography'`

---

## Critical Rules (All Domains) {#critical-rules}

### Architecture (ARCH)
- **[ARCH-P001](#arch-p001)** - Server-only directives required in queries.ts, 'use server' in mutations.ts
- **[ARCH-P002](#arch-p002)** - Pages must be 5-15 lines, render feature components only

### Database (DB)
- **[DB-P001](#db-p001)** - Read from public views, write to schema tables
- **[DB-P002](#db-p002)** - Auth verification required in every function
- **[DB-P003](#db-p003)** - Multi-tenant RLS must enforce tenant scope

### Next.js (NEXT)
- **[NEXT-P001](#next-p001)** - Scripts load from app/layout.tsx using next/script
- **[NEXT-P002](#next-p002)** - Import global styles only from app/layout.tsx
- **[NEXT-P003](#next-p003)** - Never use getInitialProps or Pages Router helpers

### React (REACT)
- **[REACT-P001](#react-p001)** - Server Components fetch data, Client Components add interactivity
- **[REACT-P002](#react-p002)** - Avoid client-side data waterfalls (nested useEffect fetches)

### Security (SEC)
- **[SEC-P001](#sec-p001)** - Always call verifySession() or getUser() before data access
- **[SEC-P002](#sec-p002)** - Use role helpers (requireRole, requireAnyRole) before Supabase
- **[SEC-P003](#sec-p003)** - RLS policies must wrap auth.uid() in SELECT

### TypeScript (TS)
- **[TS-P001](#ts-p001)** - No 'any', no '@ts-ignore', strict mode always
- **[TS-P002](#ts-p002)** - Never use reserved words (eval, let) as identifiers

### UI
- **[UI-P001](#ui-p001)** - Render text via shadcn primitives or semantic tokens (no typography imports)
- **[UI-P002](#ui-p002)** - shadcn/ui compositions must include required subcomponents
- **[UI-P003](#ui-p003)** - ONLY use shadcn/ui components (no custom UI primitives)
- **[UI-P004](#ui-p004)** - Remove `@/components/ui/typography` usage; rely on component slots

---

## High Priority Rules

### Accessibility (A11Y)
- **[A11Y-H101](#a11y-h101)** - Provide aria-label for grouped controls
- **[A11Y-H102](#a11y-h102)** - Enable accessibilityLayer on chart components
- **[A11Y-H103](#a11y-h103)** - Wrap related fields in FieldSet + FieldLegend

### Architecture (ARCH)
- **[ARCH-H101](#arch-h101)** - Feature directories follow standard template
- **[ARCH-H102](#arch-h102)** - Route handlers stay under 120 lines

### Database (DB)
- **[DB-H101](#db-h101)** - Policy checks use auth.jwt() and wrap auth.uid() in select
- **[DB-H102](#db-h102)** - Enforce MFA (aal2) on sensitive tables
- **[DB-H103](#db-h103)** - Call revalidatePath after mutations

### Next.js (NEXT)
- **[NEXT-H101](#next-h101)** - Wrap Web Vitals in dedicated 'use client' component
- **[NEXT-H102](#next-h102)** - Use GoogleTagManager from @next/third-parties

### React (REACT)
- **[REACT-H101](#react-h101)** - Place metadata tags directly in components
- **[REACT-H102](#react-h102)** - Use use() hook for server-started promises

### Security (SEC)
- **[SEC-H101](#sec-h101)** - Enforce MFA on sensitive tables via restrictive policies
- **[SEC-H102](#sec-h102)** - Filter multi-tenant access by SSO provider/team
- **[SEC-H103](#sec-h103)** - Middleware must use updateSession() helper

### TypeScript (TS)
- **[TS-H101](#ts-h101)** - Avoid binding patterns in 'using' declarations
- **[TS-H102](#ts-h102)** - No object/array destructuring in strict mode functions

### UI
- **[UI-H101](#ui-h101)** - Define custom styles with @utility not @layer
- **[UI-H102](#ui-h102)** - ONLY use color tokens from globals.css (34 total) - never arbitrary Tailwind colors
- **[UI-H103](#ui-h103)** - Provide aria-label on grouped controls

### Performance (PERF)
- **[PERF-H101](#perf-h101)** - Add covering indexes for foreign keys
- **[PERF-H102](#perf-h102)** - Remove duplicate indexes

---

## Medium Priority Rules

### Accessibility (A11Y)
- **[A11Y-M301](#a11y-m301)** - Use Form, FormField, FormItem primitives
- **[A11Y-M302](#a11y-m302)** - Input OTP uses new composition pattern

### Architecture (ARCH)
- **[ARCH-M301](#arch-m301)** - Shared utilities belong in lib/ organized by domain
- **[ARCH-M302](#arch-m302)** - Multi-portal components (≥3 portals) move to features/shared

### Database (DB)
- **[DB-M301](#db-m301)** - Use .returns<Type>() or .maybeSingle<Type>()
- **[DB-M302](#db-m302)** - Validate payloads with Zod before mutations

### Next.js (NEXT)
- **[NEXT-M301](#next-m301)** - Keep pages ultra-thin (5-15 lines)
- **[NEXT-M302](#next-m302)** - Use container queries for responsive layouts

### React (REACT)
- **[REACT-M301](#react-m301)** - Use React 19 context shorthand
- **[REACT-M302](#react-m302)** - Define hook helpers inline

### Security (SEC)
- **[SEC-M301](#sec-m301)** - Handle Supabase errors explicitly, map to 401/403
- **[SEC-M302](#sec-m302)** - Validate mutations with Zod before writes

### TypeScript (TS)
- **[TS-M301](#ts-m301)** - Avoid numeric literals with leading zeros
- **[TS-M302](#ts-m302)** - Use generated Supabase types for reads/writes

### UI
- **[UI-M301](#ui-m301)** - Use named container queries
- **[UI-M302](#ui-m302)** - Charts include accessibilityLayer prop

### Performance (PERF)
- **[PERF-M301](#perf-m301)** - Remove unused indexes
- **[PERF-M302](#perf-m302)** - Batch independent queries with Promise.all

---

## Low Priority Rules

### Accessibility (A11Y)
- **[A11Y-L701](#a11y-l701)** - Provide descriptive Suspense fallbacks

### Architecture (ARCH)
- **[ARCH-L701](#arch-l701)** - Generate exports from index.tsx only

### Database (DB)
- **[DB-L701](#db-l701)** - Prefer select/filter over RPC for simple queries

### Next.js (NEXT)
- **[NEXT-L701](#next-l701)** - Use Promise.all for independent fetches

### React (REACT)
- **[REACT-L701](#react-l701)** - Server Components import heavy libraries server-side only

### Security (SEC)
- **[SEC-L701](#sec-l701)** - Prefer view-based audits over direct table scans

### TypeScript (TS)
- **[TS-L701](#ts-l701)** - Use unknown + Zod over 'any'

### UI
- **[UI-L701](#ui-l701)** - Refactor :root colors to hsl() with @theme inline

### Performance (PERF)
- **[PERF-L701](#perf-l701)** - Stream large assets at build time
- **[PERF-L702](#perf-l702)** - Use revalidatePath after mutations to prewarm caches

---

## Rule Definitions (Alphabetical by Code)

### A11Y-H101
**File**: [`domains/accessibility.md`]./domains/accessibility.md#a11y-h101)
**Pattern**: Provide explicit accessible names for grouped controls
**Why**: Without aria-label, assistive tech cannot announce control purpose
**Quick Fix**: Add `aria-label="description"` to ButtonGroup, ToggleGroup, etc.
**Example**: `<ButtonGroup aria-label="View mode">...</ButtonGroup>`

### A11Y-H102
**File**: [`domains/accessibility.md`]./domains/accessibility.md#a11y-h102)
**Pattern**: Enable accessibilityLayer on chart components
**Why**: Adds keyboard navigation and screen reader descriptions
**Quick Fix**: Add `accessibilityLayer` prop to charts
**Example**: `<LineChart accessibilityLayer data={data} />`

### A11Y-H103
**File**: [`domains/accessibility.md`]./domains/accessibility.md#a11y-h103)
**Pattern**: Wrap related fields in FieldSet + FieldLegend
**Why**: Provides semantic grouping and consistent aria attributes
**Quick Fix**: Use shadcn form primitives
**Example**: See [`domains/accessibility.md`]./domains/accessibility.md#a11y-h103)

### A11Y-M301
**File**: [`domains/accessibility.md`]./domains/accessibility.md#a11y-m301)
**Pattern**: Use Form, FormField, FormItem primitives
**Why**: Ensures labels and errors are connected
**Quick Fix**: Refactor to shadcn form composition

### A11Y-M302
**File**: [`domains/accessibility.md`]./domains/accessibility.md#a11y-m302)
**Pattern**: Input OTP components use new composition pattern
**Why**: Ensures screen readers announce caret state
**Quick Fix**: Update to OTPInputContext with pattern prop

### A11Y-L701
**File**: [`domains/accessibility.md`]./domains/accessibility.md#a11y-l701)
**Pattern**: Provide descriptive fallback copy for Suspense
**Why**: Gives context to assistive tech while loading
**Quick Fix**: `<Suspense fallback={<P>Loading...</P>}>`

---

### ARCH-P001
**File**: [`domains/architecture.md`](./domains/architecture.md#arch-p001)
**Pattern**: queries.ts needs `import 'server-only'`, mutations.ts needs `'use server'`
**Why**: Prevents credential leaks by enforcing server execution
**Quick Fix**: Add directive as first statement
**Related Rules**: [DB-P002](#db-p002), [SEC-P001](#sec-p001)

### ARCH-P002
**File**: [`domains/architecture.md`](./domains/architecture.md#arch-p002)
**Pattern**: Pages must be 5-15 lines, render feature components only
**Why**: Keeps routing layer thin, centralizes logic in features
**Quick Fix**: Move logic to `features/{portal}/{feature}/index.tsx`
**Example**: `export default async function Page() { return <Feature /> }`

### ARCH-H101
**File**: [`domains/architecture.md`](./domains/architecture.md#arch-h101)
**Pattern**: Feature directories follow template (components/, api/, types.ts, etc.)
**Why**: Predictable structure enables sharing and auditing
**Quick Fix**: Scaffold folders before implementation

### ARCH-H102
**File**: [`domains/architecture.md`](./domains/architecture.md#arch-h102)
**Pattern**: Route handlers stay under 120 lines
**Why**: Prevents duplicate business logic
**Quick Fix**: Move Supabase access to `features/**/api` utilities

### ARCH-M301
**File**: [`domains/architecture.md`](./domains/architecture.md#arch-m301)
**Pattern**: Shared utilities in lib/ organized by domain
**Why**: Prevents cyclical dependencies
**Quick Fix**: Extract to `lib/{domain}`

### ARCH-M302
**File**: [`domains/architecture.md`](./domains/architecture.md#arch-m302)
**Pattern**: Multi-portal components (≥3 portals) move to features/shared
**Why**: Avoids drift between portals
**Quick Fix**: Relocate with portal-specific wrappers if needed

### ARCH-L701
**File**: [`domains/architecture.md`](./domains/architecture.md#arch-l701)
**Pattern**: Generate exports from index.tsx only
**Why**: Improves tree-shaking
**Quick Fix**: Avoid re-export barrels in components/

---

### DB-P001
**File**: [`domains/database.md`](./domains/database.md#db-p001)
**Pattern**: Read from public views, write to schema tables via .schema()
**Why**: Views encapsulate tenant filters and computed fields
**Quick Fix**: Use `supabase.from('view_name')` for SELECT
**Related Rules**: [SEC-P003](#sec-p003), [TS-M302](#ts-m302)
**Example**: ❌ `.schema('scheduling').from('appointments')` ✅ `.from('appointments')`

### DB-P002
**File**: [`domains/database.md`](./domains/database.md#db-p002)
**Pattern**: Every query/mutation verifies user via verifySession() or getUser()
**Why**: Prevents unauthorized access, RLS relies on auth context
**Quick Fix**: Add `const session = await verifySession(); if (!session) throw new Error('Unauthorized')`
**Related Rules**: [SEC-P001](#sec-p001), [ARCH-P001](#arch-p001)

### DB-P003
**File**: [`domains/database.md`](./domains/database.md#db-p003)
**Pattern**: Multi-tenant RLS enforces tenant scope (salon_id, team membership, SSO)
**Why**: Prevents cross-tenant data leakage
**Quick Fix**: Add tenant filter in RLS using auth.jwt() claims
**Related Rules**: [SEC-H102](#sec-h102)

### DB-H101
**File**: [`domains/database.md`](./domains/database.md#db-h101)
**Pattern**: Policies use auth.jwt() for metadata and wrap auth.uid() in SELECT
**Why**: Prevents plan cache issues, ensures per-invocation evaluation
**Quick Fix**: `using ((select auth.uid()) = user_id)`
**Related Rules**: [SEC-P003](#sec-p003)

### DB-H102
**File**: [`domains/database.md`](./domains/database.md#db-h102)
**Pattern**: Enforce MFA (aal2) on sensitive tables
**Why**: Protects high-risk data from compromised accounts
**Quick Fix**: Add restrictive policy checking `auth.jwt()->>'aal' = 'aal2'`
**Related Rules**: [SEC-H101](#sec-h101)

### DB-H103
**File**: [`domains/database.md`](./domains/database.md#db-h103)
**Pattern**: Call revalidatePath after mutations
**Why**: Ensures stale caches aren't served
**Quick Fix**: Add `revalidatePath('/path')` after successful writes
**Related Rules**: [PERF-L702](#perf-l702)

### DB-M301
**File**: [`domains/database.md`](./domains/database.md#db-m301)
**Pattern**: Use .returns<Type>() or .maybeSingle<Type>() for typed responses
**Why**: Prevents unsafe casts from 'unknown'
**Quick Fix**: Supply generated types from Database['public']['Views']
**Related Rules**: [TS-M302](#ts-m302)

### DB-M302
**File**: [`domains/database.md`](./domains/database.md#db-m302)
**Pattern**: Validate request payloads with Zod before mutations
**Why**: Guards against invalid data entering tables
**Quick Fix**: Create schema.ts and use `schema.parse(input)`
**Related Rules**: [SEC-M302](#sec-m302)

### DB-L701
**File**: [`domains/database.md`](./domains/database.md#db-l701)
**Pattern**: Prefer select/filter over RPC for simple queries
**Why**: Leverages caching and maintains type accuracy
**Quick Fix**: Use views instead of stored procedures where possible

---

### NEXT-P001
**File**: [`domains/nextjs.md`]./domains/nextjs.md#next-p001)
**Pattern**: Scripts load from app/layout.tsx using next/script
**Why**: Prevents duplicate execution and guarantees once-per-app execution
**Quick Fix**: `import Script from 'next/script'` and use in root layout
**Example**: `<Script src="..." strategy="afterInteractive" />`

### NEXT-P002
**File**: [`domains/nextjs.md`]./domains/nextjs.md#next-p002)
**Pattern**: Import global styles only from app/layout.tsx
**Why**: Next.js enforces single global CSS entry point
**Quick Fix**: Remove `import './globals.css'` from other modules

### NEXT-P003
**File**: [`domains/nextjs.md`]./domains/nextjs.md#next-p003)
**Pattern**: Never use getInitialProps or Pages Router helpers
**Why**: Disables App Router optimizations
**Quick Fix**: Convert to Server Components or route handlers

### NEXT-H101
**File**: [`domains/nextjs.md`]./domains/nextjs.md#next-h101)
**Pattern**: Wrap Web Vitals in dedicated 'use client' component
**Why**: Keeps layout server-rendered
**Quick Fix**: Create app/_components/web-vitals.tsx with 'use client'

### NEXT-H102
**File**: [`domains/nextjs.md`]./domains/nextjs.md#next-h102)
**Pattern**: Use GoogleTagManager from @next/third-parties
**Why**: Built-in helper ensures hydration-safe script injection
**Quick Fix**: `import { GoogleTagManager } from '@next/third-parties/google'`

### NEXT-M301
**File**: [`domains/nextjs.md`]./domains/nextjs.md#next-m301)
**Pattern**: Keep pages ultra-thin (5-15 lines)
**Why**: Aligns with architecture rule
**Quick Fix**: Move logic to features/{portal}/{feature}
**Related Rules**: [ARCH-P002](#arch-p002)

### NEXT-M302
**File**: [`domains/nextjs.md`]./domains/nextjs.md#next-m302)
**Pattern**: Use container queries for responsive layouts
**Why**: Composition-friendly responsiveness without client JS
**Quick Fix**: Use @container utilities
**Related Rules**: [UI-M301](#ui-m301)

### NEXT-L701
**File**: [`domains/nextjs.md`]./domains/nextjs.md#next-l701)
**Pattern**: Use Promise.all for independent fetches
**Why**: Reduces latency vs sequential awaits
**Quick Fix**: Group independent queries
**Related Rules**: [PERF-M302](#perf-m302)

---

### PERF-H101
**File**: [`domains/performance.md`]./domains/performance.md#perf-h101)
**Pattern**: Add covering indexes for foreign keys
**Why**: Prevents table scans and lock contention
**Quick Fix**: `create index concurrently on table(fk_column)`

### PERF-H102
**File**: [`domains/performance.md`]./domains/performance.md#perf-h102)
**Pattern**: Remove duplicate indexes
**Why**: Slows writes and inflates storage
**Quick Fix**: `drop index if exists duplicate_idx`

### PERF-M301
**File**: [`domains/performance.md`]./domains/performance.md#perf-m301)
**Pattern**: Remove unused indexes after verification
**Why**: Slows inserts/updates
**Quick Fix**: Confirm absence in queries before dropping

### PERF-M302
**File**: [`domains/performance.md`]./domains/performance.md#perf-m302)
**Pattern**: Batch independent Supabase queries with Promise.all
**Why**: Reduces API latency
**Quick Fix**: Group unrelated calls
**Related Rules**: [NEXT-L701](#next-l701)

### PERF-L701
**File**: [`domains/performance.md`]./domains/performance.md#perf-l701)
**Pattern**: Stream large assets at build time via Server Components
**Why**: Keeps client bundles small
**Quick Fix**: Move to server component
**Related Rules**: [REACT-L701](#react-l701)

### PERF-L702
**File**: [`domains/performance.md`]./domains/performance.md#perf-l702)
**Pattern**: Use revalidatePath after mutations
**Why**: Prewarms caches
**Quick Fix**: Add targeted cache invalidation
**Related Rules**: [DB-H103](#db-h103)

---

### REACT-P001
**File**: [`domains/react.md`]./domains/react.md#react-p001)
**Pattern**: Server Components fetch data, Client Components add interactivity
**Why**: Prevents client waterfalls and reduces bundle size
**Quick Fix**: Move data access to parent Server Component
**Example**: Server fetches await data, Client receives as props

### REACT-P002
**File**: [`domains/react.md`]./domains/react.md#react-p002)
**Pattern**: Avoid client-side data waterfalls (nested useEffect fetches)
**Why**: Causes double round-trips and blocks rendering
**Quick Fix**: Fetch related data together in Server Component
**Related Rules**: [NEXT-L701](#next-l701)

### REACT-H101
**File**: [`domains/react.md`]./domains/react.md#react-h101)
**Pattern**: Place metadata tags directly in components
**Why**: React 19 hoists automatically, custom wrappers cause hydration mismatches
**Quick Fix**: Inline <title>, <meta> tags in Server Component

### REACT-H102
**File**: [`domains/react.md`]./domains/react.md#react-h102)
**Pattern**: Use use() hook for server-started promises
**Why**: Enables progressive rendering without manual state
**Quick Fix**: Wrap with Suspense, call use(promise) in client

### REACT-M301
**File**: [`domains/react.md`]./domains/react.md#react-m301)
**Pattern**: Use React 19 context shorthand
**Why**: Keeps code idiomatic
**Quick Fix**: `<Context value={...}>` instead of `<Context.Provider>`

### REACT-M302
**File**: [`domains/react.md`]./domains/react.md#react-m302)
**Pattern**: Define hook helpers inline
**Why**: Simplifies dependency tracking
**Quick Fix**: Move helpers inside hooks

### REACT-L701
**File**: [`domains/react.md`]./domains/react.md#react-l701)
**Pattern**: Server Components import heavy libraries server-side only
**Why**: Prevents bundling in client
**Quick Fix**: Push parsing to Server Components
**Related Rules**: [PERF-L701](#perf-l701)

---

### SEC-P001
**File**: [`domains/security.md`](./domains/security.md#sec-p001)
**Pattern**: Always call verifySession() or getUser() before data access
**Why**: Enforces session refresh, prevents unauthorized reads/writes
**Quick Fix**: Add auth check at start of every server function
**Related Rules**: [DB-P002](#db-p002), [ARCH-P001](#arch-p001)
**Example**: `const session = await verifySession(); if (!session) throw new Error('Unauthorized')`

### SEC-P002
**File**: [`domains/security.md`](./domains/security.md#sec-p002)
**Pattern**: Use role helpers (requireRole, requireAnyRole) before Supabase
**Why**: Business/staff/admin flows need composite role checks
**Quick Fix**: Import from @/lib/auth and gate access
**Example**: `await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)`

### SEC-P003
**File**: [`domains/security.md`](./domains/security.md#sec-p003)
**Pattern**: RLS policies wrap auth.uid() in SELECT
**Why**: Prevents bypass via plan cache
**Quick Fix**: `using ((select auth.uid()) = user_id)`
**Related Rules**: [DB-H101](#db-h101), [DB-P003](#db-p003)

### SEC-H101
**File**: [`domains/security.md`](./domains/security.md#sec-h101)
**Pattern**: Enforce MFA (aal2) on sensitive tables
**Why**: Prevents compromised single-factor access
**Quick Fix**: Add restrictive policy with aal check
**Related Rules**: [DB-H102](#db-h102)

### SEC-H102
**File**: [`domains/security.md`](./domains/security.md#sec-h102)
**Pattern**: Filter multi-tenant by SSO provider/team arrays
**Why**: Platform admins need scoping by team list
**Quick Fix**: Use app_metadata arrays in RLS
**Related Rules**: [DB-P003](#db-p003)

### SEC-H103
**File**: [`domains/security.md`](./domains/security.md#sec-h103)
**Pattern**: Middleware uses updateSession() helper
**Why**: Rotates refresh tokens and syncs cookies
**Quick Fix**: `await updateSession(request)` in middleware

### SEC-M301
**File**: [`domains/security.md`](./domains/security.md#sec-m301)
**Pattern**: Handle Supabase errors explicitly, map to 401/403
**Why**: Raw errors leak internals
**Quick Fix**: Check error.code and return appropriate status

### SEC-M302
**File**: [`domains/security.md`](./domains/security.md#sec-m302)
**Pattern**: Validate mutations with Zod before writes
**Why**: Prevents bypassing UI constraints
**Quick Fix**: Add schema.parse in action
**Related Rules**: [DB-M302](#db-m302)

### SEC-L701
**File**: [`domains/security.md`](./domains/security.md#sec-l701)
**Pattern**: Prefer view-based audits over direct table scans
**Why**: Leverages curated views with policy filters
**Quick Fix**: Use Database['public']['Views'] for dashboards

---

### TS-P001
**File**: [`domains/typescript.md`]./domains/typescript.md#ts-p001)
**Pattern**: No 'any', no '@ts-ignore', strict mode always
**Why**: Catches security bugs in auth-bound paths
**Quick Fix**: Import correct Supabase types or add Zod schemas
**Related Rules**: [DB-P001](#db-p001)
**Example**: `type Appointment = Database['public']['Views']['appointments']['Row']`

### TS-P002
**File**: [`domains/typescript.md`]./domains/typescript.md#ts-p002)
**Pattern**: Never use reserved words (eval, let) as identifiers
**Why**: Generates TS1214/TS1215 errors in strict mode
**Quick Fix**: Rename to descriptive identifiers

### TS-H101
**File**: [`domains/typescript.md`]./domains/typescript.md#ts-h101)
**Pattern**: Avoid binding patterns in 'using' declarations
**Why**: TS 5.9 forbids destructuring in using (TS1492)
**Quick Fix**: Assign to named variables before destructuring

### TS-H102
**File**: [`domains/typescript.md`]./domains/typescript.md#ts-h102)
**Pattern**: No object/array destructuring in strict mode functions
**Why**: Emits TS1105, breaks builds
**Quick Fix**: Remove 'use strict' or rewrite to plain parameters

### TS-M301
**File**: [`domains/typescript.md`]./domains/typescript.md#ts-m301)
**Pattern**: Avoid numeric literals with leading zeros
**Why**: Strict mode forbids (TS1489)
**Quick Fix**: Rewrite without leading zeros (e.g., 9 or 0o11)

### TS-M302
**File**: [`domains/typescript.md`]./domains/typescript.md#ts-m302)
**Pattern**: Use generated Supabase types for reads/writes
**Why**: Ensures RLS conditions align with table definitions
**Quick Fix**: Import from Database['public']['Views'] or schema types
**Related Rules**: [DB-M301](#db-m301), [TS-P001](#ts-p001)

### TS-L701
**File**: [`domains/typescript.md`]./domains/typescript.md#ts-l701)
**Pattern**: Use unknown + Zod over 'any' for third-party responses
**Why**: Maintains exhaustiveness
**Quick Fix**: Wrap in Zod schema and infer type

---

### UI-P001
**File**: [`domains/ui.md`](./domains/ui.md#ui-p001)
**Pattern**: All human-readable copy renders through approved shadcn primitives or semantic elements with design tokens
**Why**: Guarantees consistent typography and theme support without ad-hoc overrides
**Quick Fix**: Replace raw tags/classes with the appropriate shadcn slot (CardTitle, Badge, SidebarMenuButton, etc.) or minimal markup styled with tokens

### UI-P002
**File**: [`domains/ui.md`](./domains/ui.md#ui-p002)
**Pattern**: shadcn/ui compositions include required subcomponents
**Why**: Subcomponents wire aria attributes and theming
**Quick Fix**: Follow registry patterns (DialogHeader + DialogTitle/Description, CardHeader + CardTitle/Description, etc.)

### UI-P003
**File**: [`domains/ui.md`](./domains/ui.md#ui-p003)
**Pattern**: ONLY use shadcn/ui primitives exported from `@/components/ui/*`
**Why**: Keeps the design system consistent and maintainable; prevents third-party drift
**Quick Fix**: Import existing primitives or fetch missing ones via shadcn MCP instead of creating custom components

### UI-P004
**File**: [`domains/ui.md`](./domains/ui.md#ui-p004)
**Pattern**: Remove `@/components/ui/typography` imports/usages; rely on typography baked into shadcn components or minimal semantic markup with design tokens
**Why**: Eliminates redundant wrappers and styling drift—the primitives already encode appropriate typography
**Quick Fix**: Delete typography imports, refactor text into the component’s slot (CardTitle, AlertDescription, SidebarMenuButton, etc.) or into `<p>`/`<span>` using approved tokens when no primitive exists
**Detection**: `rg "from '@/components/ui/typography'" --glob '!docs/**'`

### UI-H101
**File**: [`domains/ui.md`](./domains/ui.md#ui-h101)
**Pattern**: Define custom styles with @utility not @layer
**Why**: Tailwind v4 sorts by property
**Quick Fix**: Convert to @utility definitions

### UI-H102
**File**: [`domains/ui.md`](./domains/ui.md#ui-h102)
**Pattern**: ONLY use semantic color tokens from globals.css (never arbitrary Tailwind colors)
**Why**: Maintains design system consistency, enables dark-mode, prevents visual drift
**Quick Fix**: Replace bg-blue-500 → bg-primary, text-gray-600 → text-muted-foreground
**Example**: Use `bg-primary text-primary-foreground` not `bg-blue-500 text-white`
**Violations**: bg-blue-500, text-gray-600, border-slate-200, bg-[#fff], text-zinc-400
**Allowed Color Tokens (34 total)**:
  - Base: background, foreground, border, input, ring
  - Cards: card, card-foreground, popover, popover-foreground
  - Variants: primary, primary-foreground, secondary, secondary-foreground
  - States: muted, muted-foreground, accent, accent-foreground, destructive
  - Sidebar: sidebar[-foreground|-primary|-primary-foreground|-accent|-accent-foreground|-border|-ring]
  - Charts: chart-1, chart-2, chart-3, chart-4, chart-5
  - Semantic: success, warning, info
**NO OTHER COLORS ALLOWED** - If needed, must be added to globals.css first
**Related Rules**: [UI-L701](#ui-l701)

### UI-H103
**File**: [`domains/ui.md`](./domains/ui.md#ui-h103)
**Pattern**: Provide aria-label on grouped controls
**Why**: Grouped buttons invisible to screen readers without labels
**Quick Fix**: Add aria-label prop
**Related Rules**: [A11Y-H101](#a11y-h101)

### UI-M301
**File**: [`domains/ui.md`](./domains/ui.md#ui-m301)
**Pattern**: Use named container queries for responsive layouts
**Why**: Component-level responsiveness without global breakpoints
**Quick Fix**: Wrap with @container/name and use @sm/name:
**Related Rules**: [NEXT-M302](#next-m302)

### UI-M302
**File**: [`domains/ui.md`](./domains/ui.md#ui-m302)
**Pattern**: Charts include accessibilityLayer prop
**Why**: Adds keyboard support and screen reader descriptions
**Quick Fix**: Pass accessibilityLayer boolean
**Related Rules**: [A11Y-H102](#a11y-h102)

### UI-L701
**File**: [`domains/ui.md`](./domains/ui.md#ui-l701)
**Pattern**: Refactor :root colors to hsl() with @theme inline
**Why**: Simplifies dark mode overrides
**Quick Fix**: Wrap in hsl() and expose via @theme inline
**Related Rules**: [UI-H102](#ui-h102)

---

**Last Updated**: 2025-10-18 | **Total Rules**: 71
