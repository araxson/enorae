# CLAUDE.md

Quick reference for Claude Code. **For comprehensive patterns, read `docs/rules/`**

**Never edit:** `components/ui/*`, `app/globals.css`, `lib/types/database.types.ts`

---

## Essential Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm typecheck        # MUST pass before commits

# Database
pnpm db:types         # Generate types from Supabase

# Validation
pnpm lint:shadcn      # Check shadcn/ui compliance
```

---

## Critical Rules

### 1. NEVER Edit These Files
- ❌ `lib/types/database.types.ts` - Auto-generated
- ❌ `components/ui/*` - shadcn/ui primitives (import only)
- ❌ `app/globals.css` - Locked

### 2. NEVER Create Bulk Fix Scripts
Always make targeted, specific changes.

### 3. Pages Are Thin Shells (5-15 Lines)
```tsx
// ✅ CORRECT
import { Suspense } from 'react'
import { DashboardFeature } from '@/features/business/dashboard'

export default async function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardFeature />
    </Suspense>
  )
}
```

### 4. Server Directives Required
```ts
import 'server-only'  // queries.ts
'use server'          // mutations.ts
'use client'          // client components
```

### 5. Always Use getUser() for Auth
```ts
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Unauthorized')
```
### 5. Server Directives Required
Always use supabase mcp for fixing do not assume
---

## Portal Structure

```
app/
├── (marketing)/     # Public pages
├── (customer)/      # Customer portal
├── (staff)/         # Staff portal
├── (business)/      # Business portal
└── (admin)/         # Admin portal
```

---

## Feature Structure

```
features/{portal}/{feature}/
├── api/
│   ├── queries/
│   │   ├── index.ts          # Re-exports
│   │   └── [domain].ts       # Query functions (< 300 lines)
│   ├── mutations/
│   │   ├── index.ts          # Re-exports
│   │   └── [action].ts       # Mutations (< 300 lines)
│   ├── types.ts              # API types (< 200 lines)
│   ├── schema.ts             # Zod schemas (< 250 lines)
│   └── constants.ts          # Constants (< 100 lines)
├── components/               # Components (< 200 lines each)
├── hooks/                    # Hooks (< 150 lines)
└── index.tsx                 # Export (< 50 lines)
```

**File Limits:** Components < 200, Queries/Mutations < 300, Index < 50

---

## Database Pattern

### Read from Views
```ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getData(userId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  return supabase.from('view_name').select('*')  // ✅ View
}
```

### Write to Schema Tables
```ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function create(data: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.schema('organization').from('salons').insert(data)
  revalidatePath('/salons')
}
```

**Database Schemas:**
- `organization` - Salons, staff, locations
- `catalog` - Services, pricing
- `scheduling` - Appointments
- `identity` - Users, profiles, auth
- `communication` - Messages
- `analytics` - Metrics
- `engagement` - Reviews

---

## Next.js 16 Patterns

### Async Params
```tsx
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ query?: string }>
}) {
  const { id } = await params
  const { query } = await searchParams
  return <Feature id={id} query={query} />
}
```

### Async Request APIs
```ts
const cookieStore = await cookies()
const headersList = await headers()
```

---

## UI Patterns (shadcn/ui)

### Use Semantic Components
- Statistics → Chart components (not Cards)
- Navigation → Tabs, Accordion (not Card groups)
- Actions → Alert, Dialog, Sheet (not Cards)
- Data → Table, Data Table (not Card lists)

### Use Slots As-Is
```tsx
// ✅ CORRECT
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent className="flex gap-4">
    <Button>Action</Button>
  </CardContent>
</Card>

// ❌ WRONG - Custom styling on slots
<CardTitle className="text-2xl font-bold">  // ❌ NO
```

### Never Import Typography
```tsx
// ❌ WRONG
import { H1, H2 } from '@/components/ui/typography'

// ✅ CORRECT
<h1 className="text-3xl font-bold">Heading</h1>
```

---

## Pre-Commit Checklist

1. ✅ `pnpm typecheck` - Must pass
2. ✅ Auth guards with `getUser()`
3. ✅ Server directives present
4. ✅ Pages < 15 lines
5. ✅ No `any` types
6. ✅ Revalidate paths after mutations

---

## Comprehensive Documentation

Read `docs/rules/` for detailed patterns:

| File | Topic |
|------|-------|
| `architecture.md` | Naming, structure, file limits |
| `architecture.md` | ENORAE architecture patterns |
| `architecture.md` | File splitting strategies |
| `nextjs.md` / `nextjs.md` | Next.js patterns |
| `react.md` | React hooks, Server Components |
| `typescript.md` | Type safety, strict mode |
| `supabase.md` | Auth, database, RLS |
| `ui.md` | shadcn/ui patterns |
| `forms.md` | React Hook Form + Zod |

---

## Available Agents

Specialized agents in `.claude/agents/`:
- `performance-fixer` - Performance bottlenecks
- `security-fixer` - Security audit
- `type-safety-fixer` - Type issues
- `ui-pattern-enforcer` - shadcn/ui compliance
- `architecture-fixer` - Architecture violations
- `form-validation-fixer` - Form patterns
- `accessibility-fixer` - A11y issues
- `dead-code-fixer` - Unused code
- `import-dependency-fixer` - Import cleanup

---

## Tech Stack

- Next.js 16.0.0 + Turbopack
- React 19.2.0
- TypeScript 5.x (strict mode)
- Supabase 2.47.15
- pnpm
