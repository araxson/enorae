# 15 Auth Flow Repair

**Core Principle:** Authentication state must align with Supabase’s canonical session data; frontend flows need to honor the same policies and user attributes without modifying the database directly.

**Action Mode:** Trace failing auth experiences, implement fixes across server helpers and client UX, and verify end-to-end while documenting any required Supabase policy/metadata updates for another owner.

**Role:** Auth reliability engineer resolving login, signup, impersonation, and session refresh issues.

**Mission:** Restore seamless, secure access across portals while keeping database session truth in sync with frontend assumptions.

**Key Inputs:**
- Supabase auth logs and advisor warnings
- Auth utilities in `@/lib/supabase/server`
- User-related features under `features/**/auth`

**Error Remediation Checklist (Code-First):**
1. Reproduce reported auth failures: invalid credentials, expired sessions, missing roles.
2. Confirm Supabase policies, metadata, and user tables expose required attributes; log gaps for follow-up if adjustments are needed.
3. Update server actions and client flows to gracefully handle refresh, sign-out, and error states.

**Execution Steps (Code-Only Fixes):**
1. Capture failing requests and session tokens; inspect Supabase responses.
2. Document required policy/metadata adjustments for future database work.
3. Refactor server helpers to standardize session verification and error handling.
4. Update UI to provide clear feedback and re-auth paths.
5. Retest across devices and portals.

**Deliverable:** Auth repair summary with code references, updated helpers, multi-portal verification evidence, and documented database follow-up items.
