# Business Portal - Queries Analysis

**Date**: 2025-10-25  
**Portal**: Business  
**Layer**: Queries  
**Files Analyzed**: 37  
**Issues Found**: 3 (Critical: 1, High: 1, Medium: 1, Low: 0)

---

## Summary

- Audited every `features/business/**/api/queries.ts` entry point plus collocated helper modules; all had the required `import 'server-only'` directive.
- Auth gating is generally wired through `requireAnyRole` / `canAccessSalon`, but several helper utilities still expose multi-tenant data via direct table reads.
- Supabase MCP schema dump (2025-10-25) shows all salon-related read models live under `public.Views.*_view`; multiple query modules are still targeting legacy names (`salons`, `staff`, `messages`) that no longer exist.
- Most queries omit `.returns<...>()`, leaving implicit `any` responses and hiding schema drift until runtime.
- Identified three schema-alignment regressions that violate `docs/stack-patterns/supabase-patterns.md` guidance: reads must resolve against public views, and type aliases must mirror generated Supabase types.

---

## Issues

### Critical Priority

#### Issue #1: Business Salon Query Targets Nonexistent `salons` View
**Severity**: Critical  
**File**: `features/business/business-common/api/queries/salon.ts:6-90`  
**Rule Violation**: Supabase Query Rule — `docs/stack-patterns/supabase-patterns.md` (“Reads from public views”) / Database Source of Truth (Phase 1.5)

**Current Code**:
```typescript
type Salon = Database['public']['Views']['salons']['Row']
…
const { data, error } = await supabase
  .from('salons')
  .select('*')
  .eq('id', salonId)
  .single()
```

**Problem**:
- Supabase types generated on 2025-10-25 expose `public.Views.salons_view` (see `mcp__supabase__generate_typescript_types` output); there is no `salons` view in `public.Views`.
- The select hits `public.salons`, which the database does not expose. Resulting requests fail at runtime with `relation "public.salons" does not exist`, blocking every downstream feature importing `getUserSalon`.
- Type alias uses a nonexistent key (`Views['salons']`), so strict type checking produces `TS2339` once `npm run typecheck` runs with fresh types.
- The helper also queries `supabase.from('staff')` later in the file, which suffers from the same issue (`staff_profiles_view` exists, `staff` does not).

**Required Fix**:
```typescript
type Salon = Database['public']['Views']['salons_view']['Row']

const { data, error } = await supabase
  .from('salons_view')
  .select('*')
  .eq('id', salonId)
  .single<Salon>()
```

**Steps to Fix**:
1. Replace every `.from('salons')` read with `.from('salons_view')`, ensuring `.returns<Salon>()` annotations.
2. Update all type aliases to `Database['public']['Views']['salons_view']['Row']`.
3. Swap `staff` lookups to `staff_profiles_view` (or scripted RPC) with tenant filtering.
4. Run `npm run typecheck` to confirm the regenerated database types align.

**Acceptance Criteria**:
- [ ] No remaining references to `Views['salons']` in Business portal code.
- [ ] All salon reads resolve via `salons_view` with tenant scoping filters.
- [ ] `npm run typecheck` passes without missing property errors.

**Dependencies**: None

---

### High Priority

#### Issue #2: Notifications Query Reads Raw `messages` Table
**Severity**: High  
**File**: `features/business/notifications/api/queries.ts:142-151`  
**Rule Violation**: Supabase RLS Rule — `docs/stack-patterns/supabase-patterns.md` (“Query `_view` tables for reads”) / Security best practices from Supabase MCP advisors

**Current Code**:
```typescript
const { data, error } = await supabase
  .from('messages')
  .select('*')
  .eq('to_user_id', user['id'])
  .eq('context_type', 'system')
  .order('created_at', { ascending: false })
  .limit(limit)
```

**Problem**:
- `public.Views` exposes `communication_message_threads_view`, but there is no `messages` view. The call drops to `public.messages`, bypassing the security-definer view hardening flagged by Supabase advisors (security_definer on `appointments_view`, etc.).
- Direct table access ignores tenant filters; if RLS ever misconfigures, business users could read arbitrary private messages.
- The missing `.returns<...>()` keeps the payload typed as `any`, masking schema drift.

**Required Fix**:
```typescript
const { data, error } = await supabase
  .from('communication_message_threads_view')
  .select('*')
  .eq('salon_id', salonId) // or user scope via RPC
  .order('last_message_at', { ascending: false })
  .limit(limit)
  .returns<CommunicationMessageThread[]>()
```

**Steps to Fix**:
1. Introduce an authorized helper that scopes to accessible salon IDs (use `getUserSalonIds()`).
2. Swap the source to either an approved view (`communication_message_threads_view`) or the existing `get_notifications_page` RPC.
3. Add `.returns<...>()` to enforce strict typing.
4. Re-run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] No remaining `.from('messages')` reads in Business portal code.
- [ ] Notifications list constrained via tenancy-aware view or RPC.
- [ ] Type annotations align with Supabase generated types.

**Dependencies**: Requires updated tenant filtering helper.

---

### Medium Priority

#### Issue #3: Settings Query Uses `organization.salons` Table for Reads
**Severity**: Medium  
**File**: `features/business/settings-salon/api/queries.ts:20-27`  
**Rule Violation**: Supabase Read Rule — `docs/stack-patterns/supabase-patterns.md` (“Reads from public views”)  

**Current Code**:
```typescript
const { data, error } = await supabase
  .schema('organization')
  .from('salons')
  .select('id, name, business_name, business_type, established_at')
  .eq('id', salon.id)
  .single()
```

**Problem**:
- Pulling from the schema table sidesteps the curated `salons_view` that already contains `business_name`, `business_type`, `established_at` (verified in Supabase type dump).
- Direct table reads risk leaking columns that RLS may not mask (especially given Supabase advisor errors about security-definer views).
- Diverges from the documented pattern of treating `*_view` outputs as the contract, which complicates multi-tenant hardening.

**Required Fix**:
```typescript
const { data, error } = await supabase
  .from('salons_view')
  .select('id, name, business_name, business_type, established_at')
  .eq('id', salon.id)
  .single()
```

**Steps to Fix**:
1. Confirm `salons_view` exposes the required columns (per generated types it does).
2. Replace the schema-table read with a view query, retaining `.single<...>()`.
3. Remove the `.schema('organization')` call to avoid bypassing views.
4. Run `npm run typecheck` and exercise the settings form.

**Acceptance Criteria**:
- [ ] All settings reads use `salons_view`.
- [ ] No schema-table reads remain for Business portal fetch operations.
- [ ] Manual QA confirms settings page renders.

**Dependencies**: None

---

## Statistics

- Total Issues: 3
- Files Affected: 3
- Estimated Fix Time: 4 hours
- Breaking Changes: Potential (view contract updates)

---

## Next Steps

1. Prioritize the `getUserSalon` fix—business dashboard and downstream queries depend on it.
2. Refactor notifications fetch to the sanctioned Supabase view/RPC.
3. Sweep remaining query helpers for lingering table reads once view swaps land.

---

## Related Files

This analysis should be done after:
- [x] `docs/business-portal/01_PAGES_ANALYSIS.md`

This analysis blocks:
- [ ] `docs/business-portal/03_MUTATIONS_ANALYSIS.md`
