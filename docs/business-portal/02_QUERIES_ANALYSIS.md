# Business Portal - Queries Analysis

**Date**: 2025-10-20
**Portal**: Business
**Layer**: Queries
**Files Analyzed**: 47
**Issues Found**: 4 (Critical: 2, High: 2, Medium: 0, Low: 0)

---

## Summary

Reviewed 47 query modules under `features/business/**/api`. Most files include the required `import 'server-only'` directive and rely on shared auth helpers, aligning with the React Server Component guidance in Context7 `/reactjs/react.dev` (keep data access on the server) and Project patterns. However, two entry-point query files (`pricing` and `coupons`) expose Supabase reads without any role/salon verification, violating CLAUDE.md Rule 8 and Supabase security expectations. We also found a runtime failure in `chains` caused by an undefined accumulator, plus a direct call to `catalog.pricing_rules` even though the generated `Database` types expose no such relation—indicating a broken, schema-table read that contravenes CLAUDE.md Rule 1 (“Reads from public views”). Supabase MCP’s `list_tables` for the `public` schema only returned `database_operations_log`, so these offending queries cannot be backed by a view defined there, corroborating the misconfiguration.

---

## Issues

### Critical Priority

#### Issue #1: Pricing queries bypass auth guard
**Severity**: Critical  
**File**: `features/business/pricing/api/queries.ts:13-41`  
**Rule Violation**: Rule 8 – Missing auth guard before database access

**Current Code**:
```typescript
export async function getPricingServices(
  salonId: string,
): Promise<PricingServiceOption[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('id, name, price')
    .eq('salon_id', salonId)
    .eq('is_active', true)
```

**Problem**: The function trusts a caller-supplied `salonId` without `requireAnyRole`, `requireUserSalonId`, or `canAccessSalon`, allowing cross-tenant data exfiltration. Context7 `/supabase/supabase` highlights enforcing RLS/auth before reads, and CLAUDE.md Rule 8 mandates verifying the user/session up front.

**Required Fix**:
```typescript
await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
const { accessibleSalonIds } = await getSalonContext()
if (!accessibleSalonIds.includes(salonId)) throw new Error('Unauthorized')
```

**Steps to Fix**:
1. Inject `requireAnyRole` (or `getSalonContext`) before calling Supabase.
2. Validate the requested `salonId` with `canAccessSalon` or limit queries to `accessibleSalonIds`.
3. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Auth guard executes before Supabase access.
- [ ] Query scopes to salons the current user can reach.
- [ ] Typecheck passes without new warnings.

**Dependencies**: None

---

#### Issue #2: Coupon service options leak tenant data
**Severity**: Critical  
**File**: `features/business/coupons/api/queries.ts:12-33`  
**Rule Violation**: Rule 8 – Missing auth guard before database access

**Current Code**:
```typescript
export async function getCouponServiceOptions(
  salonId: string,
): Promise<CouponServiceOption[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('id, name')
    .eq('salon_id', salonId)
```

**Problem**: Same pattern as Issue #1: no auth or salon ownership check, so any caller can enumerate another tenant’s services. This violates CLAUDE.md Rule 8 and the Supabase security guidance gathered via Context7.

**Required Fix**:
```typescript
await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
const salonIds = await resolveAccessibleSalonIds(salonId)
const { data, error } = await supabase
  .from('services')
  .in('salon_id', salonIds)
```

**Steps to Fix**:
1. Reuse the existing inventory helpers (e.g., `resolveAccessibleSalonIds`) or add `canAccessSalon`.
2. Fail the request if the user cannot access the requested salon.
3. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Auth guard present before querying.
- [ ] Salon scope validated or derived from the authenticated user.
- [ ] Tests/typecheck still pass.

**Dependencies**: None

---

### High Priority

#### Issue #3: Chain analytics throws `totalServices` reference error
**Severity**: High  
**File**: `features/business/chains/api/queries.ts:92-212`  
**Rule Violation**: Rule 2 – Return types must be valid (runtime safety)

**Current Code**:
```typescript
  return {
    totalLocations: salons.length,
    totalAppointments,
    totalRevenue,
    averageRating: avgRating,
    totalReviews,
    totalServices,
    totalStaff,
    locationMetrics,
  }
```

**Problem**: `totalServices` is never declared, so the function throws a ReferenceError in production. This breaks the feature and contradicts the TypeScript safety expectations in `docs/stack-patterns/typescript-patterns.md`.

**Required Fix**:
```typescript
const totalServices = salons.reduce((sum, salon) => {
  const locationServices = servicesBySalon.get(salon.id) ?? 0
  return sum + locationServices
}, 0)
```
*(Compute before the return, or remove the property if not needed.)*

**Steps to Fix**:
1. Define `totalServices` (e.g., via additional query or aggregation).
2. Extend existing queries to fetch the necessary counts if required.
3. Re-run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Function returns without runtime exceptions.
- [ ] `totalServices` is derived from actual data or removed if unused.
- [ ] Unit/integration expectations updated (if applicable).

**Dependencies**: None

---

#### Issue #4: `getPricingRules` targets non-existent catalog table
**Severity**: High  
**File**: `features/business/pricing/api/queries/dynamic-pricing.ts:46-58`  
**Rule Violation**: Rule 1 – Reads must go through public views

**Current Code**:
```typescript
  const { data, error } = await supabase
    .from('catalog.pricing_rules')
    .select('*')
    .eq('salon_id', salonId)
```

**Problem**: The generated `Database` types contain no `catalog.pricing_rules` relation, and Supabase MCP `list_tables` shows no matching public view, so this call fails at runtime (PostgREST 404) and bypasses the mandated public-view pattern. CLAUDE.md Rule 1 explicitly forbids reading schema tables directly.

**Required Fix**:
```typescript
const { data, error } = await supabase
  .from('pricing_rules_view') // public view exposing catalog data
  .eq('salon_id', salonId)
  .order('priority', { ascending: true })
```

**Steps to Fix**:
1. Surface a public `pricing_rules_view` (or reuse existing view) that exposes the needed fields.
2. Update typings to `Database['public']['Views']['pricing_rules_view']['Row']`.
3. Verify the query succeeds and run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Query reads from a public view that exists in `Database` typings.
- [ ] Runtime call succeeds without 404 errors.
- [ ] Type definitions updated accordingly.

**Dependencies**: Requires coordination with DB view creation if one does not yet exist.

---

### Medium Priority

None.

---

### Low Priority

None.

---

## Statistics

- Total Issues: 4
- Files Affected: 3
- Estimated Fix Time: 6 hours
- Breaking Changes: Potential (pricing endpoints unblock critical data paths)

---

## Next Steps

1. Address the critical auth leaks immediately (Issues #1 and #2).
2. Patch the `totalServices` runtime bug in chain analytics.
3. Align pricing rule queries with a supported public view before analysing dependent components.

---

## Related Files

This analysis should be done after:
- [x] Layer 1: Pages

This analysis blocks:
- [ ] Layer 3: Mutations

