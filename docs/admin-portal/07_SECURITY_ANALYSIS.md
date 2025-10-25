# Admin Portal - Security Analysis

**Date**: 2025-10-26
**Portal**: Admin
**Layer**: Security
**Files Analyzed**: 64
**Issues Found**: 3 (Critical: 0, High: 2, Medium: 1, Low: 0)

---

## Summary

Focused on admin-side data access and Supabase configuration. Most queries/mutations wrap `createServiceRoleClient` with `requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)`, but several foundational controls remain ineffective. Supabase advisors report multiple public views defined with `SECURITY DEFINER`, meaning they bypass RLS entirely. Additionally, the security-monitoring mutations still write to tables that do not exist, so acknowledge/suppress/override flows silently fail—making the security dashboards cosmetic. Finally, Supabase Auth leaked-password protection is disabled, reducing account hardening.

---

## Issues

### High Priority

#### Issue #1: Public admin views use `SECURITY DEFINER`, bypassing RLS
**Severity**: High  
**Finding Source**: `mcp__supabase__get_advisors` (security_definer_view)  
**Views Affected**: `public.admin_salons_overview_view`, `public.appointments_view`, `public.admin_revenue_overview_view`, `public.communication_notification_queue_view`, `public.staff_enriched_view`, `public.salon_locations_view`, `public.admin_appointments_overview_view`  
**Rule Violation**: Supabase Patterns – “Reads rely on RLS via public views” (`docs/stack-patterns/supabase-patterns.md`)

**Problem**: SECURITY DEFINER views execute with the creator’s privileges, ignoring row-level security for the requesting user. Any bug or mis-configured client could leak tenant data because RLS filters no longer apply. Admin queries already rely on service-role credentials, so layering SECURITY DEFINER on top is unnecessary and dangerous.

**Required Fix**:
1. Redefine the affected views without `SECURITY DEFINER` (use `SECURITY INVOKER`, the default), or replace them with materialized views secured by RLS-aware tables.
2. If elevated access is required for specific aggregates, create stored procedures guarded by explicit authorization checks instead of SECURITY DEFINER views.
3. Re-run Supabase advisors to confirm the lint warnings vanish.

**Acceptance Criteria**:
- [ ] All listed views are recreated without `SECURITY DEFINER`.
- [ ] Supabase advisor `security_definer_view` warnings resolve.
- [ ] Manual queries from a restricted role confirm RLS applies as expected.

**Dependencies**: Requires database migration / DDL change.

---

#### Issue #2: Security monitoring mutations target nonexistent tables
**Severity**: High  
**File**: `features/admin/security-access-monitoring/api/mutations.ts:52-201`, `features/admin/session-security/api/mutations.ts:62-245`  
**Rule Violation**: Security Patterns – “Persist security events in audited tables” (`docs/stack-patterns/supabase-patterns.md`, Security section)

**Problem**: Actions such as `acknowledgeSecurityAlert`, `suppressSecurityAlert`, `quarantineSession`, and `overrideSeverity` attempt to write to `public.security_access_logs`, `public.security_alert_suppressions`, `public.session_security_events`, `public.mfa_requirements`, and `public.session_risk_overrides`. Supabase metadata confirms none of these tables exist—the real data lives under `security.access_monitoring` / `security.session_security`. Consequently all writes fail, so security analysts cannot acknowledge incidents or enforce MFA overrides despite UI affordances.

**Required Fix**:
1. Map each mutation to the actual tables in the `security` schema (e.g., `security.access_monitoring`, `security.session_security`) or add the missing tables explicitly through migrations.
2. Add error handling tests to ensure a failing write surfaces an error instead of pretending success.
3. After fixing the persistence layer, validate end-to-end by triggering alerts and confirming the records move through acknowledge/suppress flows.

**Acceptance Criteria**:
- [ ] Mutations persist updates to existing tables (or new tables introduced via migration).
- [ ] No mutation returns `{ success: true }` when the underlying write fails.
- [ ] Manual smoke tests show security dashboards updating when actions are taken.

**Dependencies**: Aligns with Mutations Layer fixes.

---

### Medium Priority

#### Issue #3: Leaked password protection disabled in Supabase Auth
**Severity**: Medium  
**Finding Source**: `mcp__supabase__get_advisors` (`auth_leaked_password_protection`)  
**Rule Violation**: Security Hardening Guidelines – “Enable leaked password checks” (Supabase docs)

**Problem**: Supabase Auth can automatically block credentials that appear in HaveIBeenPwned. The advisor reports this feature is turned off, so admins could set compromised passwords without warning.

**Required Fix**:
1. Follow Supabase remediation doc (`https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection`) to enable leaked password protection in the project settings.
2. Communicate the change to stakeholders (password reset flow may warn users).

**Acceptance Criteria**:
- [ ] Supabase project has leaked password protection toggled on.
- [ ] Subsequent advisor runs no longer show the warning.

**Dependencies**: Supabase project configuration change.

---

### Low Priority

_No low-severity issues found._

---

## Statistics

- Total Issues: 3
- Files Affected: 7 views + 2 mutation modules
- Estimated Fix Time: 4 hours (plus DB migration cycle)
- Breaking Changes: Yes (view definitions / schema updates)

---

## Next Steps

1. Recreate or replace SECURITY DEFINER views so RLS is honored.
2. Align security-monitoring mutations with the actual `security` schema tables, then re-test alert workflows.
3. Enable Supabase leaked password protection and confirm advisor warnings clear.

---

## Related Files

This analysis should be done after:
- [x] Layer 6 – Validation analysis

This analysis blocks:
- [ ] Phase 3 summary report
