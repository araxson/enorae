# Customer Portal - Mutations Analysis

**Date**: 2025-10-25
**Portal**: Customer
**Layer**: Mutations
**Files Analyzed**: 17
**Issues Found**: 5 (Critical: 2, High: 3, Medium: 0, Low: 0)

---

## Summary

- Confirmed every `features/customer/**/api/mutations.ts` begins with `'use server'`, satisfying architecture guidance from `docs/stack-patterns/architecture-patterns.md`.
- Most actions follow the expected pattern: authenticate with `requireAuth`/`verifySession`, mutate schema tables via `.schema('<schema>')`, and call `revalidatePath` after writes.
- Significant gaps remain around read-before-write safeguards: multiple mutations still query raw schema tables (`scheduling.appointments`, `organization.salons`, `platform.services`, `identity.sessions`) instead of the mandated public views, violating Supabase RLS patterns gathered via Context7.
- Loyalty and referral actions are stubbed against nonexistent tables and rely on `supabase.auth.getUser()`, which contradicts Phase 1.5’s schema-alignment requirement and the auth guidance in `docs/stack-patterns/supabase-patterns.md`.

---

## Issues

### Critical Priority

#### Issue #1: Appointment mutations read from scheduling tables instead of views
**Severity**: Critical  
**File**: `features/customer/appointments/api/mutations.ts:22-67`, `features/customer/appointments/api/mutations.ts:108-190`  
**Rule Violation**: Supabase Pattern Rule #1 – Reads must target public views (`appointments_view`, `salons_view`); CLAUDE.md Frequent Violation #7.

**Current Code**:
```typescript
const { data: appointment } = await supabase
  .from('appointments')
  .select('customer_id, start_time, status')
  .eq('id', appointmentId)

const { data: salon } = await supabase
  .from('salons')
  .select('owner_id, name')
  .eq('id', appointment.salon_id)
```

**Problem**:
- Ownership checks and conflict detection run against schema tables (`scheduling.appointments`, `organization.salons`). These tables are outside the public view layer enforced by RLS, so customers could enumerate raw data if filters are misapplied.
- Supabase types confirm the customer-friendly interfaces are `appointments_view` and `salons_view`; bypassing them also breaks the strict typing guarantees established in Phase 1.5.

**Required Fix**:
```typescript
const { data: appointment } = await supabase
  .from('appointments_view')
  .select('id, customer_id, start_time, status, salon_id, staff_id')
  .eq('id', appointmentId)
  .single()

const { data: salon } = await supabase
  .from('salons_view')
  .select('id, owner_user_id, name')
  .eq('id', appointment.salon_id)
  .single()
```

**Steps to Fix**:
1. Replace every `.from('appointments')` read with `appointments_view`, and adjust selected columns to match the view schema.
2. Swap `.from('salons')` with `salons_view` (or request backend to expose chain owner fields via the view).
3. Update the conflict query to use `appointments_view` with appropriate filters; rely on returned view fields (e.g., `end_time`).
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] All read operations in the appointment mutations leverage public views.
- [ ] TypeScript strictly types results against `Database['public']['Views']`.
- [ ] Cancellation and reschedule flows continue to enforce business rules.

**Dependencies**: May require extending `salons_view`/`appointments_view` to expose owner/staff metadata.

---

#### Issue #2: Booking action queries raw tables for salon, service, and availability checks
**Severity**: Critical  
**File**: `features/customer/booking/api/mutations.ts:66-126`  
**Rule Violation**: Supabase Pattern Rule #1 – Customer reads must use public views.

**Current Code**:
```typescript
const { data: salon } = await supabase
  .from('salons')
  .select('id, is_active')
  .eq('id', salonId)

const { data: service } = await supabase
  .from('services')
  .select('duration_minutes, price')
  .eq('id', validation.data.serviceId)

const { data: conflictingAppointments } = await supabase
  .from('appointments')
  .select('id, start_time, end_time')
  .eq('staff_id', validation.data.staffId)
```

**Problem**:
- Three separate reads hit schema tables directly, bypassing the RLS-protected views (`salons_view`, `services_view`, `appointments_view`). This exposes sensitive availability and pricing data.
- The TypeScript casts assume view columns but the query sources are tables—future schema changes will break the contract silently.

**Required Fix**:
```typescript
const { data: salon } = await supabase
  .from('salons_view')
  .select('id, is_active')
  .eq('id', salonId)
  .single()

const { data: service } = await supabase
  .from('services_view')
  .select('id, duration_minutes, price')
  .eq('id', validation.data.serviceId)
  .single()

const { data: conflicts } = await supabase
  .from('appointments_view')
  .select('id, start_time, end_time')
  .eq('staff_id', validation.data.staffId)
  .eq('status', 'confirmed')
  .lt('start_time', endTime.toISOString())
  .gt('end_time', startTime.toISOString())
```

**Steps to Fix**:
1. Swap all pre-insert reads to use their `*_view` equivalents.
2. Remove manual casts (`type ServiceData`) by relying on typed view rows.
3. Confirm the views expose required columns; coordinate with backend if additional fields are needed.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Booking pre-flight checks use only public views.
- [ ] TypeScript types align with `Database['public']['Views']`.
- [ ] Booking flow still validates availability and pricing correctly.

**Dependencies**: None (views already exist per Supabase export).

---

### High Priority

#### Issue #3: Reviews ownership checks query engagement tables directly
**Severity**: High  
**File**: `features/customer/reviews/api/mutations.ts:71-153`  
**Rule Violation**: Supabase Pattern Rule #1 – Read verifications should use public views; Security checklist item “Reads from public views.”

