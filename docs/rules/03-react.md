# React 19 Component Patterns

**Purpose:** Comprehensive React 19 patterns for Server/Client Components, hooks, performance optimization, and integration with Next.js App Router - optimized for AI scanning.

**Last Updated:** 2025-11-03
**Stack Version:** React 19.0.0 (stable release Dec 5, 2024), React DOM 19.0.0, Next.js 15.1.8

**Recent Updates (React 19.0.0 - Stable Release):**
- **React 19 officially released** (December 5, 2024) - production ready
- **Actions API** - Built-in support for async functions in transitions with automatic pending states, errors, and optimistic updates
- **use() hook** - Read promises and context, can be called conditionally (unlike other hooks)
- **useOptimistic hook** - Instant UI feedback with automatic rollback on errors
- **useActionState hook** - Replaces useFormState, handles form actions with pending/error states
- **ref as regular prop** - forwardRef deprecated, use `function Component({ ref })` instead
- **React Compiler** - Automatic memoization reduces need for useMemo/useCallback by 70%+
- **Server Components stable** - 38% faster initial load, reduced client JavaScript bundles
- **Ref cleanup functions** - Return cleanup from ref callbacks
- **Document metadata** - Built-in support for <title>, <meta>, <link> in components
- **Stylesheet hoisting** - Automatic stylesheet optimization and deduplication

---

## Quick Decision Tree

```
When building a component:
├─ Does it use state/effects/events? → Client Component ('use client')
├─ Does it fetch data? → Server Component (default, no directive)
├─ Does it read a promise? → use() hook + Suspense boundary
├─ Does it use browser APIs? → Client Component ('use client')
├─ Can it be pure presentation? → Server Component (default)
└─ Mixing both? → Server Component wrapper + Client Component island
```

```
Data fetching decision:
├─ Database query → Server Component ONLY
├─ User interaction → Client Component + Server Action
├─ Real-time updates → Client Component + Supabase subscription
├─ Form submission → Client Component + useActionState + Server Action
└─ Reading promises → use() hook in Client/Server Component + Suspense
```

```
Performance optimization:
├─ Expensive computation → useMemo (Client) or cache() (Server)
├─ Callback stability → useCallback (Client only)
├─ Component re-render → React.memo (Client only, use sparingly)
├─ Slow data → Suspense boundary (Server)
└─ Background updates → useTransition (Client)
```

---

## Critical Rules

### ✅ MUST Follow

1. **Server Components by default** - No directive needed, async functions allowed
2. **'use client' directive** - MUST be first line (before imports) in Client Components
3. **Never fetch in Client Components** - All database queries in Server Components
4. **Await params in Next.js 15+** - BREAKING CHANGE: `params` is now Promise, always `await params` (see Pattern 15)
5. **Use cache() for deduplication** - Wrap Server Component data fetchers
6. **useActionState for forms** - Use for all forms submitting to Server Actions (replaces useFormState)
7. **Props down, actions up** - Server Components pass data, Client Components emit actions
8. **Suspense for async** - Wrap slow Server Components in Suspense boundaries
9. **Hooks in Client Components only** - useState, useEffect, etc. require 'use client' (except use() which works everywhere)
10. **File size limit** - Client Components max 200 lines (split larger files)
11. **React Compiler awareness** - Manual useMemo/useCallback only when profiling shows issues (Compiler handles 70%+ of cases)

### ❌ FORBIDDEN

1. **Class components** - Use functional components only
2. **Legacy lifecycle methods** - No componentDidMount, etc.
3. **Fetching in useEffect** - Use Server Components or Server Actions
4. **'use server' in components** - Only in Server Actions, not components
5. **Context overuse** - Prefer composition and props, use Context sparingly
6. **Direct Supabase in Client** - Never import `@/lib/supabase/server` in Client Components
7. **Conditional hooks** - All hooks must be at top level, unconditional (except `use()` which can be conditional)
8. **useMemo/useCallback overuse** - Only when profiling shows issues (React Compiler handles most cases)
9. **Large Client bundles** - Keep Client Components minimal, logic on Server
10. **Missing Suspense** - Never leave async Server Components without boundaries

