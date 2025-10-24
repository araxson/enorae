# Staff Portal - Security Analysis

**Date**: 2025-10-23
**Portal**: Staff
**Layer**: Security
**Files Analyzed**: 72
**Issues Found**: 3 (Critical: 1, High: 2, Medium: 0, Low: 0)

---

## Summary

- Authentication helpers (`requireAuth`, `requireAnyRole`, `verifySession`) are widely used; most mutations revalidate paths after writes.
- Supabase advisors report a WARN-level item: “Leaked Password Protection Disabled” (`https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection`). This affects project-wide security posture.
- Several staff APIs bypass the mandated public views or filter data using the wrong identifiers, weakening RLS protections.
- Messaging endpoints lack proper scoping, potentially disclosing conversations belonging to other staff members.

---

## Issues

### Critical Priority

#### Issue #1: Message thread reads leak conversations across tenants
**Severity**: Critical  
**Files**:  
- `features/staff/messages/api/queries.ts:40-63`  
- `features/staff/messages/api/mutations.ts:57-84`  
**Rule Violations**: Rules 7 & 8 – All reads must be scoped by tenant/staff; RLS relies on querying public views.

**Details**:
- `getThreadMessages` selects from the raw `messages` table without a `thread_id` filter, exposing every message where the current user participates.
- `markThreadAsRead` similarly updates all messages for the user rather than the specific thread, confirming the missing scoping.
- Both functions look up the thread via `.from('message_threads')` (table) and compare `staff_id` to `session.user.id`. `staff_id` references `organization.staff_profiles.id`, so the check fails, encouraging developers to relax it or leaving the door open for data leakage.

**Required Fix**:
1. Query the approved public view (e.g., `messages_view`) and add `eq('thread_id', threadId)` alongside participant validation via the staff profile id.
2. Update the ownership check to compare against `staff_profiles_view` results.
3. Retain existing revalidation logic after tightening filters.

**Acceptance Criteria**:
- [ ] Messaging APIs only return (and update) data for the requested thread and staff profile.
- [ ] No raw table access remains for message reads.

**Dependencies**: Depends on the type-safety fix (Layer 5) to lock schemas once views are used.

---

### High Priority

#### Issue #2: Commission queries bypass RLS by hitting schema tables
**Severity**: High  
**File**: `features/staff/dashboard/api/queries.ts:139-164`  
**Rule Violation**: Rule 7 – Reads must originate from public views; RLS expects `appointments_view`.

**Details**:
- `getStaffCommission` selects from `scheduling.appointments`, the partitioned table. This sidesteps view-level RLS filters and risks pulling other salons’ revenue.
- Because the Supabase types are fallbacks, the compiler cannot flag the mismatch (see Layer 5, Issue #1).

**Required Fix**:
1. Swap `.from('appointments')` with the approved view (e.g., `appointments_view`).
2. Verify that the view exposes `total_price` (regenerate types if necessary).

**Acceptance Criteria**:
- [ ] Commission data only reads from the RLS-protected view.
- [ ] Type checks succeed with regenerated Supabase types.

---

#### Issue #3: Thread ownership checks use auth user id instead of staff profile id
**Severity**: High  
**Files**:  
- `features/staff/messages/api/queries.ts:10-37`  
- `features/staff/messages/api/mutations.ts:24-55`  
**Rule Violation**: Rule 8 – Always verify auth and tenant context.

**Details**:
- The code filters `message_threads.staff_id` by `session.user.id`. `staff_id` is a staff profile UUID, so any request with a spoofed thread id might pass the initial lookup and gain access if a matching user id exists.
- On legitimate traffic, the mismatch returns empty results, encouraging developers to weaken the check later.

**Required Fix**:
1. Resolve the staff profile via `staff_profiles_view` using `session.user.id`.
2. Filter threads and messages by `staffProfile.id`, not the auth user id.

**Acceptance Criteria**:
- [ ] Thread APIs use staff profile identifiers for authorization.
- [ ] Security tests confirm that a staff user cannot access another staff member’s threads by guessing thread ids.

---

## Statistics

- Total Issues: 3
- Files Affected: 2 (shared modules)
- Estimated Fix Time: 5 hours
- Breaking Changes: Medium (scoping changes will affect UI flows)

---

## Next Steps

1. Patch messaging APIs to enforce thread- and staff-level scoping.
2. Switch all commission/risk-prone queries to public views.
3. Enable Supabase leaked-password protection and regenerate database types to confirm compliance.

---

## Related Files

This analysis should be done after:
- [x] Layer 6 validation review

This analysis blocks:
- [ ] Final summary report
