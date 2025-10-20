# Task-Based Guide

**Find what you need by what you want to do**. Each task links to relevant rules, workflows, and examples.

---

## "I want to create..."

### Create a New Feature
**What to read**:
1. [`domains/architecture.md`](./domains/architecture.md) - Feature structure
2. [`workflows/new-feature.md`](./workflows/new-feature.md) - Step-by-step guide
3. Portal-specific patterns (customer/business/staff/admin)

**Key rules**:
- [ARCH-H101](./03-QUICK-SEARCH.md#arch-h101) - Feature directory template
- [ARCH-P001](./03-QUICK-SEARCH.md#arch-p001) - Server-only directives
- [ARCH-P002](./03-QUICK-SEARCH.md#arch-p002) - Page file structure

**Pattern**:
```
features/{portal}/{feature}/
├── api/
│   ├── queries.ts     # import 'server-only'
│   └── mutations.ts   # 'use server'
├── components/
├── types.ts
├── schema.ts
└── index.tsx
```

**Checklist**:
- ✅ Created feature directory structure
- ✅ Added `import 'server-only'` to queries.ts
- ✅ Added `'use server'` to mutations.ts
- ✅ Page file is 5-15 lines, renders feature component
- ✅ Types imported from Database['public']['Views']

---

### Create a New Page/Route
**What to read**:
1. [`domains/nextjs.md`](./domains/nextjs.md#next-m301) - Page patterns
2. [`domains/architecture.md`](./domains/architecture.md#arch-p002) - Page structure

**Key rules**:
- [ARCH-P002](./03-QUICK-SEARCH.md#arch-p002) - Pages are 5-15 lines
- [NEXT-M301](./03-QUICK-SEARCH.md#next-m301) - Ultra-thin pages

**Pattern**:
```tsx
import { FeatureComponent } from '@/features/portal/feature'

export default async function Page() {
  return <FeatureComponent />
}
```

**Checklist**:
- ✅ Page imports feature component
- ✅ Page is 5-15 lines
- ✅ No business logic in page
- ✅ Uses async if needed for params

---

### Create a Database Query
**What to read**:
1. [`domains/database.md`](./domains/database.md) - All P-rules required
2. [`domains/security.md`](./domains/security.md#sec-p001) - Auth verification
3. [`workflows/database-changes.md`](./workflows/database-changes.md) - Workflow

**Key rules**:
- [DB-P001](./03-QUICK-SEARCH.md#db-p001) - Query public views
- [DB-P002](./03-QUICK-SEARCH.md#db-p002) - Auth verification required
- [SEC-P001](./03-QUICK-SEARCH.md#sec-p001) - Use verifySession()
- [TS-P001](./03-QUICK-SEARCH.md#ts-p001) - Proper types (no 'any')
- [ARCH-P001](./03-QUICK-SEARCH.md#arch-p001) - import 'server-only'

**Pattern**:
```ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']

export async function getAppointments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')  // Public view
    .select('*')
    .eq('customer_id', user.id)
    .returns<Appointment[]>()

  if (error) throw error
  return data
}
```

**Checklist**:
- ✅ File starts with `import 'server-only'`
- ✅ Auth check with getUser() or verifySession()
- ✅ Querying public view (not schema table)
- ✅ Using Database types (.returns<Type>())
- ✅ No 'any' types
- ✅ Error handling

---

### Create a Server Action (Mutation)
**What to read**:
1. [`domains/database.md`](./domains/database.md) - Mutation patterns
2. [`domains/security.md`](./domains/security.md) - Security checks
3. Create `schema.ts` with Zod validation

**Key rules**:
- [ARCH-P001](./03-QUICK-SEARCH.md#arch-p001) - 'use server' directive
- [DB-P002](./03-QUICK-SEARCH.md#db-p002) - Auth verification
- [DB-M302](./03-QUICK-SEARCH.md#db-m302) - Zod validation
- [DB-H103](./03-QUICK-SEARCH.md#db-h103) - revalidatePath
- [SEC-M302](./03-QUICK-SEARCH.md#sec-m302) - Validate payloads

**Pattern**:
```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createAppointmentSchema } from '../schema'

export async function createAppointment(input: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Validate with Zod
  const payload = createAppointmentSchema.parse(input)

  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert({
      ...payload,
      customer_id: user.id
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/customer/appointments')
  return data
}
```

**Checklist**:
- ✅ File starts with `'use server'`
- ✅ Auth check before mutation
- ✅ Zod validation with schema.parse()
- ✅ Inserting to schema table (not view)
- ✅ revalidatePath called after success
- ✅ Error handling

---

### Create a UI Component
**What to read**:
1. [`domains/ui.md`](./domains/ui.md) - All P-rules required
2. [`domains/accessibility.md`](./domains/accessibility.md) - Accessibility
3. [`domains/react.md`](./domains/react.md) - Server/Client boundaries

**Key rules**:
- [UI-P004](./03-QUICK-SEARCH.md#ui-p004) - No typography imports; use shadcn slots
- [UI-P002](./03-QUICK-SEARCH.md#ui-p002) - Complete shadcn compositions
- [REACT-P001](./03-QUICK-SEARCH.md#react-p001) - Server vs Client

**Pattern (Server Component)**:
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export async function FeatureCard() {
  const data = await getData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Summary</CardTitle>
        <CardDescription>Track bookings and sales performance</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <Badge variant="outline">+18%</Badge>
        <Button>View Details</Button>
      </CardContent>
    </Card>
  )
}
```

**Pattern (Client Component)**:
```tsx
'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function InteractiveCard({ data }: { data: Data }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Content</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{expanded ? data.full : data.preview}</p>
        <Button onClick={() => setExpanded(!expanded)} className="mt-4">
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
      </CardContent>
    </Card>
  )
}
```

**Checklist**:
- ✅ No `@/components/ui/typography` imports
- ✅ Use shadcn component slots (CardTitle, CardDescription, Badge, etc.)
- ✅ Complete compositions (DialogHeader, DialogTitle, etc.)
- ✅ Only colors from globals.css
- ✅ 'use client' only when needed for interactivity
- ✅ aria-label on grouped controls

---

### Create a Form
**What to read**:
1. [`domains/ui.md`](./domains/ui.md#ui-p002) - Form composition
2. [`domains/accessibility.md`](./domains/accessibility.md#a11y-m301) - Form accessibility
3. React Hook Form + Zod

**Key rules**:
- [A11Y-M301](./03-QUICK-SEARCH.md#a11y-m301) - Use Form primitives
- [A11Y-H103](./03-QUICK-SEARCH.md#a11y-h103) - FieldSet grouping
- [DB-M302](./03-QUICK-SEARCH.md#db-m302) - Zod validation

**Pattern**:
```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formSchema } from './schema'

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema)
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

**Checklist**:
- ✅ Using Form, FormField, FormItem primitives
- ✅ Zod schema for validation
- ✅ FormLabel and FormControl wired correctly
- ✅ FormMessage for errors
- ✅ FieldSet for grouped fields

---

## "I want to modify..."

### Modify Database Schema
**What to read**:
1. [`workflows/database-changes.md`](./workflows/database-changes.md) - Full workflow
2. [`domains/database.md`](./domains/database.md#db-p003) - RLS policies
3. [`domains/security.md`](./domains/security.md#sec-p003) - Security patterns

**Key rules**:
- [DB-P003](./03-QUICK-SEARCH.md#db-p003) - Multi-tenant RLS
- [SEC-P003](./03-QUICK-SEARCH.md#sec-p003) - Wrap auth.uid()
- [PERF-H101](./03-QUICK-SEARCH.md#perf-h101) - Index foreign keys

**Process**:
1. Create migration in Supabase
2. Add RLS policies with tenant filters
3. Wrap auth.uid() in (select auth.uid())
4. Add indexes for foreign keys
5. Run `npm run db:types` to regenerate types
6. Update queries to use new view/fields

**Checklist**:
- ✅ RLS policies enforce tenant scope
- ✅ auth.uid() wrapped in SELECT
- ✅ Foreign keys have indexes
- ✅ Types regenerated
- ✅ Queries updated

---

### Update Styling
**What to read**:
1. [`domains/ui.md`](./domains/ui.md) - All rules
2. [`reference/exclusions.md`](./reference/exclusions.md) - What NOT to edit

**Key rules**:
- [UI-H102](./03-QUICK-SEARCH.md#ui-h102) - Use @theme tokens
- Never edit `components/ui/*.tsx`
- Never edit `app/globals.css`

**Allowed**:
- ✅ Add Tailwind classes to your components
- ✅ Use colors from globals.css (bg-background, text-foreground, etc.)
- ✅ Use shadcn/ui component slots (CardTitle, Badge, etc.)
- ✅ Compose shadcn/ui components

**Not allowed**:
- ❌ Edit any file in `components/ui/`
- ❌ Edit `app/globals.css`
- ❌ Use arbitrary colors (bg-blue-500)
- ❌ Create custom CSS files

**Pattern**:
```tsx
// ✅ Use design tokens
<div className="bg-background text-foreground border-border">
  <H2 className="text-primary">Title</H2>
  <P className="text-muted-foreground">Description</P>
</div>

// ❌ Don't use arbitrary colors
<div className="bg-blue-500 text-white">
  <h2>Title</h2>
</div>
```

---

### Add TypeScript Types
**What to read**:
1. [`domains/typescript.md`](./domains/typescript.md#ts-p001) - Type safety
2. [`domains/database.md`](./domains/database.md#db-m301) - Database types

**Key rules**:
- [TS-P001](./03-QUICK-SEARCH.md#ts-p001) - No 'any'
- [TS-M302](./03-QUICK-SEARCH.md#ts-m302) - Use generated types
- [DB-M301](./03-QUICK-SEARCH.md#db-m301) - .returns<Type>()

**Pattern**:
```ts
// ✅ Use generated Supabase types
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']
type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert']
type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update']

// ✅ Use Zod for runtime validation
import { z } from 'zod'

const appointmentSchema = z.object({
  salon_id: z.string().uuid(),
  service_id: z.string().uuid(),
  scheduled_at: z.string().datetime()
})

type AppointmentInput = z.infer<typeof appointmentSchema>
```

**Checklist**:
- ✅ Using Database types for reads
- ✅ Using schema Insert/Update types for writes
- ✅ Zod schemas for validation
- ✅ No 'any' types
- ✅ Proper error handling with typed errors

---

## "I need to fix..."

### Fix Type Errors
**What to read**:
1. [`domains/typescript.md`](./domains/typescript.md) - All rules
2. [`workflows/debugging-checklist.md`](./workflows/debugging-checklist.md) - Common issues

**Common issues**:
- **"Type 'any' is not allowed"** → See [TS-P001](./03-QUICK-SEARCH.md#ts-p001)
- **"Cannot use 'eval' as identifier"** → See [TS-P002](./03-QUICK-SEARCH.md#ts-p002)
- **"Cannot use binding pattern in 'using'"** → See [TS-H101](./03-QUICK-SEARCH.md#ts-h101)

**Process**:
1. Run `npm run typecheck`
2. Fix errors starting with P-rules
3. Import proper types from Database['public']['Views']
4. Use Zod for unknown shapes
5. Re-run typecheck

---

### Fix Auth Issues
**What to read**:
1. [`domains/security.md`](./domains/security.md) - All P-rules
2. [`workflows/debugging-checklist.md`](./workflows/debugging-checklist.md#auth-issues)

**Common issues**:
- **"Unauthorized" errors** → See [SEC-P001](./03-QUICK-SEARCH.md#sec-p001)
- **Missing session** → Use verifySession(), not getSession()
- **RLS denying access** → Check [SEC-P003](./03-QUICK-SEARCH.md#sec-p003)

**Checklist**:
- ✅ Using getUser() or verifySession()
- ✅ Auth check before Supabase queries
- ✅ RLS policies have (select auth.uid())
- ✅ Middleware uses updateSession()

---

### Fix Performance Issues
**What to read**:
1. [`domains/performance.md`](./domains/performance.md) - All rules
2. [`workflows/debugging-checklist.md`](./workflows/debugging-checklist.md#performance)

**Common issues**:
- **Slow queries** → See [PERF-H101](./03-QUICK-SEARCH.md#perf-h101) (add indexes)
- **Client waterfalls** → See [REACT-P002](./03-QUICK-SEARCH.md#react-p002)
- **Large bundles** → See [REACT-L701](./03-QUICK-SEARCH.md#react-l701)

**Process**:
1. Check Supabase advisor for index recommendations
2. Use Promise.all for independent queries
3. Move data fetching to Server Components
4. Add revalidatePath after mutations

---

### Fix Accessibility Issues
**What to read**:
1. [`domains/accessibility.md`](./domains/accessibility.md) - All rules
2. shadcn/ui documentation for aria attributes

**Common issues**:
- **Missing labels** → See [A11Y-H101](./03-QUICK-SEARCH.md#a11y-h101)
- **Charts not accessible** → See [A11Y-H102](./03-QUICK-SEARCH.md#a11y-h102)
- **Form errors not announced** → See [A11Y-M301](./03-QUICK-SEARCH.md#a11y-m301)

**Checklist**:
- ✅ aria-label on ButtonGroup, ToggleGroup
- ✅ accessibilityLayer on charts
- ✅ Using Form primitives
- ✅ FieldSet for grouped fields

---

## "I want to understand..."

### How Authentication Works
**Read**:
1. [`domains/security.md`](./domains/security.md) - Complete security model
2. [`domains/database.md`](./domains/database.md#db-p002) - Auth in queries
3. lib/auth/ - Helper functions

**Key concepts**:
- Always use `verifySession()` or `getUser()`
- Never use `getSession()` (returns stale data)
- RLS policies filter by `(select auth.uid())`
- Middleware refreshes sessions with `updateSession()`
- Roles checked with `requireRole()`, `requireAnyRole()`

---

### How Database Access Works
**Read**:
1. [`domains/database.md`](./domains/database.md) - Complete database patterns
2. [`domains/security.md`](./domains/security.md#sec-p003) - RLS integration
3. lib/types/database.types.ts - Generated types

**Key concepts**:
- Query public views (not schema tables)
- Mutate schema tables via `.schema()`
- Types from Database['public']['Views']
- RLS enforces tenant isolation
- Every function needs auth check

---

### How Feature Architecture Works
**Read**:
1. [`domains/architecture.md`](./domains/architecture.md) - Complete architecture
2. [`workflows/new-feature.md`](./workflows/new-feature.md) - Step-by-step
3. Existing features in features/ - Examples

**Key concepts**:
- Features organized by portal (customer, business, staff, admin)
- Each feature has: api/, components/, types.ts, schema.ts, index.tsx
- queries.ts has `import 'server-only'`
- mutations.ts has `'use server'`
- Pages are thin (5-15 lines), render feature components

---

### How UI System Works
**Read**:
1. [`domains/ui.md`](./domains/ui.md) - Complete UI patterns
2. `app/globals.css` - Design tokens
3. `docs/shadcn-components/` - Local component docs

**Key concepts**:
- Import primitives from `@/components/ui/*` and fetch missing ones via the shadcn MCP
- Remove `@/components/ui/typography`; use shadcn slots (CardTitle, CardDescription, etc.) for text
- Follow documented compositions (DialogHeader + DialogTitle/Description, CardHeader + CardTitle/Description, etc.)
- Stick to design tokens from `app/globals.css`; no arbitrary Tailwind utilities
- Never edit `components/ui/` or `app/globals.css` directly—compose in feature code or raise an ADR

---

## Quick Reference Tables

### By Tech Stack

**Technology** | **Rules File** | **Common Tasks**
--- | --- | ---
Next.js 15 | [`domains/nextjs.md`](./domains/nextjs.md) | Pages, layouts, scripts
React 19 | [`domains/react.md`](./domains/react.md) | Server/Client boundaries
TypeScript 5.9 | [`domains/typescript.md`](./domains/typescript.md) | Types, strict mode
Supabase | [`domains/database.md`](./domains/database.md) | Queries, mutations, RLS
Auth | [`domains/security.md`](./domains/security.md) | Authentication, authorization
shadcn/ui | [`domains/ui.md`](./domains/ui.md) | Components, styling
Tailwind v4 | [`domains/ui.md`](./domains/ui.md#ui-h101) | @utility, @theme

### By Portal

**Portal** | **Directory** | **Key Features**
--- | --- | ---
Marketing | app/(marketing)/ | Public pages, SEO
Customer | app/(customer)/ | Bookings, favorites, profile
Staff | app/(staff)/ | Schedule, analytics, clients
Business | app/(business)/ | Dashboard, inventory, staff
Admin | app/(admin)/ | Platform management, monitoring

### By Common Error

**Error** | **Rule** | **Quick Fix**
--- | --- | ---
Type 'any' not allowed | [TS-P001](./03-QUICK-SEARCH.md#ts-p001) | Use Database types
Unauthorized | [SEC-P001](./03-QUICK-SEARCH.md#sec-p001) | Add auth check
RLS denial | [DB-P001](./03-QUICK-SEARCH.md#db-p001) | Query public views
Missing 'server-only' | [ARCH-P001](./03-QUICK-SEARCH.md#arch-p001) | Add import directive
Page too long | [ARCH-P002](./03-QUICK-SEARCH.md#arch-p002) | Move to feature component
Typography imports | [UI-P004](./03-QUICK-SEARCH.md#ui-p004) | Use shadcn slots or design tokens

---

**Last Updated**: 2025-10-18
