# Customer Portal - Queries Analysis

**Date**: 2025-10-25
**Portal**: Customer
**Layer**: Queries
**Files Analyzed**: 22
**Issues Found**: 6 (Critical: 2, High: 4, Medium: 0, Low: 0)

---

## Summary

- Reviewed all Supabase read helpers under `features/customer/**/api/queries*.ts`, including dashboard submodules. Most files include `import 'server-only'` and authenticate via `requireAuth`/`verifySession`, aligning with `docs/stack-patterns/supabase-patterns.md`.
- Several query modules still target schema tables (`organization.salons`, `scheduling.appointment_services`, `scheduling.appointments`, etc.) instead of the public views mandated by the pattern guide and Context7 Next.js/Supabase best practices. These violate the “database views are source of truth” rule and risk bypassing RLS guarantees.
- Some modules (loyalty, referrals) return placeholder data while referencing tables that do not exist in the retrieved Supabase schema, contradicting the Phase 1.5 directive that application code must reflect the actual database.
- Identified type mismatches where code references `Database['public']['Views']` entries that do not exist (e.g., `salons`, `sessions`, `appointment_services`), which breaks TypeScript strictness and signals schema drift.

---

## Issues

### Critical Priority

#### Issue #1: Chain queries bypass public views for salon locations
**Severity**: Critical  
**File**: `features/customer/chains/api/queries.ts:8` & `features/customer/chains/api/queries.ts:82-135`  
**Rule Violation**: Supabase Pattern Rule #1 – Reads must target public views, not schema tables.

**Current Code**:
```typescript
type Salon = Database['public']['Views']['salons']['Row']
// ...
const { data: locations } = await supabase
  .schema('organization')
  .from('salons')
  .select('id, name, slug, formatted_address, city, state_province, rating_average, rating_count, is_verified')
  .eq('chain_id', chain['id']!)
```

**Problem**:
- `Database['public']['Views']['salons']` does not exist in `lib/types/database.types.ts`, so this type alias fails under strict mode.
- Both `getSalonChainById` and `getChainLocations` read directly from `organization.salons`. This bypasses the required `salons_view`, breaks tenant scoping, and conflicts with the retrieved Supabase schema (which exposes chain metadata via views only).

**Required Fix**:
```typescript
type Salon = Database['public']['Views']['salons_view']['Row']

const { data: locations, error } = await supabase
  .from('salons_view')
  .select('id, name, slug, formatted_address, city, state_province, rating_average, rating_count, is_verified')
  .eq('chain_id', chain.id)
  .eq('is_active', true)
  .order('name', { ascending: true })
```

**Steps to Fix**:
1. Update the type alias to use `salons_view`.
2. Replace `.schema('organization').from('salons')` with the approved public view (confirm the view exposes `chain_id`; otherwise add a new view per schema-first guidance).
3. Ensure the returned object maps only columns actually present on the view.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] All reads in `features/customer/chains/api/queries.ts` use public views only.
- [ ] TypeScript type aliases reference existing `Database['public']['Views']` members.
- [ ] `npm run typecheck` passes.

**Dependencies**: Requires database view exposing chain locations (coordinate with backend if missing).

---

#### Issue #2: Dashboard metrics queries hit raw tables
**Severity**: Critical  
**File**: `features/customer/dashboard/api/queries/metrics.ts:15-28`, `features/customer/dashboard/api/queries/appointments.ts:14-37`, `features/customer/dashboard/api/queries/roles.ts:14-18`, `features/customer/dashboard/api/queries/vip.ts:35-56`, `features/customer/dashboard/api/queries/favorites.ts:13-18`  
**Rule Violation**: Supabase Pattern Rule #1 – Reads must target public views; CLAUDE.md Frequent Violation #7.

**Current Code**:
```typescript
supabase.from('appointments').select('*', { count: 'exact', head: true })
supabase.from('customer_favorites').select('*')
supabase.from('user_roles').select('role')
```

**Problem**:
- All dashboard queries pull from schema tables (`appointments`, `customer_favorites`, `user_roles`) instead of the published views (`appointments_view`, `customer_favorites_view`, `user_roles_view`).
- This bypasses RLS protections and causes type mismatches against `Database['public']['Views']`.
- Violates Context7 Supabase guidance gathered in Phase 1, risking unauthorized data leakage and brittle schema assumptions.

