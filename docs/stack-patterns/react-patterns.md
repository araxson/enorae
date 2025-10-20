# React Patterns

**Standalone reference for React 19 patterns within the Next.js App Router. No external dependencies.**

---

## Stack Context

- **React:** 19.1.0 (Server-first architecture)
- **React DOM:** 19.1.0 (`useActionState`, `useOptimistic`, `useFormStatus`)
- **Rendering Model:** Server Components by default, client islands opt-in

---

## Table of Contents

1. [Server vs Client Components](#server-vs-client-components)
2. [Component Composition Patterns](#component-composition-patterns)
3. [React 19 Hooks](#react-19-hooks)
4. [Event & Form Handling](#event--form-handling)
5. [Suspense & Streaming](#suspense--streaming)
6. [Performance Patterns](#performance-patterns)
7. [Detection Commands](#detection-commands)
8. [Complete Examples](#complete-examples)
9. [Quick Reference Checklist](#quick-reference-checklist)

---

## Server vs Client Components

### Server Components (default)

- Run only on the server—no bundle cost.
- May import Node-only and server-only modules.
- Fetch data directly and stream results with Suspense.
- Cannot use stateful hooks (`useState`, `useEffect`, etc.).

```tsx
// Server Component (no directive)
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

const getSupabase = cache(async () => createClient())

export async function BusinessSummary({ businessId }: { businessId: string }) {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('business_metrics_view')
    .select('*')
    .eq('business_id', businessId)
    .single()
  if (error) throw error

  return <p className="text-xl font-semibold">Revenue: {data.revenue_total}</p>
}
```

### Client Components

- Opt in with `'use client'`.
- Use React hooks, browser APIs, event handlers.
- Receive data via props from Server Components.
- Keep them slim; complex logic stays on the server.

```tsx
'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { toggleFavorite } from '@/features/customers/api/mutations'

export function FavoriteButton({ initialState }: { initialState: boolean }) {
  const [state, action, pending] = useActionState(toggleFavorite, initialState)

  return (
    <form action={action}>
      <input type="hidden" name="value" value={String(!state)} />
      <Button type="submit" variant={state ? 'secondary' : 'default'} disabled={pending}>
        {pending ? 'Saving…' : state ? 'Favorited' : 'Add to favorites'}
      </Button>
    </form>
  )
}
```

---

## Component Composition Patterns

### Container/Presentation Split

- **Containers** (client): handle interactions, state, and server actions.
- **Presentational** (server whenever possible): render UI based on props.

```tsx
// Server Component
import { Suspense } from 'react'
import { CustomerList } from './components/customer-list'

export async function CustomersFeature() {
  const customers = await fetchCustomers()
  return (
    <Suspense fallback={<div>Loading customers…</div>}>
      <CustomerList customers={customers} />
    </Suspense>
  )
}
```

```tsx
// Client Component
'use client'

import { useOptimistic } from 'react'
import type { Customer } from '../types'
import { removeCustomer } from '../api/mutations'

export function CustomerList({ customers }: { customers: Customer[] }) {
  const [optimisticCustomers, setOptimisticCustomers] = useOptimistic(customers)

  async function handleDelete(id: string) {
    setOptimisticCustomers((prev) => prev.filter((customer) => customer.id !== id))
    await removeCustomer(id)
  }

  return (
    <ul className="space-y-2">
      {optimisticCustomers.map((customer) => (
        <li key={customer.id} className="flex items-center justify-between">
          <span>{customer.name}</span>
          <button onClick={() => handleDelete(customer.id)} className="text-sm text-destructive">
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}
```

### Compound Components

Use composition and slots rather than prop drilling.

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border p-4">{children}</div>
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 flex items-center justify-between">{children}</div>
}

Card.Title = function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>
}

Card.Content = function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
}
```

---

## React 19 Hooks

### `useActionState`

Manages pending state and results from Server Actions or async functions.

```tsx
'use client'

import { useActionState } from 'react'
import { updateSettings } from '@/features/settings/api/mutations'

type State = { error?: string; success?: string }

export function SettingsForm({ defaults }: { defaults: Record<string, string> }) {
  const [state, formAction, pending] = useActionState<State, FormData>(updateSettings, {})

  return (
    <form action={formAction} className="space-y-4">
      <input name="timezone" defaultValue={defaults.timezone} className="input" />
      {state.error && <p className="text-destructive text-sm">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn">
        {pending ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
```

### `useOptimistic`

Apply optimistic UI updates while awaiting server confirmation.

```tsx
'use client'

import { useOptimistic } from 'react'
import { toggleComplete } from '@/features/tasks/api/mutations'
import type { Task } from '../types'

export function TaskChecklist({ tasks }: { tasks: Task[] }) {
  const [state, setState] = useOptimistic(tasks)

  async function handleToggle(task: Task) {
    setState((prev) => prev.map((item) => (item.id === task.id ? { ...item, completed: !item.completed } : item)))
    await toggleComplete(task.id, !task.completed)
  }

  return state.map((task) => (
    <button key={task.id} onClick={() => handleToggle(task)} className="flex items-center gap-2">
      <span className="h-4 w-4 rounded border" data-complete={task.completed} />
      <span className={task.completed ? 'line-through text-muted-foreground' : ''}>{task.title}</span>
    </button>
  ))
}
```

### `use`

Unwrap promises inside Server Components or synchronous layouts.

```tsx
import { use } from 'react'
import { getBusiness } from '@/features/business/api/queries'

export function BusinessHeader({ resource }: { resource: Promise<{ name: string }> }) {
  const business = use(resource)
  return <h1 className="text-2xl font-semibold">{business.name}</h1>
}
```

### Transitions (`useTransition`, `startTransition`)

Keep UI responsive during background updates.

```tsx
'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function FilterTabs({ tabs }: { tabs: { label: string; href: string }[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.href}
          onClick={() => startTransition(() => router.push(tab.href))}
          className="btn"
          data-pending={pending}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
```

### Other Hooks Cheat Sheet

| Hook | Where | Purpose |
| --- | --- | --- |
| `useFormStatus` | Client (React DOM) | Consume pending state inside nested component of a `<form>` using Server Actions. |
| `useDeferredValue` | Client | Lag a value for expensive computations. |
| `useMemo`, `useCallback` | Client | Memoize calculations/handlers passed to children. Use sparingly—prefer structural memoization. |
| `useSyncExternalStore` | Client | Subscribe to external store without tearing. |

---

## Event & Form Handling

- Always use semantic elements (`<form>`, `<button>`) for accessibility.
- For Server Actions, prefer `useActionState` or `useFormStatus` over manual pending flags.
- For client-side-only forms, integrate React Hook Form + Zod (see Forms Patterns).

```tsx
'use client'

import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn">
      {pending ? 'Processing…' : 'Submit'}
    </button>
  )
}
```

---

## Suspense & Streaming

- Wrap slow components in `<Suspense>` blocks with meaningful fallbacks.
- Use `cache()` for shared async functions so results are reused across components.
- Throwing a promise inside a Server Component automatically suspends at the nearest `Suspense` boundary.

```tsx
import { Suspense } from 'react'
import { RevenueChart } from '@/features/analytics/revenue-chart'

export function AnalyticsPanel() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading analytics…</div>}>
      <RevenueChart />
    </Suspense>
  )
}
```

---

## Performance Patterns

- **Memoize data fetchers** with `cache()` instead of wrapping components in `memo`.
- **Use `updateTag` and `revalidatePath`** in Server Actions to keep server data fresh so clients don’t need manual re-fetches.
- **Prefer transitions** for navigation or expensive client-side state changes to keep the UI responsive.
- **Split code** via dynamic imports for heavy client widgets (charts, maps) with `next/dynamic`.
- **React.memo** is still useful for pure client components receiving stable props, but only add it when profiling shows re-render pressure.

---

## Detection Commands

```bash
# Find client components missing directive while using client-only hooks
rg "(useState|useEffect|useActionState|useOptimistic|useTransition|useReducer|useDeferredValue)" features --type tsx \
  | xargs -I{} sh -c "grep -L \"'use client'\" {}"

# Assert server components never import client-only helpers
rg "'use client'" features --files-with-matches | while read file; do \
  grep -H "createClient" "$file"; \
done

# Locate synchronous layouts/pages not awaiting params promises
rg "params\.[a-zA-Z]" app --type tsx | grep -v "await params" | grep -v "use(params)"

# Identify client components over 200 lines (split them)
find features -name '*.tsx' -exec sh -c 'lines=$(wc -l < "$1"); [ $lines -gt 200 ] && echo "$1: $lines"' _ {} \;
```

---

## Complete Examples

### Optimistic Toggle with Server Action

```tsx
'use client'

import { useOptimistic } from 'react'
import type { Notification } from '../types'
import { toggleNotification } from '../api/mutations'

export function NotificationToggle({ notification }: { notification: Notification }) {
  const [state, setState] = useOptimistic(notification)

  async function handleToggle(formData: FormData) {
    setState((current) => ({ ...current, enabled: !current.enabled }))
    await toggleNotification(formData)
  }

  return (
    <form action={handleToggle} className="flex items-center gap-2">
      <input type="hidden" name="id" value={state.id} />
      <button type="submit" className="btn" data-enabled={state.enabled}>
        {state.enabled ? 'Disable' : 'Enable'}
      </button>
    </form>
  )
}
```

### Suspense Boundary with Streaming Child

```tsx
// Server Component
import { Suspense } from 'react'
import { AppointmentTimeline } from './appointment-timeline'

export function AppointmentPanel({ businessId }: { businessId: string }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Today</h2>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading timeline…</div>}>
        <AppointmentTimeline businessId={businessId} />
      </Suspense>
    </section>
  )
}
```

---

## Quick Reference Checklist

- [ ] Server Components fetch data directly and stay side-effect free.
- [ ] Client Components declare `'use client'`, remain small, and accept data via props.
- [ ] `useActionState` + `useFormStatus` power Server Action forms instead of manual pending flags.
- [ ] `useOptimistic` controls optimistic lists; fallback state is provided.
- [ ] Suspense boundaries wrap every slow child with meaningful fallbacks.
- [ ] `params` promises are always awaited or unwrapped with `use()`.
- [ ] Complex client logic is split into composable hooks/components (<200 lines).
- [ ] No direct Supabase or secret access from client modules.
- [ ] Detection commands run clean with zero violations.

---

**Last Updated:** 2025-10-19
