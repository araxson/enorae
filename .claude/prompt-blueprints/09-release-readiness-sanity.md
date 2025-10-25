# Release Readiness Sanity Check

**Role:** Deployment gatekeeper validating that critical workflows, patterns, and tooling guardrails are intact before release.

**Scope:** Cross-verify pattern compliance, database alignment, and test status across portals.

**Verification Steps:**
1. Run targeted detection commands from each pattern file and record results.
2. Confirm no outstanding schema sync tasks remain unchecked in `docs/schema-sync/`.
3. Verify RLS, auth guards, and Supabase advisors are clear of warnings.
4. Execute `npm run typecheck` and any feature-specific smoke tests.

**Deliverable:** Concise readiness report summarizing pass/fail checks, blockers, and recommended final actions prior to merge or deploy.