**Required Fix**:
```typescript
const baseAppointments = supabase
  .from('appointments_view')
  .select('*', { count: 'exact', head: true })
  .eq('customer_id', session.user.id)

const { count: favoritesCount } = await supabase
  .from('customer_favorites_view')
  .select('id', { count: 'exact', head: true })
  .eq('customer_id', session.user.id)

const { data: roleData } = await supabase
  .from('user_roles_view')
  .select('role')
  .eq('user_id', session.user.id)
  .maybeSingle()
```

**Steps to Fix**:
1. Swap every `.from('appointments')`, `.from('customer_favorites')`, `.from('user_roles')` call for the corresponding public view.
2. Update any derived types (e.g., `AppointmentWithDetails`) to align with the view shape or create portal-specific DTOs.
3. Retest downstream components relying on these queries.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Dashboard query modules reference only `*_view` sources.
- [ ] TypeScript annotations align with the view columns.
- [ ] Downstream dashboard components still render expected data after swap.

**Dependencies**: None (views already exist in Supabase schema export).

---

### High Priority

#### Issue #3: Appointment services query uses scheduling table directly
**Severity**: High  
**File**: `features/customer/appointments/api/queries.ts:6-64`  
**Rule Violation**: Supabase Pattern Rule #1 – Reads must target public views; Type Safety rule (nonexistent view type).

**Current Code**:
```typescript
type AppointmentService = Database['public']['Views']['appointment_services']['Row']
// ...
const { data, error } = await supabase
  .from('appointment_services')
  .select('*')
  .eq('appointment_id', appointmentId)
```

**Problem**:
- There is no `appointment_services` entry under `Database['public']['Views']`; the real table lives in the `scheduling` schema. TypeScript currently resolves to `any`, violating strict typing.
- Reading the table directly sidesteps public view policies and contradicts the “views are sacred” directive.

**Required Fix**:
```typescript
type AppointmentService = Database['public']['Views']['appointment_services_view']['Row']

const { data, error } = await supabase
  .from('appointment_services_view')
  .select('*')
  .eq('appointment_id', appointmentId)
  .order('created_at', { ascending: true })
```
*(If `appointment_services_view` does not yet surface `appointment_id`, coordinate with the backend to expose it rather than hitting the schema table.)*

**Steps to Fix**:
1. Confirm the correct view name via Supabase (`appointment_services_view` or equivalent) and update the type alias.
2. Replace direct table access with the view.
3. Remove redundant cast `(appointment as Appointment)` by trusting typed view rows.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Function reads from a public view only.
- [ ] Type alias matches an existing generated view row.
- [ ] Unauthorized customer access still throws before querying services.

**Dependencies**: May require backend exposure of `appointment_services_view` with required columns.

---

#### Issue #4: Session queries misaligned with Supabase sessions view
**Severity**: High  
**File**: `features/customer/sessions/api/queries.ts:6-58`  
**Rule Violation**: Type Safety (invalid `Database['public']['Views']` member); Supabase Pattern Rule #1 (view naming mismatch).

**Current Code**:
```typescript
type Session = Database['public']['Views']['sessions']['Row']
const { data } = await supabase.from('sessions').select('*')
```

**Problem**:
- Supabase exports the view as `sessions_view` (see `lib/types/database.types.ts:10668`), so `Database['public']['Views']['sessions']` fails under strict type checking.
- Querying `.from('sessions')` implicitly targets the `identity.sessions` table, bypassing the intended view layering and risking leakage of non-customer sessions.

**Required Fix**:
```typescript
type Session = Database['public']['Views']['sessions_view']['Row']

const { data } = await supabase
  .from('sessions_view')
  .select('*')
  .eq('user_id', session.user.id)
  .eq('is_active', true)
  .is('deleted_at', null)
```

**Steps to Fix**:
1. Update type alias and query target to `sessions_view`.
2. Remove manual `is_current` fallback or compute it client-side based on returned metadata.
3. Verify `supabase.auth.getSession()` parity if needed for “current session” detection.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Queries use `sessions_view` exclusively.
- [ ] TypeScript compiles without indexing errors.
- [ ] Returned data set remains scoped to the authenticated user.

**Dependencies**: None.

---

