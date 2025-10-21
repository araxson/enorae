# Staff Portal - Queries Analysis

**Date**: 2025-10-20  
**Portal**: Staff  
**Layer**: Queries  
**Files Analyzed**: 19  
**Issues Found**: 6 (Critical: 2, High: 3, Medium: 1, Low: 0)

---

## Summary

Reviewed every `features/staff/**/api/queries.ts` module to validate `import 'server-only'`, auth enforcement, Supabase view usage, and type safety. Cross-checked public view coverage via Supabase MCP (`information_schema.tables` shows all referenced relations are exposed as public views, including `appointments`, `staff`, and `staff_schedules`). Confirmed no `.from()` call targets schema tables directly, satisfying CLAUDE Rule 1, and no `any` types slipped through, aligning with TypeScript strict mode guidance (Context7 TypeScript docs: “Pluck properties with type safety”). However, several analytics and messaging queries return inaccurate or over-broad data, and two core helpers read from incorrect columns, causing immediate runtime failures. These problems violate CLAUDE Rule 8 (auth/data correctness) and Next.js server data best practices that stress accurate server-side fetching (Context7 Next.js App Router: “Server Components for Data Fetching”). Supabase advisors report no RLS gaps on the public views used, though broader project warnings exist (unused indexes), which we noted for context.

---

## Issues

### Critical Priority

#### Issue #1: Settings query filters on non-existent `user_id` column
**Severity**: Critical  
**File**: `features/staff/settings/api/queries.ts:46-58`  
**Rule Violation**: CLAUDE.md Rule 10 (Type safety) & Context7 TypeScript “Pluck properties with type safety” – relying on typed schema would have prevented invalid column access.

**Current Code**:
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('id')
  .eq('user_id', session.user.id)
  .single<{ id: string }>()
```

**Problem**:
The `profiles` public view exposes `id` (already the auth user ID) but no `user_id`. PostgREST returns `column profiles.user_id does not exist`, breaking the Staff Preferences page for every user.

**Required Fix**:
```typescript
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('id')
  .eq('id', session.user.id)
  .maybeSingle<{ id: string }>()

if (profileError) throw profileError
if (!profile?.id) return DEFAULT_PREFERENCES
```

**Steps to Fix**:
1. Replace the `eq('user_id', …)` filter with `eq('id', session.user.id)` and handle `profileError`.
2. Switch to `.maybeSingle()` to avoid throwing when no row exists.
3. Re-run `npm run typecheck` to ensure strict typing flags any future schema mismatches.

**Acceptance Criteria**:
- [ ] `getUserPreferences` succeeds for authenticated staff without triggering PostgREST column errors.  
- [ ] Defaults apply only when the profile truly doesn’t exist.  
- [ ] TypeScript passes with no `any` regressions.

**Dependencies**: None

---

#### Issue #2: `getScheduleSalon` assumes staff is salon owner
**Severity**: Critical  
**File**: `features/staff/schedule/api/queries.ts:131-147`  
**Rule Violation**: CLAUDE.md Rule 8 (Verify auth & tenant scoping) – current query ignores staff tenancy.

**Current Code**:
```typescript
const { data: salon, error } = await supabase
  .from('salons')
  .select('id')
  .eq('owner_id', session.user.id)
  .single()

if (error || !salon) {
  throw new Error('No salon found for your account')
}
```

**Problem**:
Staff users are not salon owners. Filtering by `owner_id` always fails, blocking schedule views and swap flows for every staff member.

**Required Fix**:
```typescript
const { data: staffProfile, error: staffError } = await supabase
  .from('staff')
  .select('salon_id')
  .eq('user_id', session.user.id)
  .maybeSingle<{ salon_id: string | null }>()

if (staffError) throw staffError
if (!staffProfile?.salon_id) throw new Error('No salon assignment found')

return { id: staffProfile.salon_id }
```

**Steps to Fix**:
1. Look up the staff member’s salon via the `staff` view scoped by user ID.
2. Return the salon ID instead of the entire salon row (keeps response minimal).
3. Update downstream callers (if any) to expect `{ id: string }`.
4. Validate behaviour with an authenticated staff user in QA.

**Acceptance Criteria**:
- [ ] Staff schedule pages load without “No salon found” errors.  
- [ ] Returned salon ID matches the staff profile’s `salon_id`.  
- [ ] `npm run typecheck` passes.

**Dependencies**: None

---

### High Priority

#### Issue #3: Staff performance metrics never accumulate revenue
**Severity**: High  
**File**: `features/staff/analytics/api/queries.ts:108-119`  
**Rule Violation**: CLAUDE.md Rule 8 (data accuracy) & Next.js App Router best practice to keep server data correct (Context7 “Server Components for Data Fetching”).

**Current Code**:
```typescript
const appointmentIds = appointmentRows.map(a => a.id)
if (appointmentIds.length > 0) {
  const { data: services } = await supabase
    .from('service_pricing_view')
    .select('price')
    .in('service_id', appointmentIds)
  totalRevenue = services?.reduce((sum, s) => sum + (Number(s.price) || 0), 0) || 0
}
```

**Problem**:
The code compares appointment IDs against `service_pricing_view.service_id`, so the query returns zero rows. `total_revenue` and downstream commissions are always 0, breaking the dashboard.

**Required Fix**:
```typescript
const totalRevenue = appointmentRows.reduce(
  (sum, appt) => sum + Number(appt.total_price ?? 0),
  0,
)
```

**Steps to Fix**:
1. Remove the extra Supabase fetch; rely on the `appointments` view’s `total_price`.
2. Ensure `total_price` is selected in the initial appointment query (`select('id, status, customer_id, created_at, total_price')`).
3. Recalculate `avg_appointment_value` from the updated revenue.
4. Add a regression test or storybook value check if available.

**Acceptance Criteria**:
- [ ] `total_revenue` reflects the sum of appointment `total_price`.  
- [ ] Average appointment value updates accordingly.  
- [ ] No additional Supabase request is made for pricing.

**Dependencies**: Blocks Issue #5 fix.

---

#### Issue #4: Revenue breakdown counts services, not bookings
**Severity**: High  
**File**: `features/staff/analytics/api/queries.ts:152-212`  
**Rule Violation**: CLAUDE.md Rule 8 (data accuracy) & Supabase pattern guidance to query the correct view.

**Current Code**:
```typescript
const { data: staffServices } = await supabase
  .from('staff_services')
  .select(`service_id, services:service_id ( name, service_pricing ( price ))`)
