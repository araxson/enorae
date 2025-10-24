# Staff Portal - Deep Analysis Summary

**Date**: 2025-10-23  
**Layers Covered**: Pages, Queries, Mutations, Components, Types, Validation, Security  
**Total Files Reviewed**: 412  
**Total Issues**: 11 (Critical: 2, High: 9, Medium: 0, Low: 0)

---

## Overall Findings

- **Messaging APIs are the primary risk surface.** Both read and write paths bypass tenant scoping and rely on auth user ids instead of staff profile ids, leaking messages across threads and marking unrelated conversations as read.
- **Several data access paths still query schema tables (`appointments`, `message_threads`, `messages`, `profiles_metadata`) rather than public views**, undermining RLS and violating the “database is the source of truth” rule.
- **Supabase typings are degraded.** `lib/types/database.types.ts` is a minimal fallback generated after a `PGRST002` error; `[key: string]: any` masks column mismatches throughout the staff portal.
- **Validation coverage is incomplete.** Many `schema.ts` files export `z.object({})`, so form payloads reach server actions without any field-level checks.
- **Supabase advisors** flag leaked-password protection as disabled and list numerous unused indexes; the former is security-relevant to the portal.

---

## Issues by Layer

| Layer | Files | Issues | Critical | High | Notes |
| --- | --- | --- | --- | --- | --- |
| 01 Pages | 18 | 0 | 0 | 0 | Page shells follow best practices |
| 02 Queries | 18 | 4 | 1 | 3 | Messaging + commission queries misuse tables/views |
| 03 Mutations | 18 | 2 | 0 | 2 | Messaging mutations mirror query scoping flaws |
| 04 Components | 77 | 0 | 0 | 0 | shadcn usage consistent |
| 05 Types | 207 | 1 | 0 | 1 | Supabase types fallback to `[key: string]: any` |
| 06 Validation | 20 | 1 | 0 | 1 | Placeholder Zod schemas |
| 07 Security | 72 | 3 | 1 | 2 | Consolidates messaging + RLS issues |

---

## Recommended Fix Order

1. **Messaging security fixes (Critical)**  
   - Scope `getThreadMessages`, `markThreadAsRead`, and related mutations by `thread_id` and staff profile id.  
   - Switch reads to public messaging views.  
   - Re-test staff messaging flows.

2. **Replace schema-table reads with public views (High)**  
   - Update `getStaffCommission` and any remaining queries to use `appointments_view`, `message_threads_view`, etc.  
   - Confirm Supabase RLS remains intact.

3. **Restore Supabase typings (High)**  
   - Resolve `supabase__generate_typescript_types` (`PGRST002`) and regenerate `database.types.ts`.  
   - Remove `[key: string]: any` fallbacks; address any compiler errors that surface.

4. **Implement real Zod schemas for forms (High)**  
   - Flesh out `timeOffSchema`, `appointmentsSchema`, `clientsSchema`, etc., to enforce business rules before server actions run.

5. **Enable Supabase leaked-password protection & clean up unused indexes**  
   - Apply advisor recommendation for leaked-password protection (WARN).  
   - Review unused indexes after schema fixes to avoid unnecessary storage/maintenance.

---

## Quick Stats

- **Files analyzed**: 412 (Pages 18, Queries 18, Mutations 18, Components 77, Types 207, Validation 20, Security 72)  
- **Issues discovered**: 11 total (2 Critical, 9 High)  
- **Supabase advisor status**: Leaked password protection disabled (WARN); numerous unused indexes (INFO)  
- **Type generation**: `supabase__generate_typescript_types` failed with `PGRST002`; current file is a minimal fallback  
- **Tests**: None run (analysis only)

---

## Next Steps

1. Ship messaging fixes and regression tests to eliminate cross-thread exposure.  
2. Replace schema-table queries with views and regenerate Supabase types.  
3. Fill in empty Zod schemas so form submissions are validated end-to-end.  
4. Re-run `npm run typecheck` and relevant integration suites once type generation succeeds.
