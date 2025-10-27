# Supabase Best Practices

Last updated: 2025-10-26
Client library version: Latest

## Authentication
- Prefer `supabase.auth.getUser()` when validating active sessions. `getSession()` returns cached data without JWT verification, so pair the two (as in the documented `safeGetSession`) before trusting `session.user`.
- In Next.js App Router apps, encapsulate `createServerClient` inside `utils/supabase/server` (or similar) and supply cookie handlers from `next/headers`. Call `auth.getUser()` immediately after creating the client and keep unrelated logic out of the critical section to avoid transient "logged out" flashes.
- Middleware that refreshes sessions must return the original `supabaseResponse` object, copy cookies forward, and restrict matchers to dynamic routes so static assets bypass the auth cost.
- Browser components should bootstrap a singleton via `createBrowserClient`, call `auth.getSession()` on mount, and subscribe to `auth.onAuthStateChange`. Handle the `INITIAL_SESSION`, `SIGNED_IN`, `TOKEN_REFRESHED`, and `SIGNED_OUT` events explicitly, revalidating loaders when the client token diverges from the server copy.
- For OAuth/passwordless callbacks, verify tokens server-side with `auth.verifyOtp()` (or the provider helper), then redirect using the documented `redirect_to` pattern so the session is persisted before the user returns to the client.
- Refresh Realtime credentials after any session update with `supabase.realtime.setAuth('fresh-jwt')` to keep existing WebSocket channels authorized.
- Edge Functions, Route Handlers, and other server utilities should read `Authorization: Bearer <token>`, pass the token to `auth.getUser(token)`, and only then run tenant-scoped queries so RLS enforcement matches the calling user.
- Frameworks with custom cookie APIs (SvelteKit, Astro) must set the cookie `path` when calling `setAll`; omitting it causes the documented silent auth failures.

## Row Level Security
- Enable RLS immediately after table creation and target `TO authenticated` so anonymous requests short-circuit before evaluating policy predicates.
- For per-user isolation, compare `(select auth.uid())` to the owner column; wrapping the helper in a subselect lets Postgres cache the JWT-derived value and avoids invoking `auth.uid()` for every row.
- Add B-tree indexes on frequently filtered columns such as `user_id`, `tenant_id`, or `(tenant_id, created_at)` so RLS-aware queries stay fast even with high cardinality.
- Pull role or tenant context from JWT claims with `auth.jwt()`, e.g., checking `app_metadata.teams` arrays or enforcing MFA with the `aal` claim through restrictive policies.
- Avoid correlated subqueries across RLS-protected tables. Instead, denormalize required flags into the target table or expose them through JWT `app_metadata` to keep policy expressions deterministic.
- Model application roles with a `user_role` enum and stamp the active role into JWT metadata; RLS can then inspect `auth.jwt()->>'role'` without additional lookups.
- Layer security with restrictive policies (e.g., MFA gates). Restrictive policies always run, so keep them lightweight and based on cached claims.
- Lock in behavior with pgTAP tests via `supabase test new <policy>.test`, ensuring future migrations do not erode multi-tenant guarantees.

## Server Client
- Centralize server client creation with `createServerClient` and framework-aware cookie handlers (`cookies()` in Next.js, `event.cookies` in SvelteKit). Wrap `setAll` in `try/catch` to tolerate Server Component contexts that cannot mutate cookies.
- Middleware session refresh should set request cookies before creating a new `NextResponse`, then copy them to the outgoing response to keep browser and server states aligned during redirects.
- Use server clients for SSR data fetching, Server Actions, Route Handlers, edge middleware, and any interaction that must respect the caller's RLS context. Use plain `createClient` with service credentials only for trusted back-office processes.
- Read Supabase environment variables from server-only scopes and never embed service-role keys in browser bundles; supply typed clients with `<Database>` so misuse is a compile-time error.
- When running outside an HTTP request (cron, queues), instantiate a service-role client and pass tenant context explicitly via `supabase-auth-token` headers or function parameters to avoid cross-tenant leakage.
- Follow the SvelteKit example by setting cookie `path: '/'` when mutating auth cookies; the platform rejects writes without an explicit path.
- Share the server helper between middleware, Server Actions, and Route Handlers so behavior stays consistent and session refresh logic lives in one place.

