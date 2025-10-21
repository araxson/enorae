# Business Portal - Security Analysis

**Date**: 2025-10-20
**Portal**: Business
**Layer**: Security
**Files Analyzed**: 254
**Issues Found**: 3 (Critical: 2, High: 1, Medium: 0, Low: 0)

---

## Summary

Reviewed 254 API modules (`features/business/**/api`). Most leverage `requireAnyRole` or Supabase auth checks, and Supabase MCP confirms RLS is enabled on the lone public table surfaced (`database_operations_log`). Nevertheless, pricing and coupon endpoints bypass tenant ownership checks entirely, violating CLAUDE.md security rules and Supabase best practices. Supabase advisors also flag leaked-password protection as disabled, exposing global auth risk.

---

## Issues

### Critical Priority

#### Issue #1: Pricing APIs allow cross-tenant access
**Severity**: Critical  
**File**: `features/business/pricing/api/queries.ts:13-41`, `features/business/pricing/api/pricing-rules.mutations.ts:26-140`  
**Rule Violation**: Rule 8 – Always verify auth before data access

**Current Code**:
```ts
export async function getPricingServices(salonId: string): Promise<PricingServiceOption[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('id, name, price')
    .eq('salon_id', salonId)
```
```ts
export async function createPricingRule(input: PricingRuleInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase
    .schema('catalog')
    .from('pricing_rules')
    .insert(input)
```

**Problem**: No tenant validation occurs—callers can read or mutate pricing data for any `salonId`. This breaches CLAUDE.md Rule 8 and Supabase guidance (Context7 `/supabase/supabase`) about scoping queries to the authenticated tenant.

**Required Fix**:
```ts
await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
const { accessibleSalonIds } = await getSalonContext()
if (!accessibleSalonIds.includes(salonId)) throw new Error('Unauthorized')
```
*(Apply the same guard in all pricing mutations.)*

**Steps to Fix**:
1. Add `requireAnyRole`/`getSalonContext` (or `resolveAccessibleSalonIds`) to queries and mutations.
2. Reject payloads that target salons outside the caller’s scope.
3. Re-run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Pricing reads/writes limited to authenticated tenant salons.
- [ ] Unauthorized tenant attempts raise errors before Supabase calls.
- [ ] Typecheck/tests succeed.

**Dependencies**: Aligns with Layer 2/3 fixes.

---

#### Issue #2: Coupon APIs lack tenant enforcement
**Severity**: Critical  
**File**: `features/business/coupons/api/queries.ts:12-33`, `features/business/coupons/api/coupons.mutations.ts:39-182`  
**Rule Violation**: Rule 8 – Always verify auth before data access

**Current Code**:
```ts
export async function getCouponServiceOptions(salonId: string): Promise<CouponServiceOption[]> {
  const supabase = await createClient()
  return (await supabase
    .from('services')
    .select('id, name')
    .eq('salon_id', salonId)
```
```ts
export async function bulkGenerateCoupons(salonId: string, input: BulkCouponInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  …
  await supabase
    .schema('catalog')
    .from('coupons')
    .insert(rows)
```

**Problem**: Like pricing, coupons trust the provided `salonId`. Attackers can enumerate services or mint coupons for another tenant, violating CLAUDE.md security rules and Supabase tenant guidance.

**Required Fix**:
```ts
const salonIds = await resolveAccessibleSalonIds(salonId)
if (!salonIds.length) throw new Error('Unauthorized')

await supabase
  .schema('catalog')
  .from('coupons')
  .insert(rows.map((row) => ({ ...row, salon_id: salonIds[0], created_by_id: user.id })))
```

**Steps to Fix**:
1. Add tenant-scoped guards to coupon queries/mutations.
2. Ensure coupon usage logging also verifies appointment ownership before writes.
3. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Coupon endpoints restrict access to salons the caller can manage.
- [ ] All Supabase writes include validated tenant IDs.
- [ ] Typecheck/tests succeed.

**Dependencies**: Complements validation fixes in Layer 6.

---

### High Priority

#### Issue #3: Supabase leaked-password protection disabled
**Severity**: High  
**File**: Supabase Advisor (`auth_leaked_password_protection`)  
**Rule Violation**: Rule 8 – Enforce auth hardening measures

**Current Finding**:
> “Leaked password protection is currently disabled.”  
> Remediation: [Enable leaked password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

**Problem**: Without HaveIBeenPwned checks, compromised passwords remain usable across tenants. This platform-level risk increases account takeover likelihood.

**Required Fix**:
- Enable “Leaked password protection” in Supabase Auth settings or via CLI (`supabase auth:update ...`).

**Steps to Fix**:
1. Follow Supabase remediation guide to enable leaked-password protection.
2. Communicate change to users if additional password requirements are introduced.
3. Re-run `supabase --project <id> auth get` to confirm settings.

**Acceptance Criteria**:
- [ ] Supabase Auth rejects credentials found in leaked-password database.
- [ ] Documentation updated if new password rules impact onboarding.

**Dependencies**: None

---

## Statistics

- Total Issues: 3
- Files Affected: 4
- Estimated Fix Time: 6 hours
- Breaking Changes: Potential (requests now gated by tenant checks)

---

## Next Steps

1. Implement tenant guards for pricing and coupon APIs immediately.
2. Enable leaked-password protection at the platform level.
3. After fixes, re-run targeted security smoke tests and Supabase advisors.

---

## Related Files

This analysis should be done after:
- [x] Layer 6: Validation

This analysis blocks:
- [ ] Phase 3 summary consolidation