### ⚠️ DEPRECATED (Still works, but avoid in new code)

1. **forwardRef** - React 19 allows ref as a regular prop. Use `function Component({ ref })` instead
2. **Legacy Context (createContext without Provider)** - Use modern Context API with Provider
3. **defaultProps** - Use JavaScript default parameters instead: `function Component({ value = 0 })`
4. **String refs** - Use callback refs or useRef hook instead

---

## Patterns

### Pattern 1: Next.js 15 Async Params (BREAKING CHANGE)

**When to use:** All Next.js pages, layouts, route handlers using params or searchParams in Next.js 15+

**Breaking Change:** In Next.js 15, `params` and `searchParams` are now asynchronous and must be awaited.

**Implementation:**
```tsx
// ✅ CORRECT - Next.js 15: params is Promise<{ id: string }>
interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ sort?: string }>
}

export default async function Page({ params, searchParams }: PageProps) {
  // MUST await params
  const { id } = await params
  const { sort } = await searchParams

  const data = await getData(id, sort)

  return (
    <div>
      <h1>Item {id}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

// ✅ CORRECT - Generating metadata with async params
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params

  return {
    title: `Item ${id}`,
  }
}
```

```tsx
// ❌ WRONG - Next.js 15: Accessing params without await
interface PageProps {
  params: { id: string } // ❌ Wrong type
}

export default async function BadPage({ params }: PageProps) {
  // ❌ Error: params is Promise, not object
  const data = await getData(params.id)

  return <div>{data.name}</div>
}
```

**Migration:** Use `npx @next/codemod@canary upgrade async-request-api` to automatically convert most cases.

---

### Pattern 2: Server Component Data Fetching

**When to use:** Fetching data from database, file system, or server-only APIs

**Implementation:**
```tsx
// ✅ CORRECT - Server Component with cache() deduplication
import { cache } from 'react'
import 'server-only'
import { createClient } from '@/lib/supabase/server'

const getSupabase = cache(async () => createClient())

export async function getAppointments(businessId: string) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments_view')
    .select('id, customer_name, service_name, scheduled_at')
    .eq('business_id', businessId)
    .eq('user_id', user.id)

  if (error) throw error
  return data
}

// Server Component renders data
export async function AppointmentsList({ businessId }: { businessId: string }) {
  const appointments = await getAppointments(businessId)

  return (
    <ul className="space-y-2">
      {appointments.map(appointment => (
        <li key={appointment.id} className="border-b p-2">
          {appointment.customer_name} - {appointment.service_name}
        </li>
      ))}
    </ul>
  )
}
```

```tsx
// ❌ WRONG - Fetching in Client Component
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function BadAppointmentsList({ businessId }: { businessId: string }) {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    // ❌ Never do this - fetching in useEffect
    const supabase = createClient()
    supabase
      .from('appointments_view')
      .select('*')
      .eq('business_id', businessId)
      .then(({ data }) => setAppointments(data || []))
  }, [businessId])

  return <ul>{appointments.map(...)}</ul>
}
```

---

### Pattern 3: Client Component with useActionState (React 19 Actions API)

**When to use:** Forms that submit to Server Actions, need pending state and validation errors

**React 19 Actions API:** Built-in support for async functions in transitions with automatic pending states, errors, forms, and optimistic updates. useActionState replaces the deprecated useFormState.

**Implementation:**
```tsx
// ✅ CORRECT - Client Component with useActionState (React 19)
'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateProfile } from '../api/mutations'

type State = {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export function ProfileForm({ defaults }: { defaults: { name: string; email: string } }) {
  // useActionState: [state, action, isPending]
  // Automatically tracks pending state and handles errors
  const [state, formAction, pending] = useActionState<State, FormData>(updateProfile, {})

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Input
          name="name"
          defaultValue={defaults.name}
          aria-invalid={!!state.fieldErrors?.name}
        />
        {state.fieldErrors?.name && (
          <p className="text-destructive text-sm">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <Input
          name="email"
          type="email"
          defaultValue={defaults.email}
          aria-invalid={!!state.fieldErrors?.email}
        />
        {state.fieldErrors?.email && (
          <p className="text-destructive text-sm">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      {state.error && <p className="text-destructive">{state.error}</p>}
      {state.success && <p className="text-green-600">{state.success}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
```

