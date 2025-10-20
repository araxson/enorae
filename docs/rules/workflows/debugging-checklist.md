# Debugging Checklist

Common issues and their solutions in ENORAE.

---

## Quick Diagnosis

**Symptom** | **Likely Cause** | **Section**
--- | --- | ---
Build fails with type errors | Missing types, `any` usage | [Type Errors](#type-errors)
"Unauthorized" errors | Missing auth check | [Auth Issues](#auth-issues)
Data not loading | RLS denial, wrong view | [Data Access](#data-access-issues)
Mutations don't update UI | Missing revalidatePath | [State Updates](#state-update-issues)
Slow queries | Missing indexes | [Performance](#performance-issues)
Component not rendering | Import error, suspense boundary | [UI Issues](#ui-issues)

---

## Type Errors {#type-errors}

### Issue: "Type 'any' is not assignable"

**Cause**: TypeScript strict mode forbids `any`

**Solution**:
```ts
// ❌ Wrong
const data: any = await getData()

// ✅ Correct
import type { Database } from '@/lib/types/database.types'
type Data = Database['public']['Views']['view_name']['Row']
const data: Data = await getData()
```

**Rules**: [TS-P001](../03-QUICK-SEARCH.md#ts-p001)

---

### Issue: "Property 'X' does not exist on type 'Database'"

**Cause**: Types not regenerated after schema changes

**Solution**:
```bash
npm run db:types
```

**Rules**: [TS-M302](../03-QUICK-SEARCH.md#ts-m302)

---

### Issue: "Cannot use 'let' as an identifier"

**Cause**: Using reserved word in strict mode

**Solution**:
```ts
// ❌ Wrong
const let = 5

// ✅ Correct
const level = 5
```

**Rules**: [TS-P002](../03-QUICK-SEARCH.md#ts-p002)

---

### Issue: "Cannot use destructuring in 'using' declaration"

**Cause**: TypeScript 5.9 forbids binding patterns in `using`

**Solution**:
```ts
// ❌ Wrong
for (using { client } of pool) {}

// ✅ Correct
for (using item of pool) {
  const { client } = item
}
```

**Rules**: [TS-H101](../03-QUICK-SEARCH.md#ts-h101)

---

## Auth Issues {#auth-issues}

### Issue: "Unauthorized" on data access

**Cause**: Missing auth check before Supabase query

**Solution**:
```ts
// ✅ Add auth check
export async function getData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // ... rest of query
}
```

**Rules**: [SEC-P001](../03-QUICK-SEARCH.md#sec-p001), [DB-P002](../03-QUICK-SEARCH.md#db-p002)

---

### Issue: Getting stale session data

**Cause**: Using `getSession()` instead of `getUser()`

**Solution**:
```ts
// ❌ Wrong
const { data: { session } } = await supabase.auth.getSession()

// ✅ Correct
const { data: { user } } = await supabase.auth.getUser()
```

**Rules**: [SEC-P001](../03-QUICK-SEARCH.md#sec-p001)

---

### Issue: RLS denying access despite being authenticated

**Cause**: RLS policy not wrapping `auth.uid()` in SELECT

**Check migration**:
```sql
-- ❌ Wrong
using (auth.uid() = user_id)

// ✅ Correct
using ((select auth.uid()) = user_id)
```

**Rules**: [SEC-P003](../03-QUICK-SEARCH.md#sec-p003), [DB-H101](../03-QUICK-SEARCH.md#db-h101)

---

### Issue: Cross-tenant data leakage

**Cause**: RLS policy missing tenant filter

**Solution**:
```sql
create policy "Tenant isolation"
  on table_name
  using (
    salon_id = (select auth.jwt() -> 'app_metadata' ->> 'salon_id')
  );
```

**Rules**: [DB-P003](../03-QUICK-SEARCH.md#db-p003), [SEC-H102](../03-QUICK-SEARCH.md#sec-h102)

---

## Data Access Issues {#data-access-issues}

### Issue: "Table or view not found"

**Cause**: Querying schema table instead of public view

**Solution**:
```ts
// ❌ Wrong
await supabase.schema('scheduling').from('appointments').select('*')

// ✅ Correct
await supabase.from('appointments').select('*')
```

**Rules**: [DB-P001](../03-QUICK-SEARCH.md#db-p001)

---

### Issue: INSERT/UPDATE not working

**Cause**: Writing to public view instead of schema table

**Solution**:
```ts
// ✅ Correct - use .schema() for writes
await supabase
  .schema('scheduling')
  .from('appointments')
  .insert({ ... })
```

**Rules**: [DB-P001](../03-QUICK-SEARCH.md#db-p001)

---

### Issue: Data not showing after mutation

**Cause**: Missing `revalidatePath()` call

**Solution**:
```ts
'use server'
import { revalidatePath } from 'next/cache'

export async function createAppointment(data: unknown) {
  // ... mutation logic

  revalidatePath('/customer/appointments')  // ← Add this
  return result
}
```

**Rules**: [DB-H103](../03-QUICK-SEARCH.md#db-h103), [PERF-L702](../03-QUICK-SEARCH.md#perf-l702)

---

### Issue: Supabase query returns `unknown` type

**Cause**: Missing `.returns<Type>()` or `.maybeSingle<Type>()`

**Solution**:
```ts
const { data } = await supabase
  .from('appointments')
  .select('*')
  .returns<Appointment[]>()  // ← Add this
```

**Rules**: [DB-M301](../03-QUICK-SEARCH.md#db-m301)

---

## State Update Issues {#state-update-issues}

### Issue: Client component not re-rendering

**Cause**: Server Component not passing updated props

**Solution**: Ensure Server Component refetches data and passes to Client

```tsx
// Server Component
export async function Page() {
  const data = await getData()  // ← Refetches on revalidation
  return <ClientComponent data={data} />
}
```

**Rules**: [REACT-P001](../03-QUICK-SEARCH.md#react-p001)

---

### Issue: useEffect runs on every render

**Cause**: Missing dependency array or stale dependencies

**Solution**:
```tsx
// ✅ Correct
useEffect(() => {
  fetchData()
}, [dependency])  // ← Add dependencies
```

**Rules**: [REACT-M302](../03-QUICK-SEARCH.md#react-m302)

---

## Performance Issues {#performance-issues}

### Issue: Slow database queries

**Cause**: Missing indexes on foreign keys

**Check**: Run Supabase advisor
```sql
select * from supabase__get_advisors(type := 'performance');
```

**Solution**: Add indexes
```sql
create index table_fk_column_idx on schema.table(fk_column);
```

**Rules**: [PERF-H101](../03-QUICK-SEARCH.md#perf-h101)

---

### Issue: Client-side waterfall (sequential fetches)

**Cause**: Nested useEffect fetches

**Solution**: Move to Server Component
```tsx
// ✅ Correct - Server Component
export async function Page() {
  const [data1, data2] = await Promise.all([
    getData1(),
    getData2()
  ])
  return <Component data1={data1} data2={data2} />
}
```

**Rules**: [REACT-P002](../03-QUICK-SEARCH.md#react-p002), [NEXT-L701](../03-QUICK-SEARCH.md#next-l701)

---

### Issue: Large bundle size

**Cause**: Heavy libraries imported in client components

**Solution**: Move to Server Component
```tsx
// ✅ Correct - Server Component
import marked from 'marked'

export async function MarkdownPage() {
  const html = marked(content)
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

**Rules**: [REACT-L701](../03-QUICK-SEARCH.md#react-l701), [PERF-L701](../03-QUICK-SEARCH.md#perf-l701)

---

## UI Issues {#ui-issues}

### Issue: Hydration mismatch

**Cause**: Server and client rendering differently

**Common causes**:
- Using `Date.now()` or `Math.random()` directly
- Conditional rendering based on `window`
- Mismatched HTML structure

**Solution**: Use `'use client'` and `useEffect` for client-only code
```tsx
'use client'
import { useEffect, useState } from 'react'

export function ClientOnly() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <div>{/* client-only content */}</div>
}
```

---

### Issue: Typography primitives still imported

**Cause**: Legacy usage of `@/components/ui/typography` instead of relying on shadcn component slots.

**Solution**:
```tsx
// ❌ Wrong
import { H1, P } from '@/components/ui/typography'

<H1>Loyalty programme</H1>
<P>Reward repeat guests automatically.</P>

// ✅ Correct
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Loyalty programme</CardTitle>
    <CardDescription>Reward repeat guests automatically.</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>
```

**Rules**: [UI-P004](../03-QUICK-SEARCH.md#ui-p004)

---

### Issue: shadcn component missing features

**Cause**: Incomplete composition (missing required subcomponents)

**Solution**:
```tsx
// ❌ Wrong
<Dialog>
  <DialogContent>
    <form>...</form>
  </DialogContent>
</Dialog>

// ✅ Correct
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <form>...</form>
  </DialogContent>
</Dialog>
```

**Rules**: [UI-P002](../03-QUICK-SEARCH.md#ui-p002)

---

### Issue: Styles not applying

**Causes**:
1. Using arbitrary colors instead of design tokens
2. Editing protected files

**Solution**:
```tsx
// ❌ Wrong
<div className="bg-blue-500">

// ✅ Correct
<div className="bg-primary">
```

**Never edit**:
- `components/ui/*.tsx`
- `app/globals.css`

**Rules**: [UI-H102](../03-QUICK-SEARCH.md#ui-h102), [See exclusions](../reference/exclusions.md)

---

## Build Issues {#build-issues}

### Issue: Build fails with "Module not found: Can't resolve 'server-only'"

**Cause**: Missing `server-only` package

**Solution**:
```bash
npm install server-only
```

---

### Issue: "getInitialProps is not supported"

**Cause**: Using Pages Router patterns in App Router

**Solution**: Remove `getInitialProps`, use Server Components

**Rules**: [NEXT-P003](../03-QUICK-SEARCH.md#next-p003)

---

### Issue: Global CSS import error

**Cause**: Importing `globals.css` outside `app/layout.tsx`

**Solution**: Remove import, `globals.css` only imported in root layout

**Rules**: [NEXT-P002](../03-QUICK-SEARCH.md#next-p002)

---

## Import Issues {#import-issues}

### Issue: "Cannot find module '@/components/ui/typography'"

**Cause**: Typography primitives were removed; features should not import them.

**Solution**:
- Delete the import.
- Refactor the component to use the appropriate shadcn primitive (CardTitle, CardDescription, AlertDescription, SidebarMenuButton, etc.).
- If no primitive fits, use semantic elements (`<p>`, `<span>`) styled with approved design tokens (`text-muted-foreground`, `text-sm`, etc.).

**Rules**: [UI-P004](../03-QUICK-SEARCH.md#ui-p004)

---

### Issue: Circular dependency warning

**Cause**: Files importing each other

**Solution**: Extract shared code to separate file in `lib/`

**Rules**: [ARCH-M301](../03-QUICK-SEARCH.md#arch-m301)

---

## Development Workflow Checks

Before committing:
- [ ] `npm run typecheck` passes
- [ ] No console errors in browser
- [ ] Auth checks in all server functions
- [ ] Using public views for reads
- [ ] Using schema tables for writes
- [ ] No `@/components/ui/typography` imports; shadcn slots provide typography
- [ ] Complete shadcn compositions
- [ ] `revalidatePath` after mutations
- [ ] Page files are 5-15 lines
- [ ] No `any` types

---

## Emergency Fixes

### Production is down

1. **Check Supabase status**: https://status.supabase.com
2. **Check Vercel logs**: Deployment logs
3. **Rollback**: Redeploy previous working version
4. **Check RLS**: Policies may be blocking legitimate access

### Data corruption

1. **Stop writes immediately**
2. **Check Supabase backups**: Database → Backups
3. **Restore from backup** if necessary
4. **Review migration** that caused issue

---

**📖 Related Documentation:**
- [Rules Index](../03-QUICK-SEARCH.md) - All rules
- [Task-Based Guide](../04-TASK-GUIDE.md) - Common tasks
- [New Feature Workflow](./new-feature.md) - Creating features
- [Database Changes Workflow](./database-changes.md) - Schema changes

**Last Updated:** 2025-10-18
