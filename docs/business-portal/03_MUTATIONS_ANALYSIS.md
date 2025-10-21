# Business Portal - Mutations Analysis

**Date**: 2025-10-20
**Portal**: Business
**Layer**: Mutations
**Files Analyzed**: 47
**Issues Found**: 3 (Critical: 2, High: 1, Medium: 0, Low: 0)

---

## Summary

Inspected 47 mutation entry points under `features/business/**/api`. Most files honor the `'use server'` directive and call Supabase via `.schema('…')` for writes, matching the server-action guidance in Context7 `/reactjs/react.dev` (mutations run on the server). However, pricing and coupon mutations only validate `supabase.auth.getUser()` and trust caller-provided `salon_id`/IDs, bypassing the tenant scoping required by CLAUDE.md Rule 8. This violates the Supabase security best practices (Context7 `/supabase/supabase`) that emphasise explicit access checks before mutating schema tables. Additionally, `applyCoupon` stores the authenticated staff user as the coupon’s `customer_id`, corrupting analytics.

---

## Issues

### Critical Priority

#### Issue #1: Pricing rule mutations lack tenant access control
**Severity**: Critical  
**File**: `features/business/pricing/api/pricing-rules.mutations.ts:26-141`  
**Rule Violation**: Rule 8 – Missing auth guard before database access

**Current Code**:
```typescript
export async function createPricingRule(input: PricingRuleInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('catalog')
    .from('pricing_rules')
    .insert(input)
```

**Problem**: All pricing mutations accept `salon_id` / `service_ids` from the caller without checking whether the authenticated business user can modify that salon. Any compromised session could adjust another tenant’s catalog. CLAUDE.md Rule 8 mandates an explicit role check, and the Supabase MCP security advisory reinforces enforcing RLS/tenant boundaries before writes.

**Required Fix**:
```typescript
const { accessibleSalonIds } = await getSalonContext()
if (!accessibleSalonIds.includes(input.salon_id)) throw new Error('Unauthorized')

await supabase
  .schema('catalog')
  .from('pricing_rules')
  .insert({ ...input, created_by_id: user.id })
```

**Steps to Fix**:
1. Pull in `requireAnyRole`/`getSalonContext` (or `resolveAccessibleSalonIds`) before each mutation.
2. Reject or rewrite payloads that reference salons outside the user’s scope.
3. Add parity checks for `service_ids` to ensure they belong to allowed salons.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Tenant ownership validated before every pricing rule mutation.
- [ ] Payloads cannot override `salon_id` to another tenant.
- [ ] Typecheck/tests succeed.

**Dependencies**: None

---

#### Issue #2: Coupon mutations trust caller-supplied salon data
**Severity**: Critical  
**File**: `features/business/coupons/api/coupons.mutations.ts:39-182`  
**Rule Violation**: Rule 8 – Missing auth guard before database access

**Current Code**:
```typescript
export async function bulkGenerateCoupons(salonId: string, input: BulkCouponInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  …
  const rows = Array.from(codes).map((code) => ({
    salon_id: salonId,
    …
  }))

  const { error } = await supabase
    .schema('catalog')
    .from('coupons')
    .insert(rows)
```

**Problem**: The mutation suite (create/update/delete/toggle/bulkGenerate) never verifies the request `salon_id` against the authenticated business user. An attacker can generate coupons for another tenant or disable competitor promotions. This breaks CLAUDE.md Rule 8 and Supabase’s tenant-isolation guidelines.

**Required Fix**:
```typescript
await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
const salonIds = await resolveAccessibleSalonIds(salonId)
if (!salonIds.length) throw new Error('Unauthorized')

await supabase
  .schema('catalog')
  .from('coupons')
  .insert(rows.map((row) => ({ ...row, salon_id: salonIds[0], created_by_id: user.id })))
```

**Steps to Fix**:
1. Add `requireAnyRole`/`canAccessSalon` gates before Supabase writes.
2. Replace raw `salonId` with validated IDs from `getSalonContext`.
3. Audit other coupon mutations so updates/deletes also scope by `salon_id`.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Coupon mutations refuse to act on salons outside the caller’s scope.
- [ ] All Supabase writes include authenticated audit columns (`created_by_id`, etc.).
- [ ] Typecheck/tests succeed.

**Dependencies**: None

---

### High Priority

#### Issue #3: `applyCoupon` records staff user as coupon customer
**Severity**: High  
**File**: `features/business/coupons/api/coupons.mutations.ts:116-139`  
**Rule Violation**: Rule 2 – Data integrity (incorrect mutation output)

**Current Code**:
```typescript
const { error } = await supabase
  .schema('catalog')
  .from('coupon_usage')
  .insert({
    coupon_code: couponCode,
    appointment_id: appointmentId,
    customer_id: user.id,
    discount_amount: discountAmount,
  })
```

**Problem**: `user.id` is the authenticated business/staff account, not the appointment’s customer. This pollutes coupon analytics and prevents reconciling true customer redemption. CLAUDE.md Rule 2 expects correct return types/data, and the Context7 TypeScript best practices emphasise accurate data models.

**Required Fix**:
```typescript
const { data: appointment } = await supabase
  .from('appointments')
  .select('customer_id, salon_id')
  .eq('id', appointmentId)
  .single()
// validate salon ownership before use

await supabase
  .schema('catalog')
  .from('coupon_usage')
  .insert({
    coupon_code: couponCode,
    appointment_id: appointmentId,
    customer_id: appointment.customer_id,
    discount_amount: discountAmount,
    redeemed_by_staff_id: user.id,
  })
```

**Steps to Fix**:
1. Fetch the appointment (via public view) and confirm it belongs to an accessible salon.
2. Use the appointment’s `customer_id` for coupon usage; optionally store staff ID separately.
3. Update types/tests to reflect the new payload shape.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Coupon usage rows persist the actual customer ID.
- [ ] Staff identifier stored separately (if needed) without overwriting customer data.
- [ ] Typecheck/tests succeed.

**Dependencies**: None

---

## Statistics

- Total Issues: 3
- Files Affected: 2
- Estimated Fix Time: 5 hours
- Breaking Changes: Potential (pricing/coupon workflows blocked until fixed)

---

## Next Steps

1. Prioritise tenant scoping fixes for pricing and coupon mutations.
2. Correct coupon usage tracking before extending analytics (Layer 4).
3. Re-run security detection commands after patches.

---

## Related Files

This analysis should be done after:
- [x] Layer 2: Queries

This analysis blocks:
- [ ] Layer 4: Components

