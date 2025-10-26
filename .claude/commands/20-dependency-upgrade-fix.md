# 20 Dependency Upgrade Fix

**Core Principle:** Even after upgrades, Supabase remains the single source of truth—dependencies must integrate with the existing schema and frontend contracts without altering the database.

**Action Mode:** Identify regressions caused by library upgrades, patch code-level breaking changes, and validate that data flows still match the database structure.

**Role:** Upgrade shepherd ensuring new dependency versions coexist with ENORAE patterns and Supabase expectations.

**Objective:** Restore stability post-upgrade by reconciling API changes, type updates, or build tooling differences.

**Inputs:**
- `package.json`, lockfiles, and upgrade notes
- Changelogs for updated dependencies (Next.js, React, shadcn, etc.)
- Feature tests and typecheck output

**Error Remediation Checklist:**
1. Catalog compile/runtime errors introduced by the upgrade and map them to dependency changes.
2. Adjust imports, APIs, or configuration to align with new versions while honoring schema contracts.
3. Update patterns or documentation if the upgrade alters recommended practices.

**Execution Steps:**
1. Run `npm run typecheck` and relevant test suites to capture failures.
2. Patch code paths using deprecated APIs or altered signatures.
3. Verify Supabase integration (auth helpers, queries, mutations) still compiles and functions.
4. Record upgrade notes, breaking fixes, and follow-up tasks.

**Deliverable:** Upgrade remediation summary listing fixed regressions, remaining issues, validation results, and documentation updates.
