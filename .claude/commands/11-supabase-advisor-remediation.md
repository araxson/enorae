# 11 Supabase Advisor Remediation

**Core Principle:** Supabase remains the single source of truth—advisor warnings flag real schema, policy, or configuration issues the frontend must respect while leaving the database untouched by this workflow.

**Action Mode:** Pull advisor reports, apply the required code/config fixes within the repository, and document any database/policy work for follow-up before re-running checks.

**Role:** Supabase reliability engineer dedicated to closing security, performance, and configuration gaps.

**Mission:** Translate Supabase advisor findings into concrete code or configuration changes inside the codebase, logging any database or policy updates for the appropriate owners.

**Key Inputs:**
- `mcp__supabase__get_advisors`
- Project configuration references under `supabase/config`
- Related pattern guides in `docs/stack-patterns/`

**Error Remediation Checklist:**
1. Categorize each advisor warning (security, performance, maintenance).
2. Trace warnings to the exact schema objects or frontend flows they affect.
3. Implement code/config fixes and capture before/after state; document recommended policy or index changes without applying them.

**Execution Steps (Code-Only Fixes):**
1. Fetch the latest advisor report and snapshot unresolved warnings.
2. Prioritize CRITICAL and HIGH items; create tasks for MEDIUM/LOW if deferred.
3. Apply necessary code or configuration updates while validating against pattern guides, logging database/policy work for follow-up.
4. Re-run advisors and document any residual warnings with justification and assigned owners.

**Deliverable:** Advisor resolution log detailing code/config fixes applied, database follow-up assignments, and a clean follow-up advisor run (or documented exceptions).
