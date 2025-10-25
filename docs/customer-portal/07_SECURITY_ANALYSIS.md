# Customer Portal - Security Analysis

**Date**: 2025-10-25
**Portal**: Customer
**Layer**: Security
**Files Analyzed**: 35
**Issues Found**: 2 (Critical: 1, High: 1, Medium: 0, Low: 0)

---

## Summary

- Authentication guards (`requireAuth`, `verifySession`) are present on most queries and mutations; shared `requireAuth` throws when unauthenticated, satisfying the RLS pre-check guideline.
- Supabase security advisors (run earlier in Phase 1) reported multiple `SECURITY DEFINER` warnings—no remediation yet.
- The most severe risk comes from reads executed against schema tables (`scheduling.appointments`, `organization.salons`, etc.) with `schema()` calls. These bypass the hardened public views and expose raw tenant data if filters are ever relaxed.
- A secondary risk is the reliance on raw string interpolation in Supabase `.or()` filters. User-controlled timestamps are inserted directly into filter strings, leaving room for malformed input and complicating auditing.

---

## Issues

### Critical Priority

#### Issue #1: Direct table reads bypass RLS-protected views
**Severity**: Critical  
**File**: `features/customer/booking/api/queries/availability.ts:15-39`, `features/customer/appointments/api/mutations.ts:22-190`, `features/customer/chains/api/queries.ts:82-135`, `features/customer/dashboard/api/queries/*.ts`, `features/customer/sessions/api/mutations.ts:29-104`  
**Rule Violation**: Supabase Pattern Rule #1 – Customer reads must target public views.

**Current Code**:
```ts
supabase
  .schema('scheduling')
  .from('appointments')
  .select('id')
  .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`)

supabase
  .schema('organization')
  .from('salons')
  .select('id, name, ...')
```

**Problem**:
- Accessing schema tables (`scheduling.appointments`, `organization.salons`, `identity.sessions`, etc.) bypasses RLS policies enforced on public views. Any future filter mistake or misuse could leak tenant data across customers.
- Several mutations double down on this pattern by using table rows for ownership checks before writes, weakening the separation between read-only views and writable tables mandated in CLAUDE.md.

**Required Fix**:
```ts
const { data } = await supabase
  .from('appointments_view')
  .select('id, staff_id, start_time, end_time')
  .eq('staff_id', staffId)
  .lt('start_time', endTimeIso)
  .gt('end_time', startTimeIso)

const { data: locations } = await supabase
  .from('salons_view')
  .select('id, name, formatted_address, chain_id')
  .eq('chain_id', chainId)
```

**Steps to Fix**:
1. Swap every read on schema tables for the published public view equivalent; request new views if required columns are missing.
2. Keep writes on schema tables but segment read-before-write checks through the views (see Layer 2/3 remediation plan).
3. After refactor, rerun Supabase security advisors to confirm RLS compliance.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] No customer query/mutation reads directly from schema tables.
- [ ] RLS coverage restored via public views.
- [ ] Security advisor warnings addressed or acknowledged with remediation notes.

**Dependencies**: Layer 2 & 3 fixes (queries/mutations) to change data sources.

---

### High Priority

#### Issue #2: Raw `.or()` filter strings interpolate user-controlled timestamps
**Severity**: High  
**File**: `features/customer/booking/api/queries/availability.ts:15-39`, `features/customer/booking/api/queries/availability.ts:58-73`  
**Rule Violation**: Security best practice – avoid building SQL fragments from unchecked strings.

**Current Code**:
```ts
.or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`)
.or(`and(start_time.lte.${endTime},end_time.gte.${startTime})`)
```

**Problem**:
- `startTime`/`endTime` originate from user-supplied form values. Even though the booking form validates them, nothing stops crafted requests from injecting characters (e.g., `startTime="2025-01-01T00:00:00Z),status.eq.cancelled"`), altering the filter logic.
- Supabase’s string-based filter syntax does not escape embedded parameters, so this pattern is fragile and difficult to audit.

**Required Fix**:
```ts
const { data: appointments } = await supabase
  .from('appointments_view')
  .select('id')
  .eq('staff_id', staffId)
  .neq('status', 'cancelled')
  .lt('start_time', endTimeIso)
  .gt('end_time', startTimeIso)
```

**Steps to Fix**:
1. Eliminate raw `.or()` strings; use chained `.lt`, `.gt`, `.lte`, `.gte` calls which parameterize inputs.
2. Rely on Supabase views for date comparisons (after addressing Issue #1).
3. Add server-side schema validation (Layer 6) ensuring ISO timestamp format before invoking the query.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Availability/conflict checks no longer interpolate timestamps into SQL fragments.
- [ ] Supabase queries remain parameterized and safe under crafted input.
- [ ] Booking flow still enforces overlap detection correctly.

**Dependencies**: Coordinates with Layer 6 validation updates to enforce timestamp format.

---

## Statistics

- Total Issues: 2
- Files Affected: 7
- Estimated Fix Time: 1 day
- Breaking Changes: High (requires data-layer refactor)

---

## Next Steps

1. Prioritize migrating all customer reads to public views to restore RLS fidelity.
2. Refactor availability/conflict queries to remove raw `.or()` strings and rely on parameterized Supabase filters.
3. Rerun Supabase security advisors after applying fixes to ensure no residual warnings.

---

## Related Files

This analysis should be done after:
- [x] docs/customer-portal/06_VALIDATION_ANALYSIS.md

This analysis blocks:
- [ ] docs/customer-portal/08_UX_ANALYSIS.md