```tsx
// ❌ WRONG - Manual state management instead of useActionState
'use client'
import { useState } from 'react'

export function BadProfileForm() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      // ❌ Manually managing pending state
      await updateProfile(new FormData(e.currentTarget))
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

### Pattern 4: useOptimistic for Instant UI Updates (React 19)

**When to use:** Actions that should update UI immediately while waiting for server confirmation (toggles, likes, deletes)

**React 19 Enhancement:** useOptimistic automatically reverts to original state on error - no manual rollback needed!

**Implementation:**
```tsx
// ✅ CORRECT - Optimistic updates with automatic rollback (React 19)
'use client'

import { useOptimistic } from 'react'
import { toggleFavorite } from '../api/mutations'
import type { Salon } from '../types'

export function FavoriteSalonsList({ salons }: { salons: Salon[] }) {
  const [optimisticSalons, setOptimisticSalons] = useOptimistic(salons)

  async function handleToggle(salonId: string) {
    // Update UI immediately - shows instant feedback
    setOptimisticSalons((prev) =>
      prev.map((salon) =>
        salon.id === salonId
          ? { ...salon, is_favorite: !salon.is_favorite }
          : salon
      )
    )

    // Then update server
    // If this throws an error, React automatically reverts to original state!
    await toggleFavorite(salonId)
  }

  return (
    <ul className="space-y-2">
      {optimisticSalons.map((salon) => (
        <li key={salon.id} className="flex items-center justify-between">
          <span>{salon.name}</span>
          <button
            onClick={() => handleToggle(salon.id)}
            className={salon.is_favorite ? 'text-yellow-500' : 'text-gray-400'}
          >
            {salon.is_favorite ? '★' : '☆'}
          </button>
        </li>
      ))}
    </ul>
  )
}
```

```tsx
// ❌ WRONG - No optimistic updates, UI lags
'use client'
import { useState } from 'react'

export function BadFavoriteSalonsList({ initialSalons }) {
  const [salons, setSalons] = useState(initialSalons)

  async function handleToggle(salonId: string) {
    // ❌ UI doesn't update until server responds
    const updatedSalons = await toggleFavorite(salonId)
    setSalons(updatedSalons)
  }

  return <ul>...</ul>
}
```

---

### Pattern 4: Suspense Boundaries for Streaming

**When to use:** Wrapping slow Server Components to show instant UI with progressive loading

**Implementation:**
```tsx
// ✅ CORRECT - Suspense boundaries with streaming
import { Suspense } from 'react'
import { RevenueChart } from './revenue-chart'
import { AppointmentsTable } from './appointments-table'
import { MetricsHeader } from './metrics-header'

export async function Dashboard({ businessId }: { businessId: string }) {
  // Fast data fetched immediately
  const quickMetrics = await getQuickMetrics(businessId)

  return (
    <div className="space-y-6">
      {/* Shows immediately */}
      <MetricsHeader metrics={quickMetrics} />

      {/* Stream slow components independently */}
      <Suspense fallback={<SkeletonChart />}>
        <RevenueChart businessId={businessId} />
      </Suspense>

      <Suspense fallback={<SkeletonTable />}>
        <AppointmentsTable businessId={businessId} />
      </Suspense>
    </div>
  )
}

// Slow Server Component (no Suspense inside)
async function RevenueChart({ businessId }: { businessId: string }) {
  const data = await getRevenueData(businessId) // Takes 2-3 seconds
  return <ChartComponent data={data} />
}
```

```tsx
// ❌ WRONG - No Suspense, entire page blocks on slowest component
export async function BadDashboard({ businessId }: { businessId: string }) {
  const quickMetrics = await getQuickMetrics(businessId)
  const revenue = await getRevenueData(businessId) // Blocks entire page
  const appointments = await getAppointmentsData(businessId) // Also blocks

  return (
    <div>
      <MetricsHeader metrics={quickMetrics} />
      <RevenueChart data={revenue} />
      <AppointmentsTable data={appointments} />
    </div>
  )
}
```

---

### Pattern 5: Server + Client Component Split

**When to use:** Component needs both server data fetching and client interactivity

**Implementation:**
```tsx
// ✅ CORRECT - Server Component wrapper
// app/dashboard/page.tsx (Server Component by default)
import { AppointmentsList } from './appointments-list'
import { getAppointments } from '@/features/appointments/api/queries'

