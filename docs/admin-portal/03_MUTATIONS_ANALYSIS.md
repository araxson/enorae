# Admin Portal - Mutations Analysis

**Date**: 2025-10-26
**Portal**: Admin
**Layer**: Mutations
**Files Analyzed**: 26
**Issues Found**: 3 (Critical: 1, High: 1, Medium: 1, Low: 0)

---

## Summary

Reviewed every admin server action under `features/admin/**/api/mutations.ts` and the nested mutation helpers. Top-level entry points consistently begin with `'use server'`, and most fan out to helpers that enforce `requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)` before opening a service-role client. However, two systemic gaps surfaced: several security-focused actions target tables that do not exist in the Supabase schema (per `lib/types/database.types.ts` and MCP `list_tables`), and the user status workflow ignores write errors on critical follow-up updates. Additionally, one profile helper is still a TODO stub that only logs instead of performing its advertised anonymization routine.

---

## Issues

### Critical Priority

#### Issue #1: Security mutations write to non-existent tables
**Severity**: Critical  
**File**: `features/admin/security-access-monitoring/api/mutations.ts:54`, `features/admin/security-access-monitoring/api/mutations.ts:113`, `features/admin/security-access-monitoring/api/mutations.ts:194`, `features/admin/session-security/api/mutations.ts:62`, `features/admin/session-security/api/mutations.ts:123`, `features/admin/session-security/api/mutations.ts:245`  
**Rule Violation**: Supabase Patterns – “Database is source of truth; code must align with actual schema” (`docs/stack-patterns/supabase-patterns.md`)

**Current Code**:
```ts
await supabase
  .schema('public')
  .from('security_access_logs')
  .update({ acknowledgement_status: 'acknowledged', ... })

await supabase.schema('public').from('security_alert_suppressions').insert({ ... })

await supabase.schema('public').from('session_security_events').insert({ ... })
await supabase.schema('public').from('mfa_requirements').insert({ ... })
await supabase.schema('public').from('session_risk_overrides').insert({ ... })
```

**Problem**: None of the referenced tables (`security_access_logs`, `security_alert_suppressions`, `session_security_events`, `mfa_requirements`, `session_risk_overrides`) exist in the active database. MCP `list_tables` for the `public` and `security` schemas and the generated types file confirm only `security.access_monitoring`, `security.session_security`, `security.rate_limit_*`, etc. are present. Each mutation therefore fails immediately at runtime, leaving security workflows (acknowledging alerts, suppressing alerts, quarantining sessions, enforcing MFA) non-functional.

**Required Fix**:
```ts
// Example: acknowledge alert against the real table
const { error } = await supabase
  .schema('security')
  .from('access_monitoring')
  .update({
    acknowledgement_status: 'acknowledged',
    acknowledged_at: new Date().toISOString(),
    acknowledged_by: session.user.id,
  })
  .eq('id', validated.accessId)

// Mirror for session mutations: persist to security.session_security or dedicated audit tables that actually exist.
```

**Steps to Fix**:
1. Cross-reference each intended write table with Supabase metadata; map to the actual table (e.g., `security.access_monitoring`, `security.session_security`) or create the missing tables if truly required.
2. Update `schema(...)` and table names across the affected mutations, adjusting column names to match the real schema.
3. Add regression tests or manual verification to ensure the updated actions succeed, then run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Every security mutation writes to a table listed in `lib/types/database.types.ts` or verified via MCP.
- [ ] All service-role writes return `{ success: true }` in manual smoke tests instead of logging Supabase errors.
- [ ] Security alert/session workflows become operational in staging after the fixes.

**Dependencies**: None

---

### High Priority

#### Issue #2: User status mutations ignore Supabase errors on secondary writes
**Severity**: High  
**File**: `features/admin/users/api/mutations/status.ts:111-120`, `features/admin/users/api/mutations/status.ts:182-200`, `features/admin/users/api/mutations/status.ts:255-302`  
**Rule Violation**: Supabase Patterns – “Handle errors from every database operation” (`docs/stack-patterns/supabase-patterns.md`)