## Client-Side Usage
- Keep a browser singleton (module-level variable or memoized hook) so `createBrowserClient` is invoked once per tab, limiting duplicate auth listeners and WebSocket connections.
- Subscribe to Realtime channels with scoped filters, e.g., `channel('tenant:123', { config: { private: true } }).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'locations', filter: 'tenant_id=eq.123' }, handler)`, and call `removeChannel` during cleanup.
- Refresh Realtime auth tokens whenever `onAuthStateChange` emits `TOKEN_REFRESHED`, and enable telemetry log levels (`log_level: 'info'`) during debugging to trace joins and reconnects.
- Pair the Supabase browser client with caching libraries (React Query, SWR) that can hydrate SSR payloads and respect stale times. Trigger loader revalidation when access tokens change so stale data cannot bleed across tenants.
- Short-circuit protected UI by gating routes on `session` before rendering to avoid exposing flickering tenant data during transitions.
- Use Presence helpers (`channel.presenceState()` inside `sync`) to hydrate collaborative UI without additional reads; broadcast metadata only from authorized tenants.
- When integrating with React Query, keep queries idempotent and rely on typed helpers (`Tables<'table'>`) so cache keys map cleanly to multi-tenant resources.

## Type Generation
- Regenerate types with `supabase gen types typescript --project-id <PROJECT_REF> --schema public > path/to/database.types.ts` (or `--local` for local dev databases) whenever a migration changes schema or policies.
- Import the generated `Database` type into every Supabase client (`createClient<Database>(url, key)`) so `Tables<'todos'>` and `Enums<'user_role'>` are available throughout the codebase.
- Infer complex query responses with `QueryData<typeof query>` to keep joins, nested selects, and RPC outputs aligned with schema changes.
- Override generated shapes when necessary using `MergeDeep` or `overrideTypes()` to fix nullable view columns or refine `single()` payloads without editing the generated file directly.
- Export a shared `TypedSupabaseClient = SupabaseClient<Database>` type and reuse it across middleware, hooks, and tests for consistency.
- Add an `update-types` npm script (`npx supabase gen types --lang=typescript --project-id "$PROJECT_REF" > src/lib/database.types.ts`) and require it in CI so drift fails fast.
- Lean on helper aliases `Tables`, `Views`, and `Enums` to simplify domain models and avoid brittle nested type paths.
- Document manual overrides alongside migrations so maintainers understand why a generated field differs from Postgres defaults.

## Migrations
- Commit every schema and policy change to `supabase/migrations/`, using `supabase migration new <slug>` for descriptive filenames that sort chronologically.
- Capture dashboard changes with `supabase db diff -f <summary>` (or add `--use-migra` for concise SQL) and check the output into version control instead of editing schema manually in production.
- Pull supporting schemas (`auth`, `storage`, or custom) with `supabase db pull --schema auth,storage` when their triggers or policies change, ensuring local development mirrors production.
- Validate reproducibility with `supabase db reset` (or `supabase start && supabase migration up`) so a clean clone can rebuild the database without manual steps.
- Promote changes using `supabase link` followed by `supabase db push`, and verify applied versions via `supabase migration list` in CI/CD.
- Embrace branching workflows: generate preview diffs, squash noisy iterations with `supabase migration squash`, and document merge order so Supabase preview branches replay migrations deterministically.
- Keep backfills and policy adjustments in the same migration so existing rows satisfy new `WITH CHECK` clauses before RLS enforcement tightens.
- Add pgTAP policy/spec tests to the migration folder (via `supabase test new`) to guard against regressions in future diffs.

## Query Patterns
- Select only required columns and leverage nested selects (`supabase.from('countries').select('id,name,cities(id,name)')`) so PostgREST handles joins while payloads stay lean.
- Combine filters with the query builder helpers (`eq`, `gt`, `in`, `like`) or channel syntax (`.or('status.eq.active,status.eq.pending')`) to express tenant and user constraints consistently with your RLS policies.
- Always apply an `.order(...)` before paginating, then use `.range(from, to)` or `.limit(pageSize)` so users see deterministic windows even as data mutates.
- Use `maybeSingle()`/`single()` for unique lookups and surface problems early by throwing when `{ error }` is truthy; logging the code/message/hint trio gives actionable telemetry.
- Align query predicates with supporting indexes (e.g., `tenant_id, created_at`) to avoid full scans that become visible as PostgREST timeouts on larger tenants.
- Fetch counts alongside pages via `.select('*', { count: 'exact', head: true })` to drive pagination UIs without loading entire result sets.
- Wrap advanced reporting or search logic in Postgres functions and call them with `supabase.rpc`, letting SQL own complex joins while TypeScript still infers response types.
- Treat `204` responses from `update`/`delete` as potential RLS blocks—if `data`, `count`, and `error` are all null, log the attempted filter so tenant audits remain transparent.
- Retry-idempotent reads when `postgrest-js` surfaces network errors, but never blindly retry writes; prefer `upsert` with conflict targets when idempotency is required.
- Bubble query errors through centralized handlers that tag the tenant, route, and Supabase error payload so on-call responders can trace multi-tenant impact quickly.
# Supabase Patterns

