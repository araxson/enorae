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
