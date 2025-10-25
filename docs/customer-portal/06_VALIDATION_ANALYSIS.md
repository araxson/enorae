# Customer Portal - Validation Analysis

**Date**: 2025-10-25
**Portal**: Customer
**Layer**: Validation
**Files Analyzed**: 18
**Issues Found**: 2 (Critical: 0, High: 1, Medium: 1, Low: 0)

---

## Summary

- Core flows (bookings, reviews, appointments, favorites, session revocation, profile preferences) reuse shared Zod schemas from `@/lib/validations/**`, meeting the pattern guidance.
- Many feature `schema.ts` files are placeholders (`z.object({})`). They provide no validation while adjacent mutations accept user-controlled data, leaving gaps in input hardening.
- Loyalty and referral actions accept parameters (`points`, `rewardId`, referral platforms) but there is no schema enforcing ranges or enum membership.

---

## Issues

### High Priority

#### Issue #1: Loyalty & referral schemas are empty despite accepting user input
**Severity**: High  
**File**: `features/customer/loyalty/schema.ts:3`, `features/customer/referrals/schema.ts:3`  
**Rule Violation**: Forms Pattern (“Validate inputs with Zod”) & Security checklist (validate before mutations).

**Current Code**:
```ts
export const loyaltySchema = z.object({})
export const referralsSchema = z.object({})
```

**Problem**:
- Server actions (`redeemLoyaltyPoints(points: number, rewardId?: string)`, `generateReferralCode()`, `shareReferralCode(platform, code)`) accept raw primitives without any Zod guard. Empty schemas provide a false sense of compliance while allowing arbitrary payloads.
- Once the features are activated, malicious values (negative points, malformed codes) will slip through unchecked.

**Required Fix**:
```ts
export const loyaltyRedeemSchema = z.object({
  points: z.number().int().positive('Points must be positive'),
  rewardId: z.string().uuid('Reward ID must be a valid UUID').optional(),
})

export const referralShareSchema = z.object({
  platform: z.enum(['email', 'sms', 'copy']),
  code: z.string().min(6, 'Referral code missing'),
})
```

**Steps to Fix**:
1. Define concrete schemas for each mutation (redeem, generate, share) covering bounds, enum sets, and UUID validation.
2. Apply these schemas inside `features/customer/loyalty/api/mutations.ts` and `features/customer/referrals/api/mutations.ts` before executing business logic.
3. Return descriptive error messages when validation fails; surface them in the UI.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Loyalty/referral mutations parse input via Zod and reject invalid payloads.
- [ ] Placeholder schemas removed or replaced with per-action definitions.
- [ ] Error messaging wired to UI components.

**Dependencies**: Backend decision on loyalty/referral rollout (align schema with actual tables once available).

---

### Medium Priority

#### Issue #2: Search/discovery schemas are placeholders, leaving query filters unchecked
**Severity**: Medium  
**File**: `features/customer/salon-search/schema.ts:3`, `features/customer/discovery/schema.ts:3`, `features/customer/notifications/schema.ts:3`, `features/customer/analytics/schema.ts:3`, `features/customer/chains/schema.ts:3`  
**Rule Violation**: Forms Pattern – “Define meaningful schemas aligned with feature inputs”.

**Current Code**:
```ts
export const salonSearchSchema = z.object({})
export const discoverySchema = z.object({})
```

**Problem**:
- Filter/search server utilities accept arbitrary `string | number` values (`SearchFilters`, category filters, notification params) but the exported schemas do not model those shapes.
- Without validation, malformed filters (e.g., `minRating: 'DROP TABLE'`) progress to Supabase queries unchecked; although parameterized, the lack of bounds harms DX and obscures API contracts.

**Required Fix**:
```ts
export const salonSearchSchema = z.object({
  searchTerm: z.string().trim().max(100).optional(),
  city: z.string().trim().max(80).optional(),
  state: z.string().length(2).optional(),
  isVerified: z.boolean().optional(),
  minRating: z.number().min(0).max(5).optional(),
  limit: z.number().int().min(1).max(50).default(20),
})

export const discoveryFiltersSchema = z.object({
  query: z.string().trim().max(100).optional(),
  priceRange: z.tuple([z.number().min(0), z.number().max(500)]).optional(),
})
```

**Steps to Fix**:
1. Define concrete shapes for each feature’s filter payload and export inference types.
2. Apply `.parse()`/`.safeParse()` inside the relevant server helpers (`searchSalons`, discovery filters) before building Supabase queries.
3. Propagate validation feedback to client components (show helpful error states).
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Search/discovery utilities validate filters via the new schemas.
- [ ] Placeholder schemas eliminated.
- [ ] Supabase queries receive sanitized, typed criteria only.

**Dependencies**: None.

---

## Statistics

- Total Issues: 2
- Files Affected: 7
- Estimated Fix Time: 0.5 day
- Breaking Changes: Low (adding validation guards)

---

## Next Steps

1. Replace placeholder schemas with concrete validation logic, starting with loyalty/referral mutations.
2. Adopt the new filter schemas in search/discovery APIs and bubble validation errors to the UI.

---

## Related Files

This analysis should be done after:
- [x] docs/customer-portal/05_TYPES_ANALYSIS.md

This analysis blocks:
- [ ] docs/customer-portal/07_SECURITY_ANALYSIS.md
