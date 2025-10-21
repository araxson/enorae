# Business Portal - Types Analysis

**Date**: 2025-10-20
**Portal**: Business
**Layer**: Types
**Files Analyzed**: 767
**Issues Found**: 2 (Critical: 0, High: 2, Medium: 0, Low: 0)

---

## Summary

Scanned 767 TypeScript modules beneath `features/business`. The project generally honours strict typing (no `any` usage detected) and imports `Database` types consistently. Still, several hotspots step outside CLAUDE.md TypeScript guidance and the Context7 TypeScript best practices (e.g., “Enable all strict options,” `/microsoft/typescript-website`). Most notably, pricing utilities expose `Promise<any>` because they return raw Supabase data without a declared view type, and manual transaction helpers rely on `as unknown as …` casts, undermining the type system.

---

## Issues

### High Priority

#### Issue #1: `getPricingRules` returns untyped Supabase data
**Severity**: High  
**File**: `features/business/pricing/api/queries/dynamic-pricing.ts:46-59`  
**Rule Violation**: Rule 2 – Return types must be fully typed

**Current Code**:
```ts
export async function getPricingRules(salonId: string) {
  const supabase = await createClient()
  …
  const { data, error } = await supabase
    .from('catalog.pricing_rules')
    .select('*')
    .eq('salon_id', salonId)
    .order('priority', { ascending: true })

  if (error) throw error
  return data
}
```

**Problem**: Without an explicit return type or typed view, this function leaks `Promise<any>`, weakening downstream type safety. It also queries `catalog.pricing_rules`, which is absent from `Database['public']['Views']`, compounding the uncertainty noted in Layer 2 (Queries). Context7 TypeScript best practices warn against implicit `any` returns.

**Required Fix**:
```ts
type PricingRule = Database['public']['Views']['pricing_rules_view']['Row']

export async function getPricingRules(salonId: string): Promise<PricingRule[]> {
  const { data, error } = await supabase
    .from('pricing_rules_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('priority', { ascending: true })

  if (error) throw error
  return data ?? []
}
```

**Steps to Fix**:
1. Surface a typed public view (`pricing_rules_view`) and update Supabase types.
2. Annotate the function to return `Promise<PricingRule[]>`.
3. Update callers to rely on the typed shape (no optional chaining on unknown fields).
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Function returns `PricingRule[]` instead of `any`.
- [ ] Supabase query targets a typed public view.
- [ ] Typecheck passes with no new warnings.

**Dependencies**: Requires DB view/type generation aligned with Layer 2 fix.

---

#### Issue #2: Manual transaction helpers rely on `as unknown as`
**Severity**: High  
**File**: `features/business/transactions/api/queries.ts:73-91`  
**Rule Violation**: Rule 2 – Avoid unsafe casts that hide type gaps

**Current Code**:
```ts
const { data, error } = await supabase
  .from('manual_transactions')
  .select(`
    *,
    created_by:created_by_id(id, full_name),
    staff:staff_id(id, full_name),
    customer:customer_id(id, full_name, email)
  `)
  .eq('id', id)
  .in('salon_id', accessibleSalonIds)
  .single()

if (error) {
  if (error.code === 'PGRST116') return null
  throw error
}

return data as unknown as ManualTransactionWithDetails
```

**Problem**: The double cast bypasses TypeScript’s structural checks. If Supabase returns `null` fields or mismatched shapes, runtime failures slip through. Context7 recommends precise types or post-fetch validation instead of `unknown` casting.

**Required Fix**:
```ts
const { data, error } = await supabase
  .from('manual_transactions')
  .select<ManualTransactionWithDetails>(`
    id,
    salon_id,
    transaction_at,
    transaction_type,
    total,
    created_by:created_by_id(id, full_name),
    staff:staff_id(id, full_name),
    customer:customer_id(id, full_name, email)
  `)
  .eq('id', id)
  .in('salon_id', accessibleSalonIds)
  .maybeSingle()

if (error) throw error
return data ?? null
```
*(Alternatively, use Zod to parse `data` before returning.)*

**Steps to Fix**:
1. Pass a generic to `.select<ManualTransactionWithDetails>` or use `.returns<…>()` helper.
2. Replace `.single()` + cast with `.maybeSingle()` to keep `null` typed.
3. Remove `as unknown` cast; rely on type inference or schema parsing.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] No `as unknown as` casts remain in manual transaction helpers.
- [ ] Supabase calls return strongly typed results (`ManualTransactionWithDetails | null`).
- [ ] Typecheck/test suites pass.

**Dependencies**: None

---

## Statistics

- Total Issues: 2
- Files Affected: 2
- Estimated Fix Time: 3 hours
- Breaking Changes: Low (compile-time only)

---

## Next Steps

1. Align pricing rule types once the public view is in place (ties back to Layer 2/3 fixes).
2. Refine Supabase generics (or Zod parsing) for other modules using `as unknown as`.
3. Proceed to Validation layer after reinforcing these types.

---

## Related Files

This analysis should be done after:
- [x] Layer 4: Components

This analysis blocks:
- [ ] Layer 6: Validation