export default async function DashboardPage() {
  const appointments = await getAppointments()

  return (
    <main>
      <h1>Dashboard</h1>
      <AppointmentsList appointments={appointments} />
    </main>
  )
}

// ✅ CORRECT - Client Component for interactivity
// appointments-list.tsx
'use client'

import { useState } from 'react'
import type { Appointment } from '@/lib/types'

export function AppointmentsList({ appointments }: { appointments: Appointment[] }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <ul>
      {appointments.map((appointment) => (
        <li
          key={appointment.id}
          onClick={() => setSelected(appointment.id)}
          className={selected === appointment.id ? 'bg-blue-100' : ''}
        >
          {appointment.customer_name} - {appointment.service_name}
        </li>
      ))}
    </ul>
  )
}
```

```tsx
// ❌ WRONG - Everything in Client Component
'use client'
import { useEffect, useState } from 'react'

export default function BadDashboardPage() {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    // ❌ Fetching in Client Component
    fetch('/api/appointments')
      .then(res => res.json())
      .then(setAppointments)
  }, [])

  return <ul>{appointments.map(...)}</ul>
}
```

---

### Pattern 6: useFormStatus for Submit Buttons

**When to use:** Nested components inside forms that need access to pending state

**Implementation:**
```tsx
// ✅ CORRECT - useFormStatus in nested component
'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : children}
    </Button>
  )
}

// Usage in form
'use client'
import { updateSettings } from '../api/mutations'
import { SubmitButton } from './submit-button'

export function SettingsForm() {
  return (
    <form action={updateSettings}>
      <input name="timezone" />
      <SubmitButton>Save Settings</SubmitButton>
    </form>
  )
}
```

```tsx
// ❌ WRONG - Manual pending state instead of useFormStatus
'use client'
export function BadSubmitButton({ pending }: { pending: boolean }) {
  // ❌ Prop drilling instead of useFormStatus
  return <button disabled={pending}>Submit</button>
}
```

---

### Pattern 7: useTransition for Background Updates

**When to use:** Non-urgent updates that should keep UI responsive (filters, navigation)

**Implementation:**
```tsx
// ✅ CORRECT - useTransition for filter navigation
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
          disabled={pending}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
