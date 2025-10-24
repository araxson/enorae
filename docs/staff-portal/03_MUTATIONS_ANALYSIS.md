# Staff Portal - Mutations Analysis

**Date**: 2025-10-23
**Portal**: Staff
**Layer**: Mutations
**Files Analyzed**: 18
**Issues Found**: 2 (Critical: 0, High: 2, Medium: 0, Low: 0)

---

## Summary

- All mutation entry points include the required `'use server'` directive and route writes through the Supabase server client, which aligns with the server action pattern in `docs/stack-patterns/supabase-patterns.md`.
- Most writes correctly target schema tables via `.schema('…')`, while reads inside the same functions generally rely on views for ownership checks.
- Messaging mutations mirror the query-layer problems: they look up threads by comparing `staff_id` to the auth user id and, in one case, update every unread message for the user regardless of thread.
- Revalidation is consistently triggered with `revalidatePath`, keeping UI caches fresh after mutations.

---

## Issues

### High Priority

#### Issue #1: Thread ownership check compares staff profile to auth user id
**Severity**: High  
**File**: `features/staff/messages/api/mutations.ts:28-44`  
**Rule Violation**: Rule 7 – Tenant scoping must respect staff profile IDs.

**Current Code**:
```typescript
const { data: thread, error: threadError } = await supabase
  .from('message_threads')
  .select('staff_id, customer_id')
  .eq('id', threadId)
  .single()

if (thread.staff_id !== session.user.id) {
  throw new Error('Unauthorized to send message in this thread')
}
```

**Problem**:
- `communication.message_threads.staff_id` references `organization.staff_profiles.id`, but the code compares it to `session.user.id` (auth user id). This causes legitimate staff users to hit the unauthorized branch.
- The lookup also uses the raw table; the staff portal is expected to read from a public view for consistency with RLS.

**Required Fix**:
```typescript
const staffProfile = await supabase
  .from('staff_profiles_view')
  .select('id')
  .eq('user_id', session.user.id)
  .maybeSingle()

if (!staffProfile?.id || staffProfile.id !== thread.staff_id) {
  throw new Error('Unauthorized to send message in this thread')
}
```

**Steps to Fix**:
1. Resolve the staff profile id via `staff_profiles_view` before comparing ownership.
2. Swap `.from('message_threads')` for the public view equivalent to stay on the read path mandated by the Supabase pattern.
3. Re-run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Staff with matching profiles can send thread messages without hitting the unauthorized error.
- [ ] Thread lookups use public views and staff profile IDs.

**Dependencies**: Same staff-profile linkage fix noted in the Queries layer.

---

#### Issue #2: `markThreadAsRead` updates all unread messages for a user
**Severity**: High  
**File**: `features/staff/messages/api/mutations.ts:57-84`  
**Rule Violation**: Rule 7 – Mutations must be scoped to the targeted resource.

**Current Code**:
```typescript
const { error } = await supabase
  .schema('communication')
  .from('messages')
  .update({ is_read: true, read_at: new Date().toISOString() })
  .eq('to_user_id', session.user.id)
  .eq('is_read', false)
```

**Problem**:
- No `thread_id` predicate is applied, so every unread message sent to the staff member across *all* threads is marked as read.
- As with the query issue, the thread ownership check compares `thread.staff_id` to `session.user.id`, which is inconsistent with the database schema and can block legitimate updates.

**Required Fix**:
```typescript
const { error } = await supabase
  .schema('communication')
  .from('messages')
  .update({ is_read: true, read_at: new Date().toISOString() })
  .eq('thread_id', threadId)
  .eq('to_user_id', staffProfile.id)
  .eq('is_deleted', false)
```

**Steps to Fix**:
1. Resolve the staff profile id as in Issue #1.
2. Add `thread_id` (and any other relevant scoping columns) to the update filter.
3. Keep the existing revalidation calls so the UI reflects the updated read state.

**Acceptance Criteria**:
- [ ] Only messages in the specified thread are marked read.
- [ ] Ownership checks rely on staff profile IDs, not auth user ids.

**Dependencies**: Depends on the staff profile lookup fix from Issue #1.

---

## Statistics

- Total Issues: 2
- Files Affected: 1
- Estimated Fix Time: 3 hours
- Breaking Changes: Low (logic fixes only)

---

## Next Steps

1. Implement the staff profile lookup and scope message mutations accordingly.
2. After fixes, re-run `npm run typecheck` and any messaging integration tests.

---

## Related Files

This analysis should be done after:
- [x] Layer 2 queries analysis

This analysis blocks:
- [ ] Layer 4 components evaluation
