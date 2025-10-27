# Next.js Architecture & File Organization Patterns

**Universal architectural rules and file organization strategies for Next.js 15+ projects with feature-based organization.**

---

## Quick Reference

| What you need | Where to look |
|---------------|---------------|
| **Feature structure** | [Feature Folder Structure](#feature-folder-structure) |
| **Server/client rules** | [Critical Rules](#critical-rules) |
| **Auth patterns** | [Auth & Security](#auth--security) |
| **File splitting** | [When to Split Files](#when-to-split-files) |
| **Caching** | [Cache Strategies](#cache-strategies) |
| **Detection commands** | [Detection Commands](#detection-commands) |

---

## Stack

- **Next.js:** 15+ (App Router)
- **React:** 19+ (Server/Client Components)
- **TypeScript:** 5+ (Strict mode)
- **Database:** Supabase or similar (with SSR support)

---

## 🚨 Critical Rules - MUST FOLLOW

### 1. Pages Are Thin Shells (5-12 Lines)

```tsx
// ✅ CORRECT - Thin shell
import { Suspense } from 'react'
import { FeatureComponent } from '@/features/[portal]/[feature]'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <FeatureComponent {...props} />
    </Suspense>
  )
}

// ❌ FORBIDDEN - Business logic in page
export default async function Page() {
  const client = await createClient()  // ❌ NO
  const data = await client.from...    // ❌ NO
  return <div>{data}</div>             // ❌ NO
}
```

### 2. Always Use Verified Auth (NEVER Trust Client)

```tsx
// ✅ CORRECT - Server-side verification
const { data: { user } } = await client.auth.getUser()
if (!user) throw new Error('Unauthorized')

// ❌ FORBIDDEN - Client session can be spoofed
const { data: { session } } = await client.auth.getSession()  // ❌ INSECURE
```

### 3. Middleware ONLY Refreshes Sessions

```ts
// ✅ CORRECT - Only session refresh
export async function middleware(request: NextRequest) {
  return updateSession(request)  // Just refreshes tokens
}

// ❌ FORBIDDEN - Auth checks in middleware
export async function middleware(request: NextRequest) {
  const { data: { user } } = await client.auth.getUser()  // ❌ NO
  if (!user) return redirect('/login')                    // ❌ NO
}
```

**Do auth checks in Server Components/Route Handlers instead.**

### 4. Server Directives Required

```ts
// queries.ts - MUST have server-only
import 'server-only'  // ✅ REQUIRED

// mutations.ts - MUST start with 'use server'
'use server'  // ✅ REQUIRED (first line)

// Client components - MUST have 'use client'
'use client'  // ✅ REQUIRED (for hooks/events)
```

### 5. Params in Next.js 15+ Are Promises

```tsx
// ✅ CORRECT - Await params
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params  // ✅ Await the promise
  return <Feature id={id} />
}

// ❌ FORBIDDEN - Direct access
export default async function Page({ params }: { params: { id: string } }) {
  return <Feature id={params.id} />  // ❌ Runtime error
}
```

---

## Feature Folder Structure

### The Canonical Structure

```
features/
└── [portal]/                     # e.g., user, admin, dashboard
    └── [feature]/
        ├── api/
        │   ├── queries.ts        # ✅ Must: import 'server-only'
        │   └── mutations.ts      # ✅ Must: 'use server'
        ├── components/           # UI components (server/client)
        ├── schema.ts             # Zod validation schemas
        ├── types.ts              # TypeScript type aliases
        └── index.tsx             # Feature entry (Server Component)
```

**Golden Rule:** This is the starting point. Only deviate when file size becomes unmanageable.

**Rules:**
- `api/queries.ts` → Server-only reads from **database views/tables**
- `api/mutations.ts` → Server actions writing to **database tables**
- `components/` → Mix of server/client as needed
- `index.tsx` → Server Component shell, exports main feature

---

## When to Split Files

### File Size Thresholds

| File Type | Keep as Single | Consider Splitting | Must Split |
|-----------|----------------|-------------------|------------|
| `queries.ts` | < 300 lines | 300-500 lines | > 500 lines |
| `mutations.ts` | < 300 lines | 300-500 lines | > 500 lines |
| `components/` | < 200 lines/component | 200-400 lines | > 400 lines |
| `types.ts` | < 200 lines | 200-400 lines | > 400 lines |
| `schema.ts` | < 150 lines | 150-300 lines | > 300 lines |

### Signs You Need to Split

1. ✅ **Scrolling fatigue** - Taking >5 seconds to find a function
2. ✅ **Multiple concerns** - File handles 3+ distinct domains
3. ✅ **Merge conflicts** - Frequent git conflicts in same file
4. ✅ **Import bloat** - 20+ imports at the top
5. ✅ **Test complexity** - Hard to isolate for testing

---

## File Patterns

### queries.ts - Server-Only Reads

```ts
import 'server-only'  // ✅ REQUIRED
import { cache } from 'react'
import { createClient } from '@/lib/database/server'

const getClient = cache(async () => createClient())

export async function getItems(tenantId: string) {
  const client = await getClient()

  // ✅ ALWAYS verify auth
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await client
    .from('items_view')  // ✅ Query views or tables
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)  // ✅ Filter by user

  if (error) throw error
  return data
}
```

**Rules:**
- ✅ Import `'server-only'` first line
- ✅ Use verified auth check (never trust client session)
- ✅ Query from **database views or tables**
- ✅ Filter by `user.id` for multi-tenancy
- ✅ Wrap `createClient()` with `cache()`

### mutations.ts - Server Actions

```ts
'use server'  // ✅ REQUIRED (first line)

import { createClient } from '@/lib/database/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createItemSchema } from '../schema'

export async function createItem(input: unknown) {
  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // ✅ Validate with Zod
  const payload = createItemSchema.parse(input)

  // ✅ Write to database tables
  const { data, error } = await client
    .from('items')
    .insert({ ...payload, user_id: user.id })
    .select()
    .single()

  if (error) throw error

  // ✅ Cache invalidation
  revalidateTag('items')
  revalidatePath('/[portal]/items')

  // ✅ redirect() throws, so must be last
  redirect(`/[portal]/items/${data.id}`)
}
```

**Rules:**
- ✅ First line: `'use server'`
- ✅ Parse input with Zod
- ✅ Use verified auth check
- ✅ Write to **database tables**
- ✅ Call `revalidateTag()` or `revalidatePath()`
- ✅ `redirect()` must be last (it throws)

### types.ts - Type Aliases

```ts
import type { Database } from '@/lib/types/database.types'

export type ItemRow = Database['public']['Tables']['items']['Row']
export type ItemInsert = Database['public']['Tables']['items']['Insert']
export type ItemUpdate = Database['public']['Tables']['items']['Update']
```

**Rules:**
- ✅ Use generated database types
- ❌ Never hand-write database types

### schema.ts - Zod Validation

```ts
import { z } from 'zod'

export const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  quantity: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
})
```

**Rules:**
- ✅ Validate all network boundaries
- ✅ Use `.transform()` for type coercion

### index.tsx - Feature Entry

```tsx
import { Suspense } from 'react'
import { getItems } from './api/queries'
import { ItemList } from './components/item-list'

export async function ItemsFeature(props: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await props.params  // ✅ Await params
  const items = await getItems(tenantId)

  return (
    <Suspense fallback={<Skeleton />}>
      <ItemList items={items} />
    </Suspense>
  )
}
```

**Rules:**
- ✅ Server Component (async)
- ✅ Await `params` promise
- ✅ Wrap in `Suspense`

---

## Splitting Strategy: API Files

### Stage 1: Single File (< 300 lines)

```
api/
├── queries.ts      # All reads
└── mutations.ts    # All writes
```

**Example (`api/queries.ts`):**
```ts
import 'server-only'
import { createClient } from '@/lib/database/server'

// Domain A
export async function getItemsA(id: string) { ... }
export async function getItemAById(id: string) { ... }

// Domain B
export async function getItemsB(id: string) { ... }
export async function getItemBById(id: string) { ... }
```

---

### Stage 2: Grouped Queries (300-500 lines)

**When to use:** File is getting long but concerns are clear.

```
api/
├── queries/
│   ├── index.ts           # Re-export all
│   ├── domain-a.ts        # Domain A reads
│   ├── domain-b.ts        # Domain B reads
│   └── domain-c.ts        # Domain C reads
└── mutations/
    ├── index.ts           # Re-export all
    ├── domain-a.ts        # Domain A writes
    └── domain-b.ts        # Domain B writes
```

**Structure:**

`api/queries/domain-a.ts`:
```ts
import 'server-only'
import { createClient } from '@/lib/database/server'

export async function getItemsA(id: string) { ... }
export async function getItemAById(id: string) { ... }
export async function getItemAStats(id: string) { ... }
```

`api/queries/index.ts`:
```ts
// Re-export everything for clean imports
export * from './domain-a'
export * from './domain-b'
export * from './domain-c'
```

**Usage:**
```ts
// ✅ Import from index
import { getItemsA, getItemsB } from '@/features/[portal]/[feature]/api/queries'

// ❌ Don't import from subfiles
import { getItemsA } from '@/features/[portal]/[feature]/api/queries/domain-a'
```

---

### Stage 3: Domain Subfolders (> 500 lines)

**When to use:** Multiple distinct domains within the feature.

```
api/
├── queries/
│   ├── index.ts                    # Re-export all
│   ├── domain-a/
│   │   ├── index.ts               # Re-export domain
│   │   ├── get-list.ts
│   │   ├── get-by-id.ts
│   │   └── get-stats.ts
│   ├── domain-b/
│   │   ├── index.ts
│   │   ├── get-items.ts
│   │   └── get-summary.ts
│   └── domain-c/
│       └── index.ts
└── mutations/
    └── ...same pattern
```

**Structure:**

`api/queries/domain-a/get-list.ts`:
```ts
import 'server-only'
import { createClient } from '@/lib/database/server'

export async function getItemsA(tenantId: string) {
  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await client
    .from('items_view')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)

  if (error) throw error
  return data
}
```

`api/queries/domain-a/index.ts`:
```ts
export * from './get-list'
export * from './get-by-id'
export * from './get-stats'
```

`api/queries/index.ts`:
```ts
export * from './domain-a'
export * from './domain-b'
export * from './domain-c'
```

**Usage remains the same:**
```ts
// ✅ Still import from top-level
import { getItemsA, getItemsB } from '@/features/[portal]/[feature]/api/queries'
```

---

## Splitting Strategy: Components

### Stage 1: Flat Structure (< 10 components)

```
components/
├── item-table.tsx
├── item-card.tsx
├── item-filters.tsx
├── stats-card.tsx
└── empty-state.tsx
```

**Best for:** Simple features with few components.

---

### Stage 2: Grouped Components (10-20 components)

**When to use:** Clear functional groupings.

```
components/
├── table/
│   ├── item-table.tsx
│   ├── table-row.tsx
│   ├── table-filters.tsx
│   └── table-pagination.tsx
├── stats/
│   ├── stats-overview.tsx
│   ├── stats-card.tsx
│   └── stats-chart.tsx
├── item-card.tsx
└── empty-state.tsx
```

**Rules:**
- ✅ Group by UI concern (table, stats, forms)
- ✅ Keep related components together
- ❌ Don't nest more than 1 level
- ❌ Don't create single-file folders

---

### Stage 3: Feature Subcomponents (> 20 components)

**When to use:** Large, complex features.

```
components/
├── dashboard/
│   ├── index.tsx              # Main dashboard component
│   ├── metrics-section.tsx
│   ├── items-section.tsx
│   └── summary-section.tsx
├── table/
│   ├── index.tsx              # Main table component
│   ├── table-row.tsx
│   ├── table-filters.tsx
│   └── table-actions.tsx
├── forms/
│   ├── create-form.tsx
│   └── edit-form.tsx
└── shared/
    ├── stat-card.tsx
    └── empty-state.tsx
```

**Guidelines:**
- Each subfolder should have an `index.tsx` as the main component
- Related components live in the same folder
- Maximum 1 level of nesting
- "shared" folder for truly reusable components within feature

---

## Splitting Strategy: Types

### Stage 1: Single File (< 200 lines)

```
types.ts
```

**Example:**
```ts
// Database types
export interface Item {
  id: string
  tenant_id: string
  name: string
  description: string | null
  created_at: string
}

export type ItemStatus = 'active' | 'inactive' | 'archived'

// Component props
export interface ItemTableProps {
  items: Item[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

// API responses
export interface ItemStats {
  total: number
  active: number
  revenue: number
}
```

---

### Stage 2: Domain Types (200-400 lines)

```
types/
├── index.ts           # Re-export all
├── items.ts          # Item types
├── users.ts          # User types
└── stats.ts          # Statistics types
```

**Example (`types/items.ts`):**
```ts
export interface Item {
  id: string
  tenant_id: string
  name: string
  description: string | null
  status: ItemStatus
}

export type ItemStatus = 'active' | 'inactive' | 'archived'

export interface ItemTableProps {
  items: Item[]
  onEdit: (id: string) => void
}

export interface ItemStats {
  total: number
  active: number
}
```

`types/index.ts`:
```ts
export * from './items'
export * from './users'
export * from './stats'
```

**Usage:**
```ts
// ✅ Import from index
import { Item, User } from '@/features/[portal]/[feature]/types'
```

---

### Stage 3: Categorized Types (> 400 lines)

**For very large features only.**

```
types/
├── index.ts
├── database/
│   ├── index.ts
│   ├── items.ts
│   ├── users.ts
│   └── relations.ts
├── api/
│   ├── index.ts
│   ├── requests.ts
│   └── responses.ts
└── components/
    ├── index.ts
    ├── props.ts
    └── events.ts
```

---

## Splitting Strategy: Schemas

### Stage 1: Single File (< 150 lines)

```
schema.ts
```

**Example:**
```ts
import { z } from 'zod'

export const itemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  quantity: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
})

export const updateItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  quantity: z.coerce.number().min(0),
})

export const deleteItemSchema = z.object({
  id: z.string().uuid(),
})
```

---

### Stage 2: Domain Schemas (150-300 lines)

```
schemas/
├── index.ts              # Re-export all
├── items.ts             # Item schemas
├── users.ts             # User schemas
└── relations.ts         # Relation schemas
```

**Usage:**
```ts
// ✅ Import from index
import { itemSchema, updateItemSchema } from '@/features/[portal]/[feature]/schemas'
```

---

## Auth & Security

### ✅ CORRECT: Auth in Server Components

```tsx
// app/[portal]/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/database/server'

export default async function Page() {
  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()

  if (!user) redirect('/login')

  return <Dashboard userId={user.id} />
}
```

### ✅ CORRECT: Auth in Route Handlers

```ts
// app/api/items/route.ts
export async function GET() {
  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data } = await client
    .from('items_view')
    .select('*')
    .eq('user_id', user.id)

  return NextResponse.json(data)
}
```

### ❌ FORBIDDEN: Auth in Middleware

```ts
// ❌ DO NOT DO THIS
export async function middleware(request: NextRequest) {
  const client = createClient(...)
  const { data: { user } } = await client.auth.getUser()  // ❌ NO

  if (!user) return redirect('/login')  // ❌ NO
}
```

**Why middleware should only refresh sessions:**
- 🔒 More secure (auth check per route)
- ⚡ Better performance (no middleware latency)
- 🎯 Explicit auth logic
- 🛠️ Easier to debug

### Middleware Pattern (Session Refresh Only)

```ts
// middleware.ts
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/database/middleware'

export async function middleware(request: NextRequest) {
  return updateSession(request)  // Only refreshes tokens
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

---

## Cache Strategies

| Strategy | Tool | Context |
|----------|------|---------|
| **Immediate read-your-writes** | `updateTag('tag')` | Server Actions only. Next request blocks until data is refetched. |
| **On-demand revalidation** | `revalidateTag('tag')` | Route Handlers and Server Actions. Triggers next request to refresh lazily. |
| **Background revalidation** | `revalidateTag('tag', 'max')` | Stale-while-revalidate pattern for soft refreshes. |
| **Path invalidation** | `revalidatePath('/path')` | Invalidate all data for a page segment. |
| **Client refresh** | `refresh()` | Re-fetch the current page from a Server Action. |
| **Time-based TTL** | `export const revalidate = 60` | Automatically revalidate on interval. |
| **Ahead-of-time tagging** | `'use cache'` + `cacheTag('tag')` | Tag cached functions for later invalidation. |

> ⚠️ `updateTag` **only works inside Server Actions**. Use `revalidateTag(tag, 'max')` in Route Handlers.

### Examples

```ts
// Read-your-writes (Server Action only)
const { data } = await client
  .from('items')
  .insert(...)
  .select()
  .single()
updateTag('items')
updateTag(`item-${data.id}`)
redirect(`/items/${data.id}`)

// Route handler / background invalidation
await client.from('items').update(...)
revalidateTag('items', 'max')  // Stale-while-revalidate

// Path invalidation
await bulkUpdate()
revalidatePath('/dashboard')
```

**Tag naming conventions:**
- Collections: `'items'`, `'users'`
- Single resources: `'item-{id}'`, `'user-{id}'`

---

## Decision Tree

```
Start with canonical structure
    │
    ├── queries.ts < 300 lines? ───► Keep single file
    │   │
    │   └── NO ───► Split into queries/ folder
    │                │
    │                └── Still growing? ───► Add domain subfolders
    │
    ├── components/ < 10 files? ───► Keep flat
    │   │
    │   └── NO ───► Group by UI concern
    │                │
    │                └── > 20 files? ───► Add feature subfolders
    │
    └── types.ts < 200 lines? ───► Keep single file
        │
        └── NO ───► Split by domain
```

---

## Anti-Patterns to Avoid

### ❌ Don't: Over-engineer small features

```
features/[portal]/[feature]/
├── api/
│   └── mutations/
│       └── internal/
│           └── helpers/
│               └── create.ts    # 20 lines
```

**Fix:** Just use `api/mutations.ts`

---

### ❌ Don't: Create single-file folders

```
components/
├── header/
│   └── header.tsx           # Only file in folder
└── footer/
    └── footer.tsx           # Only file in folder
```

**Fix:**
```
components/
├── header.tsx
└── footer.tsx
```

---

### ❌ Don't: Nest more than 2 levels

```
api/
└── queries/
    └── internal/
        └── items/
            └── helpers/
                └── filters/
                    └── date-range.ts    # Too deep!
```

**Fix:** Extract helpers to shared utility or flatten structure.

---

### ❌ Don't: Split prematurely

```
api/
├── queries/
│   ├── get-user.ts          # 15 lines
│   └── get-profile.ts       # 20 lines
└── mutations/
    ├── update-user.ts       # 25 lines
    └── update-profile.ts    # 30 lines
```

**Fix:** Combine into single files until they exceed 300 lines.

---

## Detection Commands

Run these before committing:

```bash
# 1. queries.ts missing 'server-only'
rg --files -g 'queries.ts' features | xargs -I{} sh -c "grep -L \"import 'server-only'\" {}"

# 2. mutations.ts missing 'use server'
rg --files -g 'mutations.ts' features | xargs -I{} sh -c "grep -L \"'use server'\" {}"

# 3. Client components missing 'use client'
rg "(useState|useEffect|useReducer)" features --type tsx | xargs -I{} sh -c "grep -L \"'use client'\" {}"

# 4. Params accessed without await
rg "params\." app --type tsx | grep -v "await params" | grep -v "use(params)"

# 5. Route handlers > 120 lines
find app/api -name 'route.ts' -exec sh -c 'lines=$(wc -l < "$1"); [ $lines -gt 120 ] && echo "$1: $lines lines"' _ {} \;

# 6. Pages > 12 lines
find app -name 'page.tsx' -exec sh -c 'lines=$(wc -l < "$1"); [ $lines -gt 12 ] && echo "$1: $lines lines"' _ {} \;
```

**Zero violations required before commit.**

---

## Pre-Commit Checklist

**Architecture:**
- [ ] Pages are 5-12 lines (thin shells only)
- [ ] `params` are awaited: `const { id } = await props.params`
- [ ] Features use generated types from database
- [ ] Client components declare `'use client'` and are minimal

**Server/Client Directives:**
- [ ] `queries.ts` has `import 'server-only'` first line
- [ ] `mutations.ts` starts with `'use server'` first line
- [ ] Client components with hooks have `'use client'`

**Auth & Security:**
- [ ] **CRITICAL:** All auth uses verified method, never trust client
- [ ] All queries filter by `user.id` for multi-tenancy
- [ ] **CRITICAL:** Middleware ONLY refreshes sessions, NO auth checks
- [ ] Auth checks are in Server Components/Route Handlers

**Database:**
- [ ] Queries read from **database views or tables**
- [ ] Mutations write to **database tables**
- [ ] All inputs validated with Zod before database access

**Caching:**
- [ ] Mutations call `revalidateTag()` or `revalidatePath()`
- [ ] `redirect()` is last line (it throws)
- [ ] Cache tags are documented

**Quality:**
- [ ] All detection commands pass (zero matches)
- [ ] No business logic in pages or middleware
- [ ] Database clients created via shared helpers

---

## Import Patterns

### Always use index re-exports

**Bad:**
```ts
import { getItems } from '@/features/[portal]/[feature]/api/queries/items/get-list'
```

**Good:**
```ts
import { getItems } from '@/features/[portal]/[feature]/api/queries'
```

### Index.ts pattern

**Every subfolder needs index.ts:**

`api/queries/items/index.ts`:
```ts
export * from './get-list'
export * from './get-by-id'
export * from './get-stats'
```

`api/queries/index.ts`:
```ts
export * from './items'
export * from './users'
```

**Result:** Clean, simple imports regardless of internal structure.

---

## Summary Rules

1. **Start simple** - Single files until size demands splitting
2. **Split by domain** - Group related functions, not by operation type
3. **Use index.ts** - Always re-export for clean imports
4. **Max 2 levels** - Don't create deep nesting
5. **No single-file folders** - If folder has 1 file, eliminate folder
6. **300-line threshold** - Split when files exceed this
7. **Import from index** - Never import from subfiles directly
8. **Group related code** - Keep cohesive functions together
9. **Pages are thin** - 5-12 lines maximum
10. **Auth is server-side** - Always verify, never trust client

---

## Quick Reference Table

| Size | Structure | Example |
|------|-----------|---------|
| Small (< 300 lines) | Single file | `api/queries.ts` |
| Medium (300-500) | Flat subfiles | `api/queries/{domain}.ts` |
| Large (> 500) | Domain folders | `api/queries/{domain}/{operation}.ts` |

**When in doubt:** Keep it simple. Only add structure when pain is real.

---

**Version:** 1.0
**Last Updated:** 2025-10-26
**Framework:** Next.js 15+ with App Router
**Compatible with:** Supabase, any SSR-capable backend