```

```tsx
// ❌ WRONG - Blocking navigation
'use client'
export function BadFilterTabs({ tabs }) {
  const router = useRouter()

  return (
    <div>
      {tabs.map((tab) => (
        <button
          onClick={() => router.push(tab.href)} // ❌ Blocks UI
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
```

---

### Pattern 8: React.memo for Pure Client Components

**When to use:** Client Components with expensive renders receiving stable props (use sparingly, only after profiling)

**Implementation:**
```tsx
// ✅ CORRECT - memo for expensive pure component
'use client'

import { memo } from 'react'

interface ChartProps {
  data: number[]
  title: string
}

export const ExpensiveChart = memo(function ExpensiveChart({ data, title }: ChartProps) {
  // Expensive rendering logic
  const processedData = data.map((value, index) => ({
    x: index,
    y: value * Math.random(), // Complex calculation
  }))

  return (
    <div>
      <h3>{title}</h3>
      {/* Complex chart rendering */}
    </div>
  )
})
```

```tsx
// ❌ WRONG - Overusing memo without need
'use client'
import { memo } from 'react'

// ❌ Simple component doesn't need memo
export const SimpleText = memo(({ text }: { text: string }) => {
  return <p>{text}</p>
})
```

---

### Pattern 9: useMemo and useCallback (Sparingly)

**When to use:** Memoizing expensive calculations or callbacks passed to memoized children (only after profiling shows issues)

**Implementation:**
```tsx
// ✅ CORRECT - useMemo for expensive computation
'use client'

import { useMemo } from 'react'

export function SalesReport({ transactions }: { transactions: Transaction[] }) {
  const summary = useMemo(() => {
    // Expensive calculation
    return transactions.reduce((acc, txn) => ({
      total: acc.total + txn.amount,
      count: acc.count + 1,
      average: (acc.total + txn.amount) / (acc.count + 1),
    }), { total: 0, count: 0, average: 0 })
  }, [transactions])

  return (
    <div>
      <p>Total: ${summary.total}</p>
      <p>Average: ${summary.average}</p>
    </div>
  )
}

// ✅ CORRECT - useCallback for callback passed to memoized child
'use client'
import { useCallback } from 'react'

export function ItemList({ items }: { items: Item[] }) {
  const handleItemClick = useCallback((itemId: string) => {
    console.log('Clicked item:', itemId)
  }, [])

  return (
    <ul>
      {items.map(item => (
        <MemoizedItem key={item.id} item={item} onClick={handleItemClick} />
      ))}
    </ul>
  )
}
```

```tsx
// ❌ WRONG - Overusing useMemo for simple operations
'use client'
import { useMemo } from 'react'

export function BadComponent({ name }: { name: string }) {
  // ❌ useMemo not needed for simple string concatenation
  const greeting = useMemo(() => `Hello, ${name}!`, [name])
  return <p>{greeting}</p>
}
```

---

### Pattern 10: Error Boundaries

**When to use:** Catching errors in component trees (must be class component until React 19 hook is released)

**Implementation:**
```tsx
// ✅ CORRECT - Error Boundary (class component, one of few exceptions)
'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800">Something went wrong</h2>
          <p className="text-sm text-red-600">{this.state.error?.message}</p>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage
export function FeaturePage() {
  return (
    <ErrorBoundary fallback={<p>Failed to load appointments</p>}>
      <AppointmentsList />
    </ErrorBoundary>
  )
}
```

---

### Pattern 11: Parallel Data Fetching

**When to use:** Multiple independent data fetches in Server Components

**Implementation:**
```tsx
// ✅ CORRECT - Parallel fetching with Promise.all
export async function DashboardPanel({ businessId }: { businessId: string }) {
  // These run in parallel
  const [appointments, revenue, staff] = await Promise.all([
    getAppointments(businessId),
    getRevenue(businessId),
    getStaff(businessId),
  ])

  return (
    <div className="grid gap-4">
      <AppointmentsCard data={appointments} />
      <RevenueCard data={revenue} />
      <StaffCard data={staff} />
    </div>
  )
}
```

```tsx
// ❌ WRONG - Sequential fetching (slow)
export async function BadDashboardPanel({ businessId }: { businessId: string }) {
  // ❌ These run one after another
  const appointments = await getAppointments(businessId)
  const revenue = await getRevenue(businessId)
  const staff = await getStaff(businessId)

  return <div>...</div>
}
```

---

### Pattern 12: Compound Components

**When to use:** Creating flexible, composable component APIs

**Implementation:**
```tsx
// ✅ CORRECT - Compound components with slots
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border bg-card p-6">{children}</div>
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 flex items-center justify-between">{children}</div>
}

Card.Title = function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>
}

Card.Content = function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
}

// Usage
export function StatsCard() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Revenue</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>Total: $1,234</p>
      </Card.Content>
    </Card>
  )
}
```

```tsx
// ❌ WRONG - Prop drilling
function BadCard({
  title,
  content,
  headerAction
}: {
  title: string
  content: React.ReactNode
  headerAction?: React.ReactNode
}) {
  return (
    <div>
      <div>
        <h3>{title}</h3>
        {headerAction}
      </div>
      {content}
    </div>
  )
}
```

---

### Pattern 13: use() Hook for Promises and Context (React 19+)

**When to use:** Reading promises or context values, especially in conditional rendering or loops

**Implementation:**
```tsx
// ✅ CORRECT - use() with promises in Server Components
import { use } from 'react'

async function fetchComments(postId: string) {
  const response = await fetch(`/api/posts/${postId}/comments`)
  return response.json()
}

