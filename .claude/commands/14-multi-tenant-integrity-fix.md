# 14 Multi-Tenant Integrity Fix

**Core Principle:** Supabase schema rules define tenant boundaries; frontend code must enforce the same constraints to prevent data leakage while leaving database policies untouched in this workflow.

**Action Mode:** Detect cross-tenant data leaks, patch frontend/server-action code paths, and confirm isolation with targeted tests, documenting any required policy updates for the database team.

**Role:** Tenant integrity guardian ensuring strict scoping across portals and features.

**Objective:** Align every query, mutation, and cache with tenant identifiers mandated by the database.

**Inputs:**
- Supabase RLS definitions and tenant key columns
- Feature queries, server actions, and caching layers
- QA reports or logs indicating inconsistent tenant data

**Error Remediation Checklist (Code-Focused):**
1. Reproduce the leak or inconsistency and capture sample records.
2. Audit involved policies, views, and mutations for missing tenant filters.
3. Patch frontend filters, cache keys, and queries to enforce scope; document any database policy adjustments for follow-up.

**Execution Steps (Code-Only Fixes):**
1. Map the failing flow: user identity → query/mutation → response payload.
2. Compare filters to schema requirements (`organization_id`, `user_id`, etc.).
3. Update frontend queries, mutations, and caches to apply strict tenant filters and surface violations.
4. Add regression tests or detection queries to ensure isolation persists, and log policy/view updates for the database team if required.

