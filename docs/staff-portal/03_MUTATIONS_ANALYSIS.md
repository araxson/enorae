# Staff Portal - Mutations Analysis

**Date**: 2025-10-20  
**Portal**: Staff  
**Layer**: Mutations  
**Files Analyzed**: 19  
**Issues Found**: 6 (Critical: 2, High: 2, Medium: 2, Low: 0)

---

## Summary

Audited every `features/staff/**/api/mutations.ts` entry point (and supporting sub-modules) for `'use server'` directives, auth enforcement, schema-writing compliance, and cache revalidation. All files include the server directive and enforce auth via `requireAuth`, `verifySession`, or role checks. However, several mutations violate CLAUDE.md Rule 7 (writes must target schema tables) by inserting/updating public views, and two messaging handlers skip thread scoping, conflicting with the Supabase security guidance we confirmed via Context7 (“Authorize Server Actions”). We also confirmed via `information_schema` that `time_off_requests_view` is only exposed as a public view—writing through it fails at runtime. Type safety gaps (ignoring generated schemas) surface again, echoing the TypeScript best practice citation (“Pluck properties with type safety”) retrieved earlier.

---

## Issues

### Critical Priority

#### Issue #1: Staff metadata update queries invalid `profiles.user_id`
**Severity**: Critical  
**File**: `features/staff/profile/api/mutations.ts:103-123`  
**Rule Violation**: CLAUDE.md Rule 10 (Type safety) & Context7 TypeScript best practice (using schema types to avoid invalid keys).

**Current Code**:
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('id')
  .eq('user_id', session.user.id)
  .single<{ id: string }>()
```

**Problem**:
The `public.profiles` view exposes `id` (already the auth UUID) but no `user_id`. Supabase throws `column profiles.user_id does not exist`, so every metadata update fails.

**Required Fix**:
```typescript
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('id')
  .eq('id', session.user.id)
  .maybeSingle<{ id: string }>()

if (profileError) throw profileError
if (!profile?.id) {
  return { success: false, error: 'Profile not found' }
}
```

**Steps to Fix**:
1. Filter by `eq('id', session.user.id)` and capture `profileError`.
2. Swap `single()` with `maybeSingle()` to avoid thrown errors on missing rows.
3. Re-run `npm run typecheck` to ensure generated types protect against similar mistakes.

**Acceptance Criteria**:
- [ ] Staff metadata updates succeed for authenticated users without PostgREST errors.  
- [ ] No reliance on non-existent `user_id` columns.  
- [ ] TypeScript build remains clean.

**Dependencies**: None

---

#### Issue #2: Time-off mutations write through read-only view
**Severity**: Critical  
**File**: `features/staff/time-off/api/mutations.ts:55-127`  
**Rule Violation**: CLAUDE.md Rule 7 (Writes go to schema tables) & Supabase pattern (“Writes to schema tables”).

**Current Code**:
```typescript
const { error: insertError } = await supabase
  .schema('scheduling')
  .from('time_off_requests_view')
  .insert<TimeOffRequestInsert>(insertPayload)
```

**Problem**:
`time_off_requests_view` lives in `public` and is not meant for writes. Inserts/updates through the view fail, so creating, approving, or rejecting requests never persists state.

**Required Fix**:
```typescript
const { error: insertError } = await supabase
  .schema('scheduling')
  .from('time_off_requests')
  .insert(insertPayload)
```

Apply the same change to every `.update()` call.

**Steps to Fix**:
1. Replace every `.from('time_off_requests_view')` with the underlying table `time_off_requests`.
2. Ensure filter columns (`staff_id`, `salon_id`, etc.) still match table schema.
3. Retest actions (create/approve/reject/update/cancel) end-to-end.

**Acceptance Criteria**:
- [ ] All time-off mutations persist changes in `scheduling.time_off_requests`.  
- [ ] No PostgREST errors about read-only relations.  
- [ ] Revalidate paths fire only after successful writes.

**Dependencies**: Blocks Issue #3 fix.

---

### High Priority

#### Issue #3: Time-off creation trusts user-supplied `staffId`
**Severity**: High  
**File**: `features/staff/time-off/api/mutations.ts:42-78`  
**Rule Violation**: CLAUDE.md Rule 8 (Verify auth and tenant scoping).

**Current Code**:
```typescript
const insertPayload: TimeOffRequestInsert = {
  salon_id: staffProfile.salon_id,
  staff_id: data.staffId,
  // …
}
```

**Problem**:
The form controls `staffId`, letting a malicious actor submit requests on behalf of another stylist. RLS may block it, but relying on RLS undermines defense-in-depth.

**Required Fix**:
```typescript
const { data: staffProfile } = await supabase
  .from('staff')
  .select('id, salon_id')
  .eq('user_id', user.id)
  .single<{ id: string; salon_id: string | null }>()