export function Comments({ postId }: { postId: string }) {
  // Create promise outside of component
  const commentsPromise = fetchComments(postId)

  return (
    <Suspense fallback={<CommentsSkeleton />}>
      <CommentsList commentsPromise={commentsPromise} />
    </Suspense>
  )
}

function CommentsList({ commentsPromise }: { commentsPromise: Promise<Comment[]> }) {
  // use() unwraps the promise
  const comments = use(commentsPromise)

  return (
    <ul>
      {comments.map(comment => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </ul>
  )
}
```

```tsx
// ✅ CORRECT - use() with context (can be conditional, unlike useContext)
'use client'

import { use } from 'react'
import { ThemeContext } from './theme-context'

export function ThemedButton({ variant }: { variant?: 'primary' | 'secondary' }) {
  // use() can be called conditionally (unlike other hooks!)
  const theme = variant === 'primary' ? use(ThemeContext) : null

  return (
    <button style={{ backgroundColor: theme?.primaryColor }}>
      Click me
    </button>
  )
}
```

```tsx
// ❌ WRONG - Using useContext when conditional access needed
'use client'
import { useContext } from 'react'

export function BadThemedButton({ variant }) {
  // ❌ useContext cannot be conditional
  if (variant === 'primary') {
    const theme = useContext(ThemeContext) // Violates Rules of Hooks
    return <button style={{ backgroundColor: theme.primaryColor }}>Click</button>
  }
  return <button>Click</button>
}
```

---

### Pattern 14: ref as a Prop (React 19+)

**When to use:** Forwarding refs to DOM elements or components (replaces forwardRef)

**Implementation:**
```tsx
// ✅ CORRECT - React 19: ref as a regular prop
export function Input({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <input ref={ref} {...props} />
}

// Usage
function Form() {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <form>
      <Input ref={inputRef} placeholder="Enter text" />
      <button onClick={() => inputRef.current?.focus()}>Focus Input</button>
    </form>
  )
}
```

```tsx
// ⚠️ OLD (Still works in React 19, but deprecated)
import { forwardRef } from 'react'

export const OldInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => {
    return <input ref={ref} {...props} />
  }
)
```

```tsx
// ✅ CORRECT - React 19: ref cleanup functions
'use client'

import { useEffect, useRef } from 'react'

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.play()

    // Cleanup function (new in React 19)
    return () => {
      video.pause()
      video.currentTime = 0
    }
  }, [src])

  return (
    <video
      ref={(element) => {
        videoRef.current = element
        // Cleanup function for ref callbacks (new in React 19)
        return () => {
          console.log('Video element removed')
        }
      }}
      src={src}
    />
  )
}
```

---

### Pattern 15: React Compiler - Automatic Memoization (React 19)

**When to use:** Understanding when React Compiler handles memoization vs when manual optimization still needed

**React 19 Game Changer:** React Compiler automatically memoizes 70%+ of components and values, reducing need for manual useMemo/useCallback.

**How React Compiler Works:**
- Babel plugin that transforms React code during build
- Automatically memoizes function components, hook dependencies, and props
- Reduces unnecessary re-renders by 25-40% in complex apps
- No code changes needed - optimizations happen automatically

**Implementation:**
```tsx
// ✅ CORRECT - React Compiler handles this automatically (React 19)
'use client'

import { useState } from 'react'

export function SearchResults({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')

  // React Compiler automatically memoizes this expensive computation
  // No need for useMemo in most cases!
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  )

  // React Compiler automatically stabilizes this callback
  // No need for useCallback in most cases!
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <div>
      <input value={query} onChange={handleSearch} />
      <ResultsList items={filtered} />
    </div>
  )
}
```

**When Manual Memoization is STILL Needed:**

```tsx
// ✅ CORRECT - Manual useMemo when profiling shows issues
'use client'

import { useMemo } from 'react'