**Current Code**:
```typescript
const { data: review } = await supabase
  .from('salon_reviews')
  .select('customer_id, created_at, salon_id')
  .eq('id', id)
  .eq('customer_id', session.user.id)
```

**Problem**:
- Ownership and existence checks run against `engagement.salon_reviews` directly. Although the subsequent update uses `.schema('engagement')`, the initial read should flow through `salon_reviews_view` to honor RLS and avoid leaking soft-deleted rows.
- Type inference currently relies on manual `ReviewRow` definitions instead of generated view types.

**Required Fix**:
```typescript
const { data: review } = await supabase
  .from('salon_reviews_view')
  .select('id, salon_id, customer_id, created_at')
  .eq('id', id)
  .eq('customer_id', session.user.id)
  .maybeSingle()
```

**Steps to Fix**:
1. Replace all `.from('salon_reviews')` reads with `salon_reviews_view`.
2. Use the generated `Database['public']['Views']['salon_reviews_view']['Row']` type (with `Partial` where necessary).
3. Keep mutations routed through `.schema('engagement')` tables.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] All read operations in review mutations consult the public view.
- [ ] Ownership checks still prevent cross-tenant access.
- [ ] TypeScript uses generated view types (no manual `ReviewRow`).

**Dependencies**: None.

---

#### Issue #4: Sessions revoke actions query `identity.sessions` without the view
**Severity**: High  
**File**: `features/customer/sessions/api/mutations.ts:29-112`  
**Rule Violation**: Supabase Pattern Rule #1 – Reads must consult public views; Type Safety (incorrect view name).

**Current Code**:
```typescript
const { data: targetSession } = await supabase
  .from('sessions')
  .select('id, is_current, is_active')
  .eq('id', validated.sessionId)
  .eq('user_id', user.id)

const { data: currentSession } = await supabase
  .from('sessions')
  .select('id')
  .eq('user_id', user.id)
  .eq('is_active', true)
  .eq('is_current', true)
```

**Problem**:
- The read path hits `identity.sessions` directly, bypassing the RLS-hardened `sessions_view` referenced in the Supabase type export (and in Layer 2 findings). This undermines the split between safe reads and privileged writes.
- A future column change can break the manual shape because the code doesn’t leverage generated view types.

**Required Fix**:
```typescript
const { data: targetSession } = await supabase
  .from('sessions_view')
  .select('id, is_current, is_active')
  .eq('id', validated.sessionId)
  .eq('user_id', user.id)
  .maybeSingle()

const { data: currentSession } = await supabase
  .from('sessions_view')
  .select('id')
  .eq('user_id', user.id)
  .eq('is_active', true)
  .eq('is_current', true)
  .single()
```

**Steps to Fix**:
1. Swap the read queries to `sessions_view` and adopt `Database['public']['Views']['sessions_view']['Row']`.
2. Keep write operations scoped to `.schema('identity').from('sessions')`.
3. Re-run unit/integration tests for session revocation if available.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Session read queries use the proper public view.
- [ ] TypeScript leverages generated view types.
- [ ] Revocation flows still succeed.

**Dependencies**: None.

---

#### Issue #5: Loyalty & referral mutations reference nonexistent tables and bypass auth helpers
**Severity**: High  
**File**: `features/customer/loyalty/api/mutations.ts:5-29`, `features/customer/referrals/api/mutations.ts:5-20`  
**Rule Violation**: Phase 1.5 Database Alignment (“Database is source of truth”); Auth Pattern (“Use requireAuth/verifySession”).

**Current Code**:
```typescript
const { data: { user } } = await supabase.auth.getUser()
// TODO: loyalty_transactions table not yet in database schema
throw new Error('Loyalty points feature not yet implemented')
```

**Problem**:
- Actions assume `loyalty_transactions`, `referrals`, and `referral_shares` tables exist even though Supabase exports confirm they don’t. Returning “not implemented” after authenticating via `supabase.auth.getUser()` sends mixed signals to the UI.
- Skipping `requireAuth`/`verifySession` duplicates auth logic and risks divergence from the shared helpers.

**Required Fix**:
```typescript
export async function redeemLoyaltyPoints(...) {
  const session = await requireAuth()
  throw new Error('Loyalty program is not available yet')
}
```
*or* wire to actual `*_view` tables once backend delivers them.

**Steps to Fix**:
1. Decide on product strategy: either remove these server actions or guard them with feature flags until schema support lands.
2. Replace `supabase.auth.getUser()` with `requireAuth`/`verifySession`.
3. When the schema is ready, use the published public views instead of guessing table names.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] No mutation references nonexistent tables.
- [ ] Auth enforcement relies on shared helpers.
- [ ] UI receives a clear, typed error/flag when the feature is unavailable.

**Dependencies**: Product decision for loyalty/referral rollout.

---

## Statistics

- Total Issues: 5
- Files Affected: 6
- Estimated Fix Time: 2 days
- Breaking Changes: Medium (mutations need retesting after refactors)

---

## Next Steps

1. Update appointment and booking mutations to read from public views before any write.
2. Align reviews, sessions, loyalty, and referrals mutations with the actual Supabase schema and shared auth utilities.
3. After refactors, execute `npm run typecheck` and regression tests covering cancellation, booking, favorites, and session management.

---

## Related Files

This analysis should be done after:
- [x] docs/customer-portal/02_QUERIES_ANALYSIS.md

This analysis blocks:
- [ ] docs/customer-portal/07_SECURITY_ANALYSIS.md
- [ ] docs/customer-portal/05_TYPES_ANALYSIS.md
