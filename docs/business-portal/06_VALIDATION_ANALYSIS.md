# Business Portal - Validation Analysis

**Date**: 2025-10-20
**Portal**: Business
**Layer**: Validation
**Files Analyzed**: 53
**Issues Found**: 2 (Critical: 2, High: 0, Medium: 0, Low: 0)

---

## Summary

Audited 53 `schema.ts` modules. Many features (e.g., Staff) provide thorough Zod schemas with user-facing messages, consistent with `docs/stack-patterns/forms-patterns.md` and Context7 guidance on form validation (use precise error messaging). However, pricing and coupon workflows expose completely empty schemas, meaning no validation is applied before mutations—a direct violation of CLAUDE.md Rule 6 (“Validate inputs”). Given these features mutate catalog data, the absence of schema enforcement is critical.

---

## Issues

### Critical Priority

#### Issue #1: Pricing schema is empty (no validation)
**Severity**: Critical  
**File**: `features/business/pricing/schema.ts:1-4`  
**Rule Violation**: Rule 6 – Inputs must be validated with Zod

**Current Code**:
```ts
import { z } from 'zod'

export const pricingSchema = z.object({})
export type PricingSchema = z.infer<typeof pricingSchema>
```

**Problem**: The schema does not describe any fields, so all pricing mutations run without validation. This contradicts `forms-patterns.md` (use Zod to guard inputs) and undermines the Supabase security model identified earlier.

**Required Fix**:
```ts
export const pricingRuleSchema = z.object({
  salonId: z.string().uuid('Invalid salon ID'),
  serviceId: z.string().uuid('Invalid service ID').nullable().optional(),
  ruleType: z.enum(['time', 'demand', 'loyalty'], { invalid_type_error: 'Select a pricing rule type' }),
  ruleName: z.string().min(1, 'Rule name is required').max(120, 'Rule name must be 120 characters or fewer'),
  multiplier: z.number({ invalid_type_error: 'Multiplier must be a number' }).positive().optional(),
  fixedAdjustment: z.number({ invalid_type_error: 'Adjustment must be a number' }).optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  isActive: z.boolean(),
})
export type PricingRuleInput = z.infer<typeof pricingRuleSchema>
```

**Steps to Fix**:
1. Define concrete Zod schemas for create/update/toggle pricing actions (reference DB types).
2. Re-export the inferred types for mutation inputs.
3. Update pricing mutations to parse `FormData` or request bodies through the schema.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Pricing schema validates all required fields with meaningful messages.
- [ ] Mutations parse and reject invalid pricing payloads.
- [ ] Typecheck passes.

**Dependencies**: Align with pricing rule type fixes (Layer 5).

---

#### Issue #2: Coupon schema missing entirely
**Severity**: Critical  
**File**: `features/business/coupons/schema.ts:1-4`  
**Rule Violation**: Rule 6 – Inputs must be validated with Zod

**Current Code**:
```ts
import { z } from 'zod'

export const couponsSchema = z.object({})
export type CouponsSchema = z.infer<typeof couponsSchema>
```

**Problem**: Coupon mutations (create/update/delete/bulk generate) operate without validation, enabling invalid discount values, malformed codes, or missing dates. This breaks `forms-patterns.md` and compounds the security risks identified in Layers 2–3.

**Required Fix**:
```ts
export const couponSchema = z.object({
  salonId: z.string().uuid('Invalid salon ID'),
  code: z.string().trim().min(4, 'Code must be at least 4 characters').max(20, 'Code must be 20 characters or fewer'),
  description: z.string().trim().max(200, 'Description must be 200 characters or fewer'),
  discountType: z.enum(['percentage', 'fixed'], { invalid_type_error: 'Select a discount type' }),
  discountValue: z.number({ invalid_type_error: 'Discount must be a number' }).positive('Discount must be positive'),
  validFrom: z.string().datetime('Provide a valid start date'),
  validUntil: z
    .string()
    .datetime('Provide a valid end date')
    .refine((value, ctx) => value >= ctx.parent.validFrom, { message: 'End date must be after start date' }),
  maxUses: z.number().int('Max uses must be a whole number').min(1).optional(),
  maxUsesPerCustomer: z.number().int('Max uses per customer must be a whole number').min(1).optional(),
  isActive: z.boolean().default(true),
})
export type CouponInput = z.infer<typeof couponSchema>
```

**Steps to Fix**:
1. Model coupon creation/update/bulk schemas with proper bounds and date ordering checks.
2. Parse incoming data through the schema before Supabase mutations.
3. Provide friendly error messages that align with UI copy.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Coupon handlers reject invalid discount payloads.
- [ ] Error messages surface to the UI (hooked into forms).
- [ ] Typecheck passes.

**Dependencies**: None (but complements Layer 3 fixes).

---

## Statistics

- Total Issues: 2
- Files Affected: 2
- Estimated Fix Time: 4 hours
- Breaking Changes: Potential (invalid payloads now rejected)

---

## Next Steps

1. Implement pricing/coupon schemas and wire them into mutations.
2. Re-run form validation flows to ensure error messages surface correctly.
3. Continue with Security analysis once validation gaps are patched.

---

## Related Files

This analysis should be done after:
- [x] Layer 5: Types

This analysis blocks:
- [ ] Layer 7: Security