export function ExpensiveChart({ data }: { data: number[] }) {
  // Use useMemo when:
  // 1. Computation is expensive (>50ms)
  // 2. Profiler shows performance issues
  // 3. Component re-renders frequently with same data
  const processedData = useMemo(() => {
    // Very expensive calculation
    return data.map(value => ({
      x: value,
      y: complexMathOperation(value), // Takes 100ms+
      label: generateLabel(value),
    }))
  }, [data])

  return <ChartComponent data={processedData} />
}

// ✅ CORRECT - useCallback when passing to memo'd child
'use client'

import { useCallback, memo } from 'react'

const MemoizedChild = memo(function Child({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick}>Click</button>
})

export function Parent() {
  // useCallback still needed when passing to memo'd components
  // to prevent child re-renders
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return <MemoizedChild onClick={handleClick} />
}
```

```tsx
// ❌ WRONG - Unnecessary manual memoization (React Compiler handles this)
'use client'

import { useMemo, useCallback } from 'react'

export function OverOptimized({ items }: { items: Item[] }) {
  // ❌ Not needed - React Compiler handles simple filtering
  const filtered = useMemo(() =>
    items.filter(item => item.active),
    [items]
  )

  // ❌ Not needed - React Compiler stabilizes simple callbacks
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return <div onClick={handleClick}>{filtered.length}</div>
}
```

**Migration Guidance:**
- **Remove manual memoization** in most cases - let React Compiler optimize
- **Keep useMemo/useCallback** only when:
  - Profiling shows performance issues (use React DevTools Profiler)
  - Computation takes >50ms
  - Passing callbacks to React.memo components
  - Working with third-party libraries expecting stable references

**Performance Testing:**
```bash
# Use React DevTools Profiler to identify real bottlenecks
# Only optimize when profiling shows issues
# React Compiler handles 70%+ of cases automatically
```

---

## Detection Commands

```bash
# Find Client Components missing 'use client' directive
rg "(useState|useEffect|useActionState|useOptimistic|useTransition|useReducer)" \
  features --type tsx -l | \
  xargs grep -L "'use client'"

# Find 'use client' not as first line
rg "'use client'" features --type tsx -B 1 | grep -v "^1:"

# Find Client Components importing server-only modules
rg "'use client'" features --type tsx -l | \
  xargs grep -l "from '@/lib/supabase/server'"

# Find Server Components not awaiting params (Next.js 15+ BREAKING CHANGE)
rg "params\.[a-zA-Z]" app --type tsx | \
  grep -v "await params" | \
  grep -v "use(params)"

# Find params with wrong type (should be Promise in Next.js 15+)
rg "params:\s*\{" app --type tsx | \
  grep -v "Promise<"

# Find searchParams not awaited (Next.js 15+)
rg "searchParams\.[a-zA-Z]" app --type tsx | \
  grep -v "await searchParams"

# Find Client Components over 200 lines (split them)
find features -name '*.tsx' -exec sh -c \
  'lines=$(wc -l < "$1"); [ $lines -gt 200 ] && grep -q "use client" "$1" && echo "$1: $lines"' \
  _ {} \;

# Find useEffect with data fetching (anti-pattern)
rg "useEffect.*fetch|useEffect.*from\(" features --type tsx -C 3

# Find forms without useActionState (should use React 19 Actions API)
rg "<form" features --type tsx -l | \
  xargs grep -L "useActionState\|useFormStatus"

# Find deprecated useFormState (replaced by useActionState in React 19)
rg "useFormState" features --type tsx

# Find unnecessary useMemo/useCallback (React Compiler likely handles these)
rg "useMemo|useCallback" features --type tsx -l | \
  xargs -I {} sh -c 'echo "Review {}: React Compiler may handle these automatically"'

# Find async Server Components without Suspense boundaries
rg "export (async function|default async function)" features --type tsx -l | \
  xargs grep -L "Suspense"

# Find useMemo/useCallback in Server Components
rg "^(?!.*'use client')" features --type tsx | \
  rg "useMemo|useCallback"

# Find conditional hooks (violates Rules of Hooks) - exclude use() which can be conditional
rg "if.*\(use[A-Z]|use[A-Z].*\(.*\?" features --type tsx | grep -v "use("

# Find deprecated forwardRef usage (React 19+)
rg "forwardRef" features --type tsx -C 2