**Current Code**:
```ts
await supabase
  .schema('identity')
  .from('user_roles')
  .update({ is_active: true, updated_by_id: session.user.id })
  .eq('user_id', userId) // <-- result ignored

await supabase
  .schema('identity')
  .from('sessions')
  .update({ is_active: false, deleted_at: timestamp })
  .in('user_id', userIds) // <-- result ignored
```

**Problem**: After a successful profile update, the functions re-enable roles or terminate sessions without checking the returned `error`. If those updates fail (e.g., due to RLS filtering or row-level locks), the mutation still returns `{ success: true }`, leaving users half-suspended or partially reactivated, exactly the inconsistency these admin actions are meant to prevent.

**Required Fix**:
```ts
const { error: rolesError } = await supabase
  .schema('identity')
  .from('user_roles')
  .update({ is_active: true, updated_by_id: session.user.id })
  .eq('user_id', userId)

if (rolesError) {
  console.error('[AdminUsers] Failed to reactivate roles', rolesError)
  return { error: rolesError.message }
}
```

**Steps to Fix**:
1. Capture `{ error }` for every follow-up `update`/`delete` in the user status helpers (reactivate, ban, batch actions).
2. Short-circuit with descriptive error responses (and roll back if necessary) when any write fails.
3. Add logging similar to the profile write to aid debugging, then re-run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] All write operations in `features/admin/users/api/mutations/status.ts` check Supabase responses.
- [ ] The actions return `{ error: ... }` when any dependent update fails, preventing partial suspension/reactivation.
- [ ] Smoke tests confirm data consistency across `identity.profiles`, `identity.user_roles`, and `identity.sessions`.

**Dependencies**: None

---

### Medium Priority

#### Issue #3: `anonymizeProfileAction` is a no-op placeholder
**Severity**: Medium  
**File**: `features/admin/profile/api/mutations.ts:170-202`  
**Rule Violation**: Architecture Patterns – “Server actions must implement the advertised mutation” (`docs/stack-patterns/architecture-patterns.md`)

**Current Code**:
```ts
export async function anonymizeProfileAction(profileId: string): Promise<ActionResponse> {
  // ...
  // TODO: Implement user anonymization when identity tables are properly exposed
  console.log('[Admin] Would anonymize user profile:', profileId)
  revalidatePath('/admin/profile')
  return success('User anonymization placeholder executed')
}
```

**Problem**: The action always returns success without touching any tables, so admins believe a profile has been anonymized when nothing changed. This violates the “database is source of truth” mandate and could lead to privacy/compliance failures.

**Required Fix**:
```ts
const supabase = createServiceRoleClient()
const anonymizedValues = {
  email: `anonymized_${profileId}@deleted.local`,
  full_name: 'Anonymized User',
  deleted_at: new Date().toISOString(),
  deleted_by_id: session.user.id,
}

const { error } = await supabase
  .schema('identity')
  .from('profiles')
  .update(anonymizedValues)
  .eq('id', profileId)

if (error) return failure(error.message)
```

**Steps to Fix**:
1. Define the anonymization strategy (which columns to scrub in `identity.profiles`, `profiles_metadata`, `profiles_preferences`, etc.).
2. Implement the necessary updates with error handling and audit logging.
3. Replace the `console.log` placeholder, then run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] The action updates identity tables with anonymized values or returns an error if it cannot.
- [ ] Post-action checks confirm sensitive fields are cleared.
- [ ] No placeholder logging remains.

**Dependencies**: Requires confirmation of anonymization requirements from the product/security team.

---

### Low Priority

_No low-severity issues found._

---

## Statistics

- Total Issues: 3
- Files Affected: 4
- Estimated Fix Time: 5 hours
- Breaking Changes: Yes (schema alignment required for security actions)

---

## Next Steps

1. Realign the security mutations to the actual Supabase schema (tables in the `security` schema) and verify successful writes.
2. Harden the user status workflow by propagating errors from secondary updates.
3. Implement the anonymization action before exposing it in the UI.

---

## Related Files

This analysis should be done after:
- [x] Layer 2 – Queries analysis

This analysis blocks:
- [ ] Layer 4 – Components analysis
