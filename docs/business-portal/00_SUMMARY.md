# Business Portal - Deep Analysis Summary

**Date**: 2025-10-25  
**Scope**: Business portal pages, data layer, UI components, validation, security  
**Files Reviewed**: 1,070 (37 pages · 37 query entrypoints · 37 mutation entrypoints · 242 components · 580 TS/TSX files · 40 schema files · 182 API helpers)

---

## Overall Findings

- **Total Issues**: 14  
  - Critical: 1  
  - High: 7  
  - Medium: 7  
  - Low: 1
- **Top Risks**:
  1. **Outdated Supabase view names** (`salons`, `messages`, `staff`) causing both runtime failures and RLS bypasses.
  2. **Notification workflows** reading raw tables for authorization and delivery, undermining tenant boundaries.
  3. **Missing validation schemas** for key Business settings forms, allowing unchecked input.
  4. **Inconsistent typography primitives** leading to UI drift (medium severity, but widespread).
- Supabase advisors (2025-10-25) flagged six `SECURITY DEFINER` views. Application code must interact with these views rather than schema tables to preserve least privilege.

---

## Issues by Layer

| Layer | Files | Critical | High | Medium | Low |
| --- | --- | --- | --- | --- | --- |
| Pages (`docs/business-portal/01_PAGES_ANALYSIS.md`) | 37 | 0 | 0 | 0 | **1** |
| Queries (`02`) | 37 | **1** | 1 | 1 | 0 |
| Mutations (`03`) | 37 | 0 | 2 | 1 | 0 |
| Components (`04`) | 242 | 0 | 0 | 2 | 0 |
| Types (`05`) | 580 | 0 | 2 | 0 | 0 |
| Validation (`06`) | 40 | 0 | 0 | 2 | 0 |
| Security (`07`) | 182 | 0 | 2 | 1 | 0 |

---

## Recommended Fix Order

1. **Resolve Supabase View Mismatches (Critical/High)**  
   - Fix `getUserSalon` + related helpers to use `salons_view`, `staff_profiles_view`, `appointments_view`.  
   - Update type aliases (`Views['salons']`, `Views['messages']`) and add `.returns<...>()` to queries.
2. **Secure Notification Workflows (High)**  
   - Migrate authorization checks and list endpoints to `_view` relations or existing RPCs.  
   - Re-run notification delivery after wiring `revalidateNotifications()`.
3. **Restore Validation Coverage (Medium)**  
   - Implement real Zod schemas for salon/contact settings and hook them into server actions.  
   - Add lint guard or tests to prevent `z.object({})`.
4. **UI Consistency & Streaming (Low/Medium)**  
   - Apply shared typography primitives and add `<Suspense>` fallbacks flagged in Layer 1.  
   - Introduce a reusable metric heading component to replace ad-hoc Tailwind font utilities.
5. **Supabase Security Follow-up (Medium)**  
   - Coordinate with DB team on the six `SECURITY DEFINER` advisor warnings to confirm mitigations.  
   - After fixes deploy, re-run `mcp__supabase__get_advisors` to verify clean status.

---

## Effort & Dependencies

- Estimated engineering effort: **~24 hours** (excluding DB coordination).  
  - Queries + Types: 8h  
  - Notifications security hardening: 6h  
  - Validation fixes: 4h  
  - UI typography consolidation: 4h  
  - Follow-up testing & Supabase advisor rerun: 2h
- **Blocking Dependencies**:  
  - Database/types regeneration must occur before implementing view fixes.  
  - Notification hardening depends on the same view corrections (Queries/Types).  
  - UI refactors can proceed in parallel once data layer stabilized.

---

## Testing & Verification Plan

1. After implementing each batch, run `npm run typecheck` (already failing with current mismatches).  
2. Add targeted integration tests for notification delivery to ensure RLS scoping works.  
3. For validation updates, add form submission tests (Playwright or React Testing Library).  
4. Once security fixes land, rerun Supabase advisors and document the new status in `docs/schema-sync/`.

---

## Next Suggested Actions

1. Kick off a spike to align all Supabase view references (Layer 2 & 5 issues).
2. Prepare a security hardening PR focusing on notification reads/writes, coordinating with DB on advisor findings.
3. Implement missing Zod schemas for the Business settings UI, then retest forms.

---

## Artifacts

- Layer reports:  
  - `docs/business-portal/01_PAGES_ANALYSIS.md`  
  - `docs/business-portal/02_QUERIES_ANALYSIS.md`  
  - `docs/business-portal/03_MUTATIONS_ANALYSIS.md`  
  - `docs/business-portal/04_COMPONENTS_ANALYSIS.md`  
  - `docs/business-portal/05_TYPES_ANALYSIS.md`  
  - `docs/business-portal/06_VALIDATION_ANALYSIS.md`  
  - `docs/business-portal/07_SECURITY_ANALYSIS.md`
- Supabase advisor snapshot: `mcp__supabase__get_advisors` (2025-10-25)

---

## Status

- ✅ Phase 1: Context gathering & Supabase schema pull  
- ✅ Phase 2: Layer-by-layer analysis (pages → security)  
- ⚠️ Phase 3: Pending remediation of high-severity findings