const insertPayload = {
  salon_id: staffProfile.salon_id,
  staff_id: staffProfile.id,
  // …
}
```

**Steps to Fix**:
1. Retrieve the authenticated staff member’s `id` and override any incoming `staffId`.
2. Validate that the salon matches before insertion.
3. Update other mutations (`updateTimeOffRequest`, `cancelTimeOffRequest`) to reuse the server-derived staff ID where comparisons occur.

**Acceptance Criteria**:
- [ ] Requests always record the authenticated staff member’s ID.  
- [ ] Attempts to spoof another staff ID are ignored or rejected.  
- [ ] All existing behaviour remains functional.

**Dependencies**: Requires Issue #2 resolution.

---

#### Issue #4: Messaging mutations ignore thread scoping metadata
**Severity**: High  
**File**: `features/staff/messages/api/mutations.ts:34-138`  
**Rule Violation**: CLAUDE.md Rule 8 (Tenant scoping) & Context7 Next.js “Authorize Server Actions”.

**Current Code**:
```typescript
// sendThreadMessage
.insert({
  from_user_id: session.user.id,
  to_user_id: thread.customer_id,
  content: validated.content,
  context_type: 'general',
})

// markThreadAsRead
.update({ is_read: true })
.eq('to_user_id', session.user.id)
.eq('is_read', false)
```

**Problem**:
- New thread replies omit `context_id` and use `context_type: 'general'`, so they are not tied to the thread in downstream queries.  
- Mark-as-read updates every unread message addressed to the staff member across all threads, not just the target thread.

**Required Fix**:
```typescript
// sendThreadMessage
.insert({
  from_user_id: session.user.id,
  to_user_id: thread.customer_id,
  content: validated.content,
  context_type: 'thread',
  context_id: threadId,
  is_read: false,
  is_edited: false,
  is_deleted: false,
})

// markThreadAsRead
.update({ is_read: true, read_at: new Date().toISOString() })
.eq('to_user_id', session.user.id)
.eq('context_type', 'thread')
.eq('context_id', threadId)
.eq('is_read', false)
```

**Steps to Fix**:
1. Include `context_type: 'thread'` and `context_id: threadId` when inserting thread replies.
2. Tighten the `markThreadAsRead` filter to the same thread ID.
3. Add regression test (or manual QA) to ensure only the intended thread updates.

**Acceptance Criteria**:
- [ ] Thread replies immediately appear within the correct conversation.  
- [ ] Mark-as-read affects only messages inside `threadId`.  
- [ ] No cross-thread state leakage occurs.

**Dependencies**: None

---

### Medium Priority

#### Issue #5: Time-off mutations revalidate business routes
**Severity**: Medium  
**File**: `features/staff/time-off/api/mutations.ts:70-134`  
**Rule Violation**: CLAUDE.md Rule 5 (UI consistency) – staff actions should refresh staff portal pages.

**Current Code**:
```typescript
revalidatePath('/business/time-off')
```

**Problem**:
Staff actions (create/approve/reject) invalidate the business portal route, leaving `/staff/time-off` stale until manual refresh.

**Required Fix**:
```typescript
revalidatePath('/staff/time-off')
revalidatePath('/business/time-off') // optional if business portal also reflects changes
```

**Steps to Fix**:
1. Update each mutation to revalidate staff-facing paths.  
2. Keep business revalidation only if business views consume the same data.

**Acceptance Criteria**:
- [ ] Staff time-off page reflects changes immediately after mutation.  
- [ ] Optional: business portal still updates if required.

**Dependencies**: Requires Issues #2–#3 so revalidation fires after successful writes.

---

#### Issue #6: Schedule creation revalidates wrong route
**Severity**: Medium  
**File**: `features/staff/schedule/api/staff-schedules/create.ts:57-58`  
**Rule Violation**: CLAUDE.md Rule 5 (UI consistency).

**Current Code**:
```typescript
revalidatePath('/business/staff/schedules')
```

**Problem**:
Staff-created schedules don’t refresh `/staff/schedule`, leading to stale calendars.

**Required Fix**:
```typescript
revalidatePath('/staff/schedule')
revalidatePath('/business/staff/schedules') // only if business portal relies on it
```

**Steps to Fix**:
1. Adjust revalidation paths in `create`, `update`, and `delete` actions within the schedule module.  
2. Verify UI updates without manual refresh.

**Acceptance Criteria**:
- [ ] Staff schedule view shows new entries immediately.  
- [ ] No regression for business portal if it uses the same action.

**Dependencies**: None

---

## Statistics

- Total Issues: 6  
- Files Affected: 4  
- Estimated Fix Time: 12 hours  
- Breaking Changes: 0 (but fixes unblock non-functional flows)

---

## Next Steps

1. Redirect time-off writes to `scheduling.time_off_requests` and lock down the staff ID handling.  
2. Patch messaging thread logic to include proper context scoping.  
3. Align revalidation paths with staff portal routes, then proceed to validation layer analysis.

---

## Related Files

This analysis should be done after:
- [x] docs/staff-portal/02_QUERIES_ANALYSIS.md

This analysis blocks:
- [ ] docs/staff-portal/04_COMPONENTS_ANALYSIS.md