#### Issue #5: Salon detail queries fetch amenities/specialties from base tables
**Severity**: High  
**File**: `features/customer/salon-detail/api/queries.ts:78-115`  
**Rule Violation**: Supabase Pattern Rule #1 – Avoid direct table reads for public features.

**Current Code**:
```typescript
const { data: amenitiesData } = await supabase
  .from('salon_amenities')
  .select('amenities(id, name, icon)')
  .eq('salon_id', salon['id']!)

const { data: specialtiesData } = await supabase
  .from('salon_specialties')
  .select('specialties(id, name, category)')
  .eq('salon_id', salon['id']!)
```

**Problem**:
- Both `salon_amenities` and `salon_specialties` are schema tables (see Supabase schema export), so this read bypasses public RLS policies.
- The query assumes nested relationships that may not be exposed outside the view layer, risking runtime errors if the table schema shifts.

**Required Fix**:
```typescript
const { data: amenitiesData } = await supabase
  .from('salon_amenities_view')
  .select('amenity_id, amenity_name, amenity_icon')
  .eq('salon_id', salon.id)

const amenities = (amenitiesData ?? []).map((row) => ({
  id: row.amenity_id,
  name: row.amenity_name,
  icon: row.amenity_icon,
}))
```
*(Adjust to actual column names once the view is confirmed; if a view is missing, create one per database-first policy.)*

**Steps to Fix**:
1. Identify the correct public views for amenities/specialties (or add them).
2. Update selections to match the view column names; avoid nested table joins if the view flattens data.
3. Update downstream components to consume the normalized shape.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Amenities and specialties data come from public views.
- [ ] DTO mapping reflects real view columns.
- [ ] Salon detail page continues to display amenities/specialties.

**Dependencies**: May require exposure of `salon_amenities_view` / `salon_specialties_view`.

---

#### Issue #6: Loyalty & referrals queries out of sync with Supabase schema
**Severity**: High  
**File**: `features/customer/loyalty/api/queries.ts:21-50`, `features/customer/referrals/api/queries.ts:14-43`  
**Rule Violation**: Phase 1.5 Database Alignment – “Database is source of truth”; Type Safety (placeholder responses).

**Current Code**:
```typescript
const { data: { user } } = await supabase.auth.getUser()
// TODO: loyalty_points table not yet in database schema
return null
```

**Problem**:
- Supabase schema inspection confirms no `loyalty_*` or `referrals` tables, yet the feature exposes APIs that return hard-coded fallbacks. This contradicts the alignment directive and misleads downstream components into thinking data exists.
- Uses `supabase.auth.getUser()` instead of `requireAuth`, weakening the consistent auth enforcement pattern.

**Required Fix**:
```typescript
// Option A: Remove dead APIs until schema exists.
throw new Error('Loyalty program not yet available')

// Option B: Align with actual view/table names once backend publishes them.
const { data } = await supabase
  .from('loyalty_balances_view')
  .select('*')
  .eq('customer_id', session.user.id)
  .maybeSingle()
```

**Steps to Fix**:
1. Confirm with backend whether loyalty/referral schema exists; if not, remove or feature-flag the server queries.
2. Swap `supabase.auth.getUser()` for `requireAuth`/`verifySession`.
3. Once schema is available, wire queries to the real `*_view` resources and provide typed responses.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] APIs do not reference nonexistent tables.
- [ ] Auth is enforced via shared helpers.
- [ ] UI gracefully handles unsupported features (e.g., feature flag or explicit error).

**Dependencies**: Backend roadmap for loyalty/referrals data model.

---

## Statistics

- Total Issues: 6
- Files Affected: 9
- Estimated Fix Time: 2.5 days
- Breaking Changes: High (auth + data-layer adjustments required)

---

## Next Steps

1. Prioritize Critical issues: refactor chain and dashboard queries to rely exclusively on public views and regenerate types.
2. Address High issues: align appointment services, sessions, salon detail, and loyalty/referrals modules with the Supabase schema.
3. Re-run `npm run typecheck` and regression tests for customer dashboard and salon detail flows after refactors.

---

## Related Files

This analysis should be done after:
- [x] docs/customer-portal/01_PAGES_ANALYSIS.md

This analysis blocks:
- [ ] docs/customer-portal/03_MUTATIONS_ANALYSIS.md
- [ ] docs/customer-portal/05_TYPES_ANALYSIS.md
