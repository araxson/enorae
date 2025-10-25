# Business Portal - Security Analysis

**Date**: 2025-10-25  
**Portal**: Business  
**Layer**: Security  
**Files Analyzed**: 182  
**Issues Found**: 3 (Critical: 0, High: 2, Medium: 1, Low: 0)

---

## Summary

- Reviewed all Business portal data-access layers (`features/business/**/api/*.ts`) with a focus on tenant isolation, RLS conformance, and Supabase advisor output.
- Most entry points enforce `requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)` and verify salon access via helper guards.
- Identified recurring bypasses where helpers query raw schema tables (`messages`, `staff`, `appointments`) instead of the hardened `_view` relations. These bypasses undermine Supabase RLS guarantees and conflict with the “Database is the source of truth” directive from Phase 1.
- Supabase advisors (2025-10-25) flagged six security-definer views in `public` (`admin_salons_overview_view`, `appointments_view`, etc.), highlighting the need to consume curated views exclusively.

---

## Issues

### High Priority

#### Issue #1: Notifications Query Bypasses RLS by Reading `messages` Table
**Severity**: High  
**File**: `features/business/notifications/api/queries.ts:142-148`  
**Rule Violation**: Security Rule — `docs/stack-patterns/supabase-patterns.md` (“Query *_view tables, not schema tables”) / Supabase Advisor `security_definer_view_public_appointments_view`

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
- Accesses `public.messages` directly. Supabase advisors warn that multiple views rely on `SECURITY DEFINER`; bypassing them skips audit logging and custom RLS filters.
- If RLS changes on `communication.messages`, Business users could read cross-tenant data.
- No explicit `.returns<...>()` means the function silently tolerates schema drift, complicating audits.

**Required Fix**:
```typescript
const { data, error } = await supabase
  .from('communication_message_threads_view')
  .select('*')
  .eq('salon_id', salonId)
  .order('last_message_at', { ascending: false })
  .limit(limit)
  .returns<Database['public']['Views']['communication_message_threads_view']['Row'][]>()
```
*(or replace with the `get_notifications_page` RPC which already enforces tenant scoping.)*

**Steps to Fix**:
1. Introduce scoped helpers to fetch notifications via approved views/RPCs.
2. Remove the table query and add explicit typing.
3. Re-run security regression tests (manual or automated).

**Acceptance Criteria**:
- [ ] All notification reads use sanctioned views/RPCs.
- [ ] No `.from('messages')` calls remain in Business portal.
- [ ] Type-checking confirms payloads align with Supabase views.

**Dependencies**: Ties to Layer 2 Issue #2.

---

#### Issue #2: Notification Authorization Helper Reads `staff`/`appointments` Tables
**Severity**: High  
**File**: `features/business/notifications/api/mutations/helpers.ts:53-88`  
**Rule Violation**: Security Rule — `docs/stack-patterns/supabase-patterns.md` / Supabase Advisor warnings on security-definer views

**Current Code**:
```typescript
const { data: staffMemberships } = await supabase
  .from('staff')
  .select('id')
  .eq('user_id', userId)
  .in('salon_id', accessibleSalonIds)
  .limit(1)
…
const { data: customerMemberships } = await supabase
  .from('appointments')
  .select('id')
  .eq('customer_id', userId)
  .in('salon_id', accessibleSalonIds)
  .limit(1)
```

**Problem**:
- Direct table access skips the `staff_profiles_view` / `appointments_view` layers, meaning RLS policy updates or security-definer logic never run.
- If a malicious actor guesses another tenant’s user ID, they could satisfy the naive check and push notifications cross-tenant.
- The helper is central to every notification mutation (`sendNotification`, `sendAppointmentReminder`, etc.), so the blast radius is wide.

**Required Fix**:
```typescript
const { data: staffMemberships, error: staffError } = await supabase
  .from('staff_profiles_view')
  .select('id, salon_id')
  .eq('user_id', userId)
  .in('salon_id', accessibleSalonIds)
  .limit(1)
  .returns<Database['public']['Views']['staff_profiles_view']['Row'][]>()
```
…and mirror for `appointments_view`.

**Steps to Fix**:
1. Switch both membership checks to the appropriate `_view` relations.
2. Handle Supabase errors explicitly and bubble meaningful security messages.
3. Regression-test notification flows to ensure legitimate users stay authorized.

**Acceptance Criteria**:
- [ ] Membership checks rely on RLS-enforced views.
- [ ] Unauthorized IDs correctly trigger errors.
- [ ] No direct table reads remain in notification helpers.

**Dependencies**: Aligns with Layer 3 Issue #2.

---

### Medium Priority

#### Issue #3: Supabase Advisors Flag Security-Definer Views in Public Schema
**Severity**: Medium  
**File**: Supabase Advisors — `mcp__supabase__get_advisors (2025-10-25)`  
**Rule Violation**: Security Hardening Checklist — Business portal Phase 1 Step 2

**Current Finding**:
```
security_definer_view (ERROR):
  - public.admin_salons_overview_view
  - public.appointments_view
  - public.admin_revenue_overview_view
  - public.communication_notification_queue_view
  - public.staff_enriched_view
  - public.salon_locations_view
```

**Problem**:
- These views execute with elevated privileges. Any code that bypasses them (Issues #1 and #2) skips the designed guardrails.
- While the advisor findings live in Supabase, the Business portal must treat the views as the contract and avoid raw table/RPC shortcuts.

**Required Fix**:
- Coordinate with the database team to audit each security-definer view. If possible, redesign them with standard RLS or ensure application code never circumvents them.

**Steps to Fix**:
1. Document the purpose of each security-definer view alongside consuming code.
2. Confirm Business portal reads/writes go through these views (see Issues #1 and #2).
3. Consider filing a Supabase migration to remove security-definer where not required.

**Acceptance Criteria**:
- [ ] App code uses security-definer views as intended (no raw table queries).
- [ ] Advisor warnings tracked in backlog with remediation owners.

**Dependencies**: Requires coordination with Supabase/database maintainers.

---

## Statistics

- Total Issues: 3
- Files Affected: 2 (plus Supabase advisor configuration)
- Estimated Fix Time: 6 hours (coordination + refactor)
- Breaking Changes: Medium (impacts notification delivery + data visibility)

---

## Next Steps

1. Fix Issues #1 and #2 to ensure all notification flows honor RLS.
2. Schedule a Supabase security review to address security-definer warnings.
3. After changes deploy, rerun `mcp__supabase__get_advisors` to confirm warnings are resolved.

---

## Related Files

This analysis should be done after:
- [x] `docs/business-portal/06_VALIDATION_ANALYSIS.md`

This analysis blocks:
- [ ] `docs/business-portal/00_SUMMARY.md`
