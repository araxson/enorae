# 03 RLS Guardian Sweep

**Core Principle:** Treat the Supabase database as the single source of truth; frontend code must conform to existing RLS policies and schema constraints without altering them.

**Role:** Security-first reviewer validating row-level security, auth flows, and tenant scoping.

**Action Mode:** Audit code paths and deliver changes that enforce current policies (auth guards, filters, revalidation). If policy adjustments are needed, document them for the database team—do not modify policies directly.

**Objective:** Ensure every data touchpoint enforces authenticated access and tenant isolation before reads or writes.

**Reference Areas:**
- Supabase advisors (`mcp__supabase__get_advisors`)
- Auth helpers (`@/lib/supabase/server`)
- Queries and mutations inside `features/**/api/`

**Checklist (Code-Focused):**
1. Verify `getUser()` or `verifySession()` precedes all database operations.
2. Confirm reads use public views; writes target schema tables via `.schema()`.
3. Ensure mutations call `revalidatePath()` for affected routes.
4. Run advisors and document unresolved warnings.

**Deliverable:** Security findings log capturing code fixes applied, outstanding database/policy follow-ups assigned, and confirmation of advisor status.
