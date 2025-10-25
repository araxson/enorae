# Business Portal - Mutations Analysis

**Date**: 2025-10-25  
**Portal**: Business  
**Layer**: Mutations  
**Files Analyzed**: 37  
**Issues Found**: 3 (Critical: 0, High: 2, Medium: 1, Low: 0)

---

## Summary

- Reviewed every `features/business/**/api/mutations.ts` entry plus nested helpers (`internal/*`, `helpers.ts`, `templates.ts`, etc.). All top-level entry files include the required `'use server'` directive.
- Most write paths correctly use `.schema('...').from('...')` for schema tables and revalidate the corresponding routes, but several helper functions still fall back to raw tables for read-before-write checks.
- Identified two high-severity schema alignment issues where mutations read from core tables (`services`, `staff`, `appointments`) instead of public views, increasing the risk of bypassing RLS. These mirror the findings in Layer 2 and stem from the same outdated assumptions about view names.
- Noted one medium-severity ergonomics issue: notification workflows do not call `revalidateNotifications()`, so the business notifications dashboard stays stale until a manual refresh.

---

## Issues

### High Priority

#### Issue #1: Staff Service Assignment Reads From `services` Table
**Severity**: High  
**File**: `features/business/staff-services/api/internal/assign.ts:33-66`  
**Rule Violation**: Supabase Mutation Pattern — `docs/stack-patterns/supabase-patterns.md` (“Reads use views even inside mutations”)

**Current Code**:
```typescript
const { data: service } = await supabase
  .from('services')
  .select('*')
  .eq('id', serviceId)
  .single()

if (!service || (service as Database['public']['Views']['services']['Row']).salon_id !== salon.id) {
  return { error: 'Service not found' }
}
```

**Problem**:
- The Supabase schema exposes `public.Views.services_view`; there is no `public.services` relation. The query silently fails, so every assignment responds “Service not found”.
- Casting `service` to `Database['public']['Views']['services']['Row']` hides the bug but creates an `any` escape hatch. TypeScript cannot guarantee the payload shape, negating strict mode.
- Because the read happens before an insert/update, the mutation never reaches the `.schema('catalog').from('staff_services')` branch, blocking all staff-service changes.

**Required Fix**:
```typescript
const { data: service, error: serviceError } = await supabase
  .from('services_view')
  .select('id, salon_id')
  .eq('id', serviceId)
  .single<Database['public']['Views']['services_view']['Row']>()

if (serviceError) return { error: serviceError.message }
if (!service || service.salon_id !== salon.id) {
  return { error: 'Service not found' }
}
```

**Steps to Fix**:
1. Replace `.from('services')` with `.from('services_view')` and add a typed `.single`.
2. Drop the unsafe cast—let the typed response drive the guard logic.
3. Audit other helpers for similar table reads (`supabase.from('services')` appears in `bulk.ts`, `helpers.ts`).
4. Run `npm run typecheck` to confirm view names align.

**Acceptance Criteria**:
- [ ] All service lookups in mutation helpers target `services_view`.
- [ ] Staff-service assignment succeeds for authorized salons.
- [ ] Type checking passes without `any` casts.

**Dependencies**: Depends on Layer 2 view fix to keep read logic consistent.

---

#### Issue #2: Notification Authorization Queries Raw Tables
**Severity**: High  
**File**: `features/business/notifications/api/mutations/helpers.ts:53-88`  
**Rule Violation**: Supabase Mutation Pattern — `docs/stack-patterns/supabase-patterns.md` (RLS-safe reads) / Security guidelines from Phase 1

**Current Code**:
```typescript
const { data: staffMemberships, error: staffError } = await supabase
  .from('staff')
  .select('id')
  .eq('user_id', userId)
  .in('salon_id', accessibleSalonIds)
  .limit(1)
…
const { data: customerMemberships, error: customerError } = await supabase
  .from('appointments')
  .select('id')
  .eq('customer_id', userId)
  .in('salon_id', accessibleSalonIds)
  .limit(1)
```

**Problem**:
- Both queries hit non-existent `public.staff` / `public.appointments` tables; the correct sources are `staff_profiles_view` and `appointments_view` (confirmed via Supabase types).
- Because the lookups always fail, `ensureRecipientAuthorized` throws “Unauthorized recipient”, blocking all outbound notifications.
- Reading raw tables around RLS-protected data is explicitly banned in `docs/stack-patterns/supabase-patterns.md` and contradicts Supabase advisor warnings about security-definer views.

**Required Fix**:
```typescript
const { data: staffMemberships, error: staffError } = await supabase
  .from('staff_profiles_view')
  .select('id, salon_id')
  .eq('user_id', userId)
  .in('salon_id', accessibleSalonIds)
  .limit(1)
  .returns<Database['public']['Views']['staff_profiles_view']['Row'][]>()
```
…repeat with `appointments_view`.

**Steps to Fix**:
1. Swap both `.from` calls to the corresponding `_view` relations and add `returns<...>()`.
2. Guard for `error` explicitly to surface Supabase issues.
3. Re-run targeted tests for notification workflows (manual or automated).

**Acceptance Criteria**:
- [ ] Both staff and appointment membership checks use Supabase views.
- [ ] Notifications deliver successfully for authorized recipients.
- [ ] No direct table reads remain in notification helpers.

**Dependencies**: Relies on Layer 2 ensuring views contain required columns.

---

### Medium Priority

#### Issue #3: Notification Mutations Skip Path Revalidation
**Severity**: Medium  
**File**: `features/business/notifications/api/mutations/send.ts:20-49`  
**Rule Violation**: Mutation Revalidation Rule — `docs/stack-patterns/architecture-patterns.md` (Revalidate affected routes after mutations)

**Current Code**:
```typescript
const { data: notificationId, error } = await supabase
  .schema('communication')
  .rpc('send_notification', { … })

if (error) throw error

return { id: notificationId }
```

**Problem**:
- `revalidateNotifications()` is defined in `helpers.ts` but never invoked inside `sendNotification` or the workflows (`sendAppointmentReminder`, etc.).
- Business notifications page therefore caches stale counts until a manual refresh or unrelated revalidation occurs, violating the user experience guidelines in `docs/stack-patterns/ui-patterns.md`.

**Required Fix**:
```typescript
if (error) throw error

revalidateNotifications()
return { id: notificationId }
```

**Steps to Fix**:
1. Call `revalidateNotifications()` after successful RPC execution.
2. Ensure the helper handles errors gracefully (wrap in try/catch if needed).
3. Add coverage (unit or integration) to confirm the revalidation path executes.

**Acceptance Criteria**:
- [ ] Notifications dashboard reflects new data without manual refresh.
- [ ] `revalidateNotifications` executes after every successful mutation.
- [ ] No regression alerts from Next.js during revalidation.

**Dependencies**: None

---

## Statistics

- Total Issues: 3
- Files Affected: 3
- Estimated Fix Time: 5 hours
- Breaking Changes: Low (behavioral only)

---

## Next Steps

1. Align all mutation read guards with the `_view` contract before shipping any fixes that depend on notification workflows.
2. Introduce regression tests (Playwright or server action unit tests) for staff-service assignment and notification delivery.
3. After fixes land, re-run Layer 3 audit focusing on remaining helper modules (`bulk.ts`, `workflows.ts`).

---

## Related Files

This analysis should be done after:
- [x] `docs/business-portal/02_QUERIES_ANALYSIS.md`

This analysis blocks:
- [ ] `docs/business-portal/04_COMPONENTS_ANALYSIS.md`
