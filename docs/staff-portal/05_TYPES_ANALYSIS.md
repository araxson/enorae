# Staff Portal - Types Analysis

**Date**: 2025-10-20  
**Portal**: Staff  
**Layer**: Type Safety  
**Files Analyzed**: 132  
**Issues Found**: 2 (Critical: 0, High: 1, Medium: 1, Low: 0)

---

## Summary

Audited all TypeScript sources under `features/staff/**` for unsafe casts, misuse of generated Supabase types, and gaps in return-type annotations. No raw `any` usages remain, and every mutation/query exposes an explicit Promise return type. However, two recurring patterns weaken type guarantees: (1) profile metadata reads pull from a view while typing against the `identity` schema tables, and (2) analytics queries down-cast Supabase responses with `unknown as`, discarding compile-time validation. These violate CLAUDE.md Rule 10 and the TypeScript guidance we fetched from Context7 (“TypeScript 'unknown' Type Safety” and “Pluck properties with type safety”) by bypassing the inferred schema.

---

## Issues

### High Priority

#### Issue #1: Profile metadata queries typed against `identity` table instead of public view
**Severity**: High  
**Files**:  
- `features/staff/profile/api/queries.ts:6-27`  
- `features/staff/profile/components/profile-client.tsx:19-63`  
**Rule Violation**: CLAUDE.md Rule 2 (Use `Database['public']['Views']` for reads).

**Current Code**:
```ts
type StaffProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row']
…
supabase
  .from('profiles_metadata')
  .select('*')
  .eq('profile_id', profile.user_id)
  .maybeSingle<StaffProfileMetadata>()
```

**Problem**:
`profiles_metadata` is exposed to the app through the public view (confirmed via MCP `information_schema` query). Typing the result as the underlying identity table ignores view-level transforms (e.g., nullable columns, derived fields). This mismatch has already hidden nullability for `id` and `created_at`, and future schema changes will again bypass the compiler.

**Required Fix**:
```ts
type StaffProfileMetadata = Database['public']['Views']['profiles_metadata']['Row']
…
const metadataResult = await supabase
  .from('profiles_metadata')
  .select('*')
  .eq('profile_id', profile.user_id)
  .maybeSingle<StaffProfileMetadata>()
```
Update the React component import similarly so UI state reflects the correct view type.

**Steps to Fix**:
1. Swap both definitions to `Database['public']['Views']['profiles_metadata']`.  
2. Remove redundant runtime null checks that were compensating for wrong types.  
3. Run `npm run typecheck` to catch any downstream adjustments needed.

**Acceptance Criteria**:
- [ ] All profile metadata reads rely on the generated view type.  
- [ ] No `identity` table types remain in read paths.  
- [ ] TypeScript build passes.

**Dependencies**: None

---

### Medium Priority

#### Issue #2: Analytics queries coerce Supabase data with `unknown as`
**Severity**: Medium  
**File**: `features/staff/analytics/api/queries.ts:182-205,253-276`  
**Rule Violation**: CLAUDE.md Rule 10 (Type safety) & Context7 TypeScript guidance (“TypeScript 'unknown' Type Safety”).

**Current Code**:
```ts
const staffServiceRows = (staffServices as unknown as StaffServiceWithPricing[] | null) ?? []
…
const customerAppointments = (appointments as unknown as AppointmentWithCustomerProfile[] | null) ?? []
```

**Problem**:
The code discards the typed Supabase response and blindly coerces it into bespoke interfaces. Any schema drift (missing nested relation, renamed column) will surface only at runtime, despite the generated types already providing structure.

**Required Fix**:
```ts
const { data: staffServices } = await supabase
  .from('staff_services')
  .select('service_id, services(name, service_pricing(price))')
  .returns<StaffServiceWithPricing[]>()

const staffServiceRows = staffServices ?? []
```
Do the same for `appointments`, either with `.returns<AppointmentWithCustomerProfile[]>()` or by splitting the query into typed helper functions.

**Steps to Fix**:
1. Add `.returns<...>()` (or inline generic) to the Supabase calls.  
2. Remove the double cast and rely on the typed data.  
3. Adjust downstream logic to handle `null`/`undefined` with optional chaining instead of unsafe casts.

**Acceptance Criteria**:
- [ ] No `unknown as` coercions remain in analytics queries.  
- [ ] Supabase responses use typed generics or helper functions.  
- [ ] TypeScript catches schema drift in future migrations.

**Dependencies**: None

---

## Statistics

- Total Issues: 2  
- Files Affected: 3  
- Estimated Fix Time: 4 hours  
- Breaking Changes: 0

---

## Next Steps

1. Align profile metadata types with public views.  
2. Refactor analytics queries to rely on typed Supabase responses.  
3. Proceed to validation/security audit once type-safety fixes land.

---

## Related Files

This analysis should be done after:
- [x] docs/staff-portal/04_COMPONENTS_ANALYSIS.md

This analysis blocks:
- [ ] docs/staff-portal/06_VALIDATION_ANALYSIS.md

