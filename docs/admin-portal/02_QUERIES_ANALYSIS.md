# Admin Portal - Queries Analysis

**Date**: 2025-10-26
**Portal**: Admin
**Layer**: Queries
**Files Analyzed**: 26
**Issues Found**: 2 (Critical: 1, High: 1, Medium: 0, Low: 0)

---

## Summary

Audited every admin query module across `features/admin/**/api/queries.ts` (including nested query helpers). Auth guards are generally routed through `requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)`, and most reads target the enriched `*_view` surfaces. However, several high-value modules still instantiate service-role clients against raw schema tables (`security.*`, `audit.*`, `identity.*`, `organization.*`), breaking the documented “views-only” rule from `docs/stack-patterns/supabase-patterns.md`. We also found a type mismatch in the dashboard’s salon helper that widens the contract of `AdminSalon` beyond what the underlying view returns.

---

## Issues

### Critical Priority

#### Issue #1: Service-role queries read raw schema tables instead of admin views
**Severity**: Critical  
**File**: `features/admin/salons/api/queries.ts:178-190`, `features/admin/moderation/api/queries.ts:264-379`, `features/admin/profile/api/queries.ts:75-101`, `features/admin/dashboard/api/queries.ts:73-89`, `features/admin/roles/api/queries.ts:113-120`, `features/admin/security/api/queries.ts:87-145`, `features/admin/security-monitoring/api/queries/security-monitoring.ts:57-104`  
**Rule Violation**: Supabase Patterns – “Reads from public views; never query schema tables directly” (`docs/stack-patterns/supabase-patterns.md`)

**Current Code**:
```ts
// features/admin/salons/api/queries.ts
supabase
  .schema('organization')
  .from('salon_settings')
  .select('salon_id, subscription_expires_at, subscription_tier, is_accepting_bookings, max_staff')

// features/admin/security/api/queries.ts
let query = supabase.schema('audit').from('audit_logs').select('*')

// features/admin/security-monitoring/api/queries/security-monitoring.ts
supabase.from('security_access_monitoring' as never).select('*')
```

**Problem**: These service-role reads bypass the hardened admin views (`salon_settings_view`, `audit_logs_view`, `security_access_monitoring_view`, etc.) that enforce RLS/tenant scoping. Supabase metadata (see `lib/types/database.types.ts`) confirms each referenced table already exposes a companion `*_view`. Querying the tables directly risks leaking fields not intended for admins, ignores RLS auditing, and contradicts the enforced pattern that “database is source of truth; code must align with view contracts.”

**Required Fix**:
```ts
// Swap to admin views and stay in public schema
const settingsResult = await supabase
  .from('salon_settings_view')
  .select('salon_id, subscription_expires_at, subscription_tier, is_accepting_bookings, max_staff')

const auditLogs = await supabase
  .from('audit_logs_view')
  .select('*')

const accessAttempts = await supabase
  .from('security_access_monitoring_view')
  .select('*')
```

**Steps to Fix**:
1. Enumerate every admin query hitting `.schema(/* */)` or casting raw table names (listed above).
2. Replace each selection with the corresponding `*_view` from the generated Supabase types, updating column lists to match actual view fields.
3. Remove `schema(...)` invocations so the public client path enforces RLS, then run `npm run typecheck` to validate inferred types.

**Acceptance Criteria**:
- [ ] All admin query modules rely solely on view names present in `Database['public']['Views']`.
- [ ] No `createServiceRoleClient()` call issues `.schema(...)` for read operations.
- [ ] TypeScript compiles without casting to raw table row types.

**Dependencies**: None

---

### High Priority

#### Issue #2: `getRecentSalons` returns mismatched `AdminSalon` shape
**Severity**: High  
**File**: `features/admin/dashboard/api/queries.ts:121-139`  
**Rule Violation**: TypeScript Patterns – “Function return types must match actual query response” (`docs/stack-patterns/typescript-patterns.md`)

**Current Code**:
```ts
const { data, error } = await supabase
  .from('admin_salons_overview_view')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10)

return (data || []) as AdminSalon[]
```

**Problem**: `AdminSalon` (from `features/admin/salons`) extends the view row with computed fields (`isVerified`, `complianceScore`, `subscriptionTier`, etc.). The dashboard query simply casts raw view rows to that richer type without populating those properties, so consumers can assume fields that never exist, leading to runtime `undefined` access and masking genuine schema drift.

**Required Fix**:
```ts
const rows = (data ?? []) as AdminSalonRow[]

return rows.map((row) => ({
  ...row,
  // explicitly derive or default the computed fields
  isVerified: Boolean(row.is_accepting_bookings),
  complianceScore: 0,
  complianceLevel: 'medium',
  subscriptionTier: null,
  // ...align with AdminSalon contract or export a slimmer type
}))
```
*or* narrow the return signature to `AdminSalonRow[]` and let callers compose against the richer helper.

**Steps to Fix**:
1. Decide whether the dashboard really needs the augmented `AdminSalon` interface; if not, change the return type to `AdminSalonRow[]`.
2. If the richer type is required, reuse the normalization logic from `features/admin/salons/api/queries.ts` (e.g., `getAllSalons`) to populate each computed field before returning.
3. Re-run `npm run typecheck` to ensure downstream imports respect the updated signature.

**Acceptance Criteria**:
- [ ] `getRecentSalons` no longer performs an unsafe type assertion to `AdminSalon`.
- [ ] Every property declared on the exported return type is backed by actual data.
- [ ] Type-checking succeeds without casting warnings.

**Dependencies**: May share helpers with the `features/admin/salons` query module.

---

### Medium Priority

_No medium-severity issues found._

---

### Low Priority

_No low-severity issues found._

---

## Statistics

- Total Issues: 2
- Files Affected: 7
- Estimated Fix Time: 6 hours
- Breaking Changes: Potential (view switch may surface latent RLS violations)

---

## Next Steps

1. Prioritize swapping raw table reads for the corresponding views, starting with security-sensitive modules (`security`, `dashboard`, `profile`).
2. Align `getRecentSalons` return typing with real data or reuse the salon normalizer.
3. Re-run the queries layer audit after fixes to confirm compliance before progressing to mutations.

---

## Related Files

This analysis should be done after:
- [x] Layer 1 – Pages analysis

This analysis blocks:
- [ ] Layer 3 – Mutations analysis
