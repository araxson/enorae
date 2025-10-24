# Staff Portal - Queries Analysis

**Date**: 2025-10-23
**Portal**: Staff
**Layer**: Queries
**Files Analyzed**: 18
**Issues Found**: 4 (Critical: 1, High: 3, Medium: 0, Low: 0)

---

## Summary

- Confirmed every `features/staff/**/api/queries.ts` file includes the required `import 'server-only'` directive and relies on Supabase server clients, matching the Supabase server pattern from `/supabase/supabase` best practices.
- Authentication helpers vary (`requireAuth`, `requireAnyRole`, `verifySession`); most functions validate the current user before querying.
- Several modules still query schema tables (`appointments`, `profiles_metadata`, `messages`, `message_threads`) instead of the mandated public views, violating Rule 7 from `docs/stack-patterns/supabase-patterns.md`.
- Messaging queries mis-handle staff identity, comparing `staff_id` against the auth user id rather than the staff profile id, which breaks tenant isolation.
- Attempted to generate up-to-date Supabase types, but `supabase__generate_typescript_types` returned `PGRST002`; current `lib/types/database.types.ts` is a minimal fallback, so code relies on untyped rows. Documented under each issue where schema confirmation is blocked.
- Supabase advisors report one security warning (leaked password protection disabled) and a large number of unused index notices; no direct action taken in this layer, but linked remediation URL is `https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection`.

---

## Issues

### Critical Priority

#### Issue #1: Thread message query leaks cross-thread data
**Severity**: Critical  
**File**: `features/staff/messages/api/queries.ts:40-63`  
**Rule Violation**: Rule 7 – Reads must stay within tenant scope; React Server Component pattern (React docs) expects precise data selection.

**Current Code**:
```typescript
const { data, error } = await supabase
  .from('messages')
  .select('*')
  .or(`from_user_id.eq.${session.user.id},to_user_id.eq.${session.user.id}`)
  .eq('is_deleted', false)
  .order('created_at', { ascending: true })
```

**Problem**:
- The query never filters by `threadId`, so it returns *every* message involving the logged-in user, exposing content from unrelated threads.
- `messages` is the raw schema table, bypassing any view-level tenant filtering that would normally be applied.

**Required Fix**:
```typescript
const { data, error } = await supabase
  .from('messages_view')
  .select('*')
  .eq('thread_id', threadId)
  .in('participant_id', [session.user.id, staffProfileId])
  .eq('is_deleted', false)
  .order('created_at', { ascending: true })
```
*(Replace `messages_view`/`participant_id` with the actual public view + column names once schema types are available; ensure both staff profile and customer participation are enforced.)*

**Steps to Fix**:
1. Introduce or use the existing public view that scopes messages by thread and participant.
2. Add an `eq('thread_id', threadId)` predicate and ensure participant filtering respects both staff and customer sides.
3. Re-run `supabase__generate_typescript_types` once the API issue is resolved to confirm the view schema.
4. Re-run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Query only returns messages for the requested `threadId`.
- [ ] All reads use the approved public view, not schema tables.
- [ ] TypeScript definitions align with the actual view columns.

**Dependencies**: Requires accurate public view definition for staff messaging.

---

### High Priority

#### Issue #2: `getStaffCommission` reads from partitioned tables directly
**Severity**: High  
**File**: `features/staff/dashboard/api/queries.ts:139-164`  
**Rule Violation**: Rule 7 – Reads must use public views; Supabase best practice discourages querying partition parents (`scheduling.appointments`).

**Current Code**:
```typescript
const [todayResult, weekResult, monthResult] = await Promise.all([
  supabase.from('appointments').select('total_price')...
  ...
])
```

**Problem**:
- `appointments` is a partitioned schema table in `scheduling`; querying it bypasses view-level RLS and can break when Supabase rotates partitions.
- The minimal types file offers no guarantees about columns (only `[key: string]: any`), so runtime bugs won’t be surfaced during type checking.

**Required Fix**:
```typescript
const source = supabase.from('appointments_view').select('total_price, commission_rate')
```
*(Update selected columns to match the actual view; include the commission inputs you need and compute totals client-side.)*