// …
const revenueMap = new Map()
staffServiceRows.forEach(ss => {
  const price = Number(ss.services?.service_pricing?.[0]?.price || 0)
  current.count += 1
  current.revenue += price
})
```

**Problem**:
The function never examines appointment data, so `bookings_count` and `total_revenue` reflect how many services the stylist offers, not what clients booked during the chosen window.

**Required Fix**:
```typescript
const { data: services, error } = await supabase
  .from('appointment_services')
  .select(`
    service_id,
    service_name,
    price,
    appointments!inner(staff_id, status, start_time)
  `)
  .eq('appointments.staff_id', targetStaffId)
  .eq('appointments.status', 'completed')
  .gte('appointments.start_time', start)
  .lte('appointments.start_time', end)

// Group by service_id using the returned price values
```

**Steps to Fix**:
1. Join through `appointment_services` (public view verified via MCP) with inner `appointments` relation.
2. Group by `service_id` to count bookings and sum actual `price`.
3. Return `avg_price` as `revenue / count`.
4. Verify the query via Supabase console or unit test.

**Acceptance Criteria**:
- [ ] Revenue breakdown reflects only completed appointments in the date range.  
- [ ] `bookings_count` equals number of appointment-service rows per service.  
- [ ] No placeholder pricing values remain.

**Dependencies**: None

---

#### Issue #5: Message fetch ignores thread scoping
**Severity**: High  
**File**: `features/staff/messages/api/queries.ts:57-63`  
**Rule Violation**: CLAUDE.md Rule 8 (tenant scoping) – query must scope by thread ID.

**Current Code**:
```typescript
const { data, error } = await supabase
  .from('messages')
  .select('*')
  .or(`from_user_id.eq.${session.user.id},to_user_id.eq.${session.user.id}`)
  .eq('is_deleted', false)
```

**Problem**:
The query returns all of the staff member’s messages across every conversation. The thread view becomes a full inbox dump and risks leaking unrelated context if UI rendering changes.

**Required Fix**:
```typescript
const { data, error } = await supabase
  .from('messages')
  .select('*')
  .eq('thread_id', threadId)
  .or(`from_user_id.eq.${session.user.id},to_user_id.eq.${session.user.id}`)
  .eq('is_deleted', false)
  .order('created_at', { ascending: true })
```

**Steps to Fix**:
1. Add `.eq('thread_id', threadId)` before the `.or(...)` clause.
2. Wrap the `.or()` condition in parentheses if Supabase requires explicit grouping (`or=(...)`).
3. Confirm the SQL plan in Supabase inspector (optional).

**Acceptance Criteria**:
- [ ] Only messages belonging to `threadId` are returned.  
- [ ] Thread view matches expected conversation history.  
- [ ] Existing tests (if any) updated.

**Dependencies**: None

---

### Medium Priority

#### Issue #6: Customer relationship revenue uses placeholder values
**Severity**: Medium  
**File**: `features/staff/analytics/api/queries.ts:253-287`  
**Rule Violation**: CLAUDE.md Rule 8 (data accuracy) & Context7 Next.js guidance on correct server data handling.

**Current Code**:
```typescript
customer.revenue += 50 // Placeholder - would need to fetch actual pricing
```

**Problem**:
Each completed appointment adds a hard-coded `$50`, misreporting spend totals and favourite services for clients. This undermines staff retention analytics.

**Required Fix**:
```typescript
const price = Number(appt.total_price ?? 0)
customer.revenue += price
if (appt.service_names) {
  customer.services.push(appt.service_names)
}
```

**Steps to Fix**:
1. Include `total_price` and `service_names` in the appointments select clause.
2. Accumulate `total_price` instead of a placeholder.
3. Track service usage if favourite services are required (e.g., count occurrences).
4. Adjust favourite-service logic to use tracked services.

**Acceptance Criteria**:
- [ ] Total spend equals the sum of actual appointment totals.  
- [ ] Favourite service uses real data (no empty arrays).  
- [ ] Analytics UI reflects updated values.

**Dependencies**: Issue #3 (needs `total_price` selection).

---

### Low Priority

No low priority issues identified.

---

## Statistics

- Total Issues: 6  
- Files Affected: 5  
- Estimated Fix Time: 10 hours  
- Breaking Changes: 0 (but analytics behaviour will change significantly once corrected)

---

## Next Steps

1. Tackle the two critical fixes (`getUserPreferences`, `getScheduleSalon`) to unblock settings and scheduling flows.  
2. Address high-priority analytics and messaging bugs to restore accurate dashboards.  
3. Follow with customer relationship revenue adjustments once the performance metrics are corrected.

---

## Related Files

This analysis should be done after:
- [x] docs/staff-portal/01_PAGES_ANALYSIS.md

This analysis blocks:
- [ ] docs/staff-portal/03_MUTATIONS_ANALYSIS.md

