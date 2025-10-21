# Staff Portal - Security Analysis

**Date**: 2025-10-20  
**Portal**: Staff  
**Layer**: Security  
**Files Analyzed**: 42  
**Issues Found**: 3 (Critical: 1, High: 1, Medium: 1, Low: 0)

---

## Summary

Reviewed all staff `api/*.ts` modules for auth guards, tenant scoping, and Supabase access patterns. Cross-referenced findings with Supabase MCP advisors (security + performance). All endpoints call `requireAuth`, `verifySession`, or `requireAnyRole`; however, several mutations still allow privilege escalation because they trust client-provided identifiers or miss context filters. Supabase advisors also reported “Leaked Password Protection Disabled”, so we should notify platform owners after code fixes. Issues below focus on server-side data access safeguards (CLAUDE.md Rule 8).

---

## Issues

### Critical Priority

#### Issue #1: Time-off creation trusts client-supplied `staffId`
**Severity**: Critical  
**File**: `features/staff/time-off/api/mutations.ts:42-78`  
**Rule Violation**: CLAUDE.md Rule 8 (Verify auth + tenant scoping).

**Current Code**:
```ts
const insertPayload: TimeOffRequestInsert = {
  salon_id: staffProfile.salon_id,
  staff_id: data.staffId,
  …
}
```

**Problem**:
`staffId` is appended to `FormData` on the client. The action never revalidates this against the authenticated user, so a compromised browser can submit requests for any staff member within the same salon (or guess UUIDs). RLS may block writes, but relying on it violates defense-in-depth.

**Required Fix**:
```ts
const { data: staffProfile } = await supabase
  .from('staff')
  .select('id, salon_id')
  .eq('user_id', user.id)
  .single<{ id: string; salon_id: string | null }>()

const insertPayload: TimeOffRequestInsert = {
  salon_id: staffProfile.salon_id,
  staff_id: staffProfile.id,
  …
}
```

**Steps to Fix**:
1. Derive `staffProfile.id` server-side and ignore incoming `staffId`.  
2. Reuse the new time-off schema (see Validation Issue #1) to parse form data before building the payload.  
3. Add a regression test (or QA script) that ensures spoofed IDs are rejected.

**Acceptance Criteria**:
- [ ] Authenticated staff can only create requests for themselves.  
- [ ] Spoofed `staffId` submissions fail before the DB write.  
- [ ] `npm run typecheck` passes.

**Dependencies**: None

---

### High Priority

#### Issue #2: Messaging action can target arbitrary customers
**Severity**: High  
**File**: `features/staff/clients/api/mutations.ts:39-118`  
**Rule Violation**: CLAUDE.md Rule 8 (Tenant scoping).

**Current Code**:
```ts
const { customerId, message, subject } = validation.data
// …
const { data: existingThread } = await supabase
  .from('message_threads')
  .select('id')
  .eq('salon_id', staff.salon_id)
  .eq('customer_id', customerId)
  .eq('staff_id', staff.id)
```

**Problem**:
When no thread exists, the action creates one without verifying that `customerId` belongs to the same salon (or even exists). A compromised staff account could target arbitrary customer UUIDs, leaking tenant boundaries or spamming unrelated users.

**Required Fix**:
1. Query a trusted view (e.g., `profiles`, `salon_customers_view`) to confirm the customer is linked to the staff member’s salon before creating or messaging the thread.  
2. Abort with an authorization error if the customer is outside the tenant.  
3. Prefer `returns<>` typing to reduce unsafe casts (see Type Issue #2).

**Steps to Fix**:
1. Fetch `customer_profile` via Supabase view filtered by `salon_id`.  
2. Only proceed with thread creation if the check passes.  
3. Add unit or integration tests covering cross-tenant attempts.

**Acceptance Criteria**:
- [ ] Messaging/mutation refuses customer IDs outside the staff salon.  
- [ ] Existing tenants continue to message valid customers.  
- [ ] Tests confirm attempted cross-tenant access fails.

**Dependencies**: None

---

### Medium Priority

#### Issue #3: Mark-as-read updates all threads for a staff user
**Severity**: Medium  
**File**: `features/staff/messages/api/mutations.ts:76-108`  
**Rule Violation**: CLAUDE.md Rule 8 (Tenant scoping & least privilege).

**Current Code**:
```ts
await supabase
  .schema('communication')
  .from('messages')
  .update({ is_read: true })
  .eq('to_user_id', session.user.id)
  .eq('is_read', false)
```

**Problem**:
After verifying thread ownership, the update still marks *every* unread message addressed to the staff member—across all threads—as read. A malicious actor with thread access could trigger read receipts on unrelated conversations, making audit trails unreliable.

**Required Fix**:
```ts
await supabase
  .schema('communication')
  .from('messages')
  .update({
    is_read: true,
    read_at: new Date().toISOString(),
  })
  .eq('to_user_id', session.user.id)
  .eq('context_type', 'thread')
  .eq('context_id', threadId)
  .eq('is_read', false)
```

**Steps to Fix**:
1. Add `context_id = threadId` (and `context_type = 'thread'`) filters.  
2. Record `read_at` for auditing.  
3. Regression-test that other threads keep their unread counts.

**Acceptance Criteria**:
- [ ] Only messages within the requested thread are marked as read.  
- [ ] Read receipts on other threads remain intact.  
- [ ] Tests (or QA) confirm behaviour.

**Dependencies**: None

---

## Statistics

- Total Issues: 3  
- Files Affected: 3  
- Estimated Fix Time: 6 hours  
- Breaking Changes: 0 (but issues expose tenant-boundary risks)

---

## Next Steps

1. Harden time-off actions by deriving staff IDs server-side.  
2. Scope messaging actions to salon customers only.  
3. Tighten mark-as-read query and then address Supabase advisor warning (“Leaked Password Protection Disabled”).

---

## Related Files

This analysis should be done after:
- [x] docs/staff-portal/06_VALIDATION_ANALYSIS.md

This analysis blocks:
- [x] docs/staff-portal/00_SUMMARY.md