**Steps to Fix**:
1. Switch every `.from('appointments')` to the approved public view (likely `appointments_view`).
2. Confirm the view exposes the necessary pricing columns (generate types once the Supabase endpoint is healthy).
3. Re-run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Commission logic only reads from the sanctioned view.
- [ ] No schema-table queries remain in the staff dashboard API.

**Dependencies**: Await successful regeneration of Supabase types for column validation.

---

#### Issue #3: Staff profile details query bypasses view layer
**Severity**: High  
**File**: `features/staff/profile/api/queries.ts:47-57`  
**Rule Violation**: Rule 7 – Reads from schema tables (`profiles_metadata` in `identity`); Supabase guidance recommends exposing that data via a public view.

**Current Code**:
```typescript
supabase
  .from('profiles_metadata')
  .select('*')
  .eq('profile_id', profile.user_id)
```

**Problem**:
- `profiles_metadata` lives in the `identity` schema (See `supabase__list_tables` output); querying it directly sidesteps the view layer and risks leaking cross-tenant data.
- The minimal type file explicitly classifies `profiles_metadata` under `Database['identity']['Tables']`, affirming this is a table access, not a view.

**Required Fix**:
```typescript
supabase
  .from('profiles_metadata_view')
  .select('full_name, avatar_url, ...')
  .eq('profile_id', profile.user_id)
```
*(Use the actual public view name; if it doesn’t exist, create one in the database and update the generated types.)*

**Steps to Fix**:
1. Expose the necessary metadata via a public view (or reuse an existing one).
2. Update the code to reference that view and narrow the selected columns.
3. Re-run Supabase type generation to regain static coverage.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] No `.from('profiles_metadata')` or other schema tables remain.
- [ ] TypeScript uses `Database['public']['Views'][...]` for metadata reads.

**Dependencies**: Depends on availability of a metadata view in the public schema.

---

#### Issue #4: Message thread filtering uses wrong identifier and bypasses views
**Severity**: High  
**File**: `features/staff/messages/api/queries.ts:11-78`  
**Rule Violation**: Rule 7 – Reads must filter by tenant scope, and must use public views. Database schema (`communication.message_threads.staff_id`) points to `organization.staff_profiles.id`, not the auth user id.

**Current Code**:
```typescript
.from('message_threads')
.eq('staff_id', session.user.id)
```

**Problem**:
- `session.user.id` is an auth user id (from Supabase Auth), but `staff_id` references the staff profile. As a result, queries return empty sets or require future manual fixes, and they don’t enforce tenant scoping through staff ownership.
- The code also hits the raw `message_threads` table instead of a curated view, amplifying the RLS risk noted in Supabase patterns.

**Required Fix**:
```typescript
const staffProfile = await supabase
  .from('staff_profiles_view')
  .select('id')
  .eq('user_id', session.user.id)
  .maybeSingle()

const staffId = staffProfile?.id
// ...
await supabase
  .from('message_threads_view')
  .select('*')
  .eq('staff_id', staffId)
```

**Steps to Fix**:
1. Resolve the staff profile id up front via `staff_profiles_view`.
2. Query the public `message_threads` view (or create one) and filter by the staff profile id.
3. Update `getUnreadCount`/`getThreadById` to reuse the resolved staff id.
4. Re-run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Messaging queries filter by the staff profile id and use public views.
- [ ] Unit or integration tests confirm staff only sees their own threads.

**Dependencies**: Requires consistent staff-profile linkage in the database views.

---

## Statistics

- Total Issues: 4
- Files Affected: 3
- Estimated Fix Time: 6 hours
- Breaking Changes: Potential (switching to views may require DB support)

---

## Next Steps

1. Address critical bug in `getThreadMessages` to restore message isolation.
2. Move all remaining queries off schema tables (`appointments`, `profiles_metadata`, `messages`, `message_threads`) onto public views.
3. Regenerate Supabase types once API access is restored (`supabase__generate_typescript_types`) and re-run `npm run typecheck`.

---

## Related Files

This analysis should be done after:
- [x] Layer 1 page shell review

This analysis blocks:
- [ ] Layer 3 mutations evaluation