**Standalone reference for Supabase integration (Supabase JS 2.47.15 + `@supabase/ssr` 0.6.1). No external dependencies.**

---

## Stack Context

- **Supabase JS:** 2.47.15
- **SSR Helper:** `@supabase/ssr` 0.6.1 (server, browser, middleware clients)
- **Auth:** Supabase Auth (GoTrue) with cookie-based sessions
- **Schemas:** `organization`, `catalog`, `scheduling`, `identity`, `communication`, `analytics`, `engagement`

---

## Table of Contents

1. [Client Creation](#client-creation)
2. [Authentication Patterns](#authentication-patterns)
3. [Query Patterns](#query-patterns)
4. [Mutation Patterns](#mutation-patterns)
5. [RLS & Tenant Safety](#rls--tenant-safety)
6. [Type Safety](#type-safety)
7. [Real-time Subscriptions](#real-time-subscriptions)
8. [Storage Patterns](#storage-patterns)
9. [Error Handling](#error-handling)
10. [Detection Commands](#detection-commands)
11. [Quick Reference Checklist](#quick-reference-checklist)

---

## Client Creation

### Server Components, Server Actions & Route Handlers

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Ignore when called in a Server Component; middleware handles refresh.
          }
        },
      },
    }
  )
}
```

### Client Components

```ts
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

### Middleware (`updateSession`)

```ts
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  await supabase.auth.getUser() // refresh session if needed
  return response
}
```

Always call `updateSession` from `middleware.ts`; never implement cookie refresh manually.

---

## Authentication Patterns

### Server-side Guards

```ts
const supabase = await createClient()
const {
  data: { user },
} = await supabase.auth.getUser()
if (!user) throw new Error('Unauthorized')
```

Use `getUser()` in queries/mutations and `NextResponse.redirect` in route handlers or middleware when `user` is `null`.

> Supabase warns that `getSession()` reads from storage and can be spoofed. Always prefer `getUser()` or `getClaims()` for authenticated server logic (Supabase JS docs).

### Server Actions (login/signup)

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { authFormSchema } from '../schema'

export async function login(_: unknown, formData: FormData) {
  const payload = authFormSchema.parse(Object.fromEntries(formData))
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(payload)
  if (error) return { message: error.message }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
```

### OAuth

Client components call `supabase.auth.signInWithOAuth({ provider, options })`. Ensure `redirectTo` uses absolute URLs (`NEXT_PUBLIC_APP_URL`).

---

## Query Patterns

- Always import `'server-only'` in `queries.ts`.
- Use views (`.from('view')`) and filter by tenant.
- Attach `.returns<Type>()` for compile-time validation.

```ts
import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments_view']['Row']

const getSupabase = cache(async () => createClient())

export async function listAppointments(businessId: string) {
  const supabase = await getSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('business_id', businessId)
    .eq('user_id', user.id)
    .returns<Appointment[]>()
  if (error) throw error
  return data
}
```

---

## Mutation Patterns

- Start files with `'use server'`.
- Parse input with Zod before mutating.
- Use schema tables via `.schema('<schema>')`.
- Update cache with `updateTag`/`revalidateTag`/`revalidatePath`.

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { appointmentSchema } from '../schema'
import { updateTag, revalidatePath } from 'next/cache'

export async function createAppointment(_: unknown, formData: FormData) {
  const payload = appointmentSchema.parse(Object.fromEntries(formData))
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert({ ...payload, business_id: user.id })

  if (error) return { error: error.message }

  updateTag(`appointments:${user.id}`)
  revalidatePath('/business/appointments')
  return { error: null }
}
```

**Cache playbook:**

- `updateTag('appointments')` – immediate consistency for lists.
- `revalidateTag('appointments', 'max')` – stale-while-revalidate when freshness can lag.
- `revalidatePath('/route')` – fallback when a specific path must update.

---

## RLS & Tenant Safety

- RLS is enabled everywhere. Every policy checks `auth.uid()` and tenant columns.
- Never query schema tables directly in read paths; use views with embedded tenant filters.
- Server Actions should always `.eq('business_id', user.id)` when mutating multi-tenant data.

Example policy snippet:

```sql
create policy "Users view appointments" on scheduling.appointments
  for select using (business_id = auth.uid());
```

---

## Type Safety

- All reads/writes rely on generated Supabase types (`Database` interface).
- Use `.returns<Type>()` on selects/updates to verify column projections.
- Re-export frequently used row types from feature `types.ts`.

```ts
import type { Database } from '@/lib/types/database.types'

export type ServiceRow = Database['catalog']['Tables']['services']['Row']
```

---

## Real-time Subscriptions

Use Realtime only in client components.

```tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments_view']['Row']

export function AppointmentsRealtime({ businessId }: { businessId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    supabase
      .from('appointments_view')
      .select('*')
      .eq('business_id', businessId)
      .then(({ data }) => {
        if (mounted && data) setAppointments(data)
      })

    const channel = supabase
      .channel(`appointments:${businessId}`)
      .on('postgres_changes', { event: '*', schema: 'scheduling', table: 'appointments' }, (payload) => {
        setAppointments((current) => {
          switch (payload.eventType) {
            case 'INSERT':
              return [...current, payload.new as Appointment]
            case 'UPDATE':
              return current.map((item) => (item.id === payload.new.id ? (payload.new as Appointment) : item))
            case 'DELETE':
              return current.filter((item) => item.id !== payload.old.id)
            default:
              return current
          }
        })
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [businessId, supabase])

  return <ul>{appointments.map((appt) => <li key={appt.id}>{appt.customer_name}</li>)}</ul>
}
```

---

## Storage Patterns

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const file = formData.get('file') as File | null
  if (!file) throw new Error('Missing file')

  const filename = `${user.id}/${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage.from('avatars').upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(data.path)

  revalidatePath('/settings/profile')
  return publicUrl
}
```

- Never store raw File objects in state; always pass via `FormData`.
- Use bucket-level RLS to prevent cross-tenant access.

---

## Error Handling

- Supabase clients return `{ data, error }`. Throw or bubble errors after logging.
- For Server Actions, return structured objects for UI consumption.

```ts
const { data, error } = await supabase.from('services_view').select('*')
if (error) {
  console.error('Supabase error:', error)
  throw error
}
```

---

## Detection Commands

```bash
# Queries without server-only directive
rg --files -g 'queries.ts' features | xargs -I{} sh -c "grep -L \"import 'server-only'\" {}"

# Mutations missing 'use server'
rg --files -g 'mutations.ts' features | xargs -I{} sh -c "grep -L \"'use server'\" {}"

# Supabase schema table usage outside mutations
rg "\.schema\(" features --type ts --type tsx | grep -v 'mutations.ts'

# Missing auth guard in Supabase calls
rg "createClient" features --type ts --type tsx \
  | xargs -I{} sh -c "grep -n \"auth.getUser\" {} >/dev/null || echo 'Missing auth guard -> {}'"

# Storage usage in client components
rg "storage" features --type tsx | xargs -I{} sh -c "grep -H \"'use client'\" {} && echo 'Verify storage logic is server-side'"
```

---

## Quick Reference Checklist

- [ ] Server components/actions instantiate Supabase via shared helpers.
- [ ] Middleware delegates to `updateSession` without custom cookie logic.
- [ ] All queries import `'server-only'` and read from views.
- [ ] All mutations begin with `'use server'`, validate with Zod, and gate via `auth.getUser()`.
- [ ] Cache invalidation (`updateTag`, `revalidateTag`, `revalidatePath`) documented per mutation.
- [ ] `Database[...]` types used for every read/write; no inline interfaces.
- [ ] Real-time subscriptions only live in client components and remove channels on cleanup.
- [ ] Storage uploads/downloads flow through Server Actions or secure client helpers.
- [ ] Detection commands report zero violations.

---

**Last Updated:** 2025-10-21 (Updated to Supabase 2.47.15 + @supabase/ssr 0.6.1)
