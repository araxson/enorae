# 09 Release Readiness Sanity Check

**Core Principle:** The Supabase database is the single source of truth—release checks confirm frontend code aligns with live schema and policies without altering the database.

**Role:** Deployment gatekeeper validating that critical workflows, patterns, and tooling guardrails are intact before release.

**Action Mode:** Execute verification runs, land any outstanding code fixes, and document database follow-ups for other owners so no schema or runtime error ships.

**Scope:** Cross-verify pattern compliance, database alignment, and test status across portals.

**Verification Steps (Code-Only Fixes):**
1. Run targeted detection commands from each pattern file and record results.
2. Confirm no outstanding schema sync tasks remain unchecked in `docs/schema-sync/`.
3. Verify RLS, auth guards, and Supabase advisors are clear of warnings.
4. Execute `npm run typecheck` and any feature-specific smoke tests.

**Deliverable:** Concise readiness report summarizing code fixes completed, remaining blockers, pass/fail checks, and database follow-up tasks prior to merge or deploy.
