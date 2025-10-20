# Security Fix - Reusable Session

Auto-fix security issues in batches. Run multiple times to complete all fixes.

## Objective

Read `analysis-report.json`, fix 10-20 uncompleted issues, update status. Rerun to continue.

## Input File

Read: `docs/analyze-fixes/security/analysis-report.json`

## Rules Reference

**Primary**: `docs/rules/core/security.md`
**Index**: `docs/rules/01-rules-index.md`

## Fix Patterns by Rule

### Rule: SEC-P001 {#sec-p001}

**Fix**: Add `verifySession()` or `getUser()` call at function start

```ts
// Add at start of function
const session = await verifySession()
if (!session) throw new Error('Unauthorized')
```

### Rule: SEC-P002 {#sec-p002}

**Fix**: Add role check before Supabase operations

```ts
await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
const salonIds = await getUserSalonIds()
```

### Rule: SEC-P003 {#sec-p003}

**Fix**: Wrap auth.uid() in SELECT

```sql
-- Replace
using (auth.uid() = customer_id)

-- With
using ((select auth.uid()) = customer_id)
```

### Rule: SEC-H101 {#sec-h101}

**Fix**: Add MFA restrictive policy

```sql
create policy "MFA required for sensitive data"
  on [table_name] as restrictive
  to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2');
```

### Rule: SEC-H102 {#sec-h102}

**Fix**: Add tenant scoping via JWT claims

```sql
using (
  salon_id = any (
    select jsonb_array_elements_text(auth.jwt()->'app_metadata'->'salon_ids')
  )
);
```

### Rule: SEC-H103 {#sec-h103}

**Fix**: Use updateSession() helper in middleware

```ts
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(req: NextRequest) {
  return updateSession(req)
}
```

### Rule: SEC-M301 {#sec-m301}

**Fix**: Map Supabase errors to appropriate HTTP codes

```ts
if (error?.code === 'PGRST116') {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
if (error?.code === '42501') { // insufficient_privilege
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Rule: SEC-M302 {#sec-m302}

**Fix**: Add Zod validation before mutations

```ts
'use server'
import { schema } from '../schema'

export async function mutate(input: unknown) {
  const payload = schema.parse(input)
  // ... rest of mutation
}
```

### Rule: SEC-L701 {#sec-l701}

**Fix**: Use views instead of direct table queries

```ts
// Replace
await supabase.schema('analytics').from('mv_refresh_log').select('*')

// With
await supabase.from('mv_refresh_log').select('*')
```

## Process & Display

Same structure as database fix (10-20 issues per batch, SEC-P### → SEC-L### ordering).

## Begin Fixing

1. Load `docs/analyze-fixes/security/analysis-report.json`
2. Filter `status === "pending"`
3. Sort by `priority_order` (ascending: SEC-P001 → SEC-L999)
4. Take first 10-20 issues
5. Fix using patterns above
6. Update status after each
7. Save report after batch

**Start now.** Fix next batch of pending security issues in priority order.