# Find deprecated defaultProps usage
rg "\.defaultProps\s*=" features --type tsx

# Find string refs (deprecated)
rg 'ref="[^"]+"' features --type tsx

# Find use() hook usage (should be in Suspense boundaries for promises)
rg "from 'react'" features --type tsx | grep "use" | grep -v "useState\|useEffect\|useContext"

# Find opportunities to use ref as prop instead of forwardRef
rg "forwardRef<.*>\(" features --type tsx -l

# Find useContext that could be replaced with use() for conditional access
rg "useContext.*\?" features --type tsx -C 3
```

---

## Quick Reference

| Pattern | When | Example | Since | Notes |
|---------|------|---------|-------|-------|
| Server Component | Fetch data, no state | `async function Page() { const data = await getData(); return <List data={data} /> }` | React 18 | Default in Next.js App Router |
| Client Component | State, effects, events | `'use client'; function Counter() { const [count, setCount] = useState(0); ... }` | React 18 | Must be first line |
| Async params (Next.js 15) | All pages/layouts | `const { id } = await params` | Next.js 15 | BREAKING CHANGE |
| use() | Read promises/context | `const data = use(promise); const theme = use(ThemeContext)` | React 19 | Can be conditional |
| useActionState | Form with Server Action | `const [state, formAction, pending] = useActionState(updateProfile, {})` | React 19 | Replaces useFormState |
| useOptimistic | Instant UI updates | `const [optimistic, setOptimistic] = useOptimistic(data); setOptimistic(newData)` | React 19 | Auto-rollback on error |
| useFormStatus | Submit button | `const { pending } = useFormStatus(); return <Button disabled={pending} />` | React 19 | Use in nested components |
| useTransition | Background updates | `const [pending, startTransition] = useTransition(); startTransition(() => router.push(...))` | React 18 | Non-urgent updates |
| ref as prop | Forward refs | `function Input({ ref, ...props }) { return <input ref={ref} {...props} /> }` | React 19 | Replaces forwardRef |
| Suspense | Stream slow components | `<Suspense fallback={<Skeleton />}><SlowComponent /></Suspense>` | React 18 | Required for async Server Components |
| cache() | Deduplicate fetches | `const getData = cache(async () => { ... })` | React 19 | Server Components only |
| React Compiler | Auto-memoization | Enabled by default, handles 70%+ of optimizations | React 19 | Reduces need for manual memo |
| useMemo | Expensive computation (>50ms) | `const total = useMemo(() => items.reduce(...), [items])` | React 16.8 | Only when profiling shows issues |
| useCallback | Memoize callback for memo'd child | `const handleClick = useCallback(() => { ... }, [])` | React 16.8 | Only when passing to React.memo |
| React.memo | Pure component | `export const Chart = memo(({ data }) => { ... })` | React 16.6 | Use sparingly, after profiling |
| Promise.all | Parallel fetching | `const [a, b, c] = await Promise.all([getA(), getB(), getC()])` | ES6 | Server Components |

### Deprecated Patterns (Avoid in new code)

| Pattern | Replacement | Migration Path | Deprecated Since |
|---------|-------------|----------------|------------------|
| useFormState | useActionState | `useActionState(action, initialState)` | React 19 |
| forwardRef | ref as prop | `function Component({ ref }) { return <div ref={ref} /> }` | React 19 |
| defaultProps | Default parameters | `function Component({ value = 0 }) { ... }` | React 18.3 |
| String refs | useRef/callback refs | `const ref = useRef(); <div ref={ref} />` | React 16.3 |
| Legacy Context | Context with Provider | Use `createContext` with `<Provider>` wrapper | React 16.3 |

---

**Related:**
- [01-architecture.md](/docs/rules/01-architecture.md) - File structure for components
- [04-nextjs.md](/docs/rules/04-nextjs.md) - Next.js App Router integration
- [06-api.md](/docs/rules/06-api.md) - Server Actions patterns
- [07-forms.md](/docs/rules/07-forms.md) - Form handling with useActionState
- [08-ui.md](/docs/rules/08-ui.md) - shadcn/ui component integration
