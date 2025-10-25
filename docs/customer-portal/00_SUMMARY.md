# Customer Portal – Audit Summary (Layers 1‑8)

**Date**: 2025-10-25  
**Scope**: app/(customer) portal – pages, queries, mutations, components, types, validation, security, UX  
**Files Touched**: 53 component files, 35 API files, 18 validation schemas (86 unique artefacts)

---

## Findings Overview

- **Total Issues**: 24  
  - Critical: **5**  
  - High: **14**  
  - Medium: **4**  
- **Layers with Critical Findings**: Queries (L2), Mutations (L3), Security (L7)
- **Primary Risk Themes**:
  1. Queries and mutations reading directly from schema tables (`scheduling.appointments`, `organization.salons`, etc.) instead of public views. → Violates RLS patterns and causes type drift.
  2. Customer dashboard & booking logic rely on table-row types and raw Supabase filter strings → brittle type safety and SQL injection risk.
  3. Loyalty/referral experiences exposed to users despite missing backend support → unusable UX and false promises.

---

## Layer Summaries

| Layer | Issues | Severity Split | Notes |
| --- | --- | --- | --- |
| [01_PAGES_ANALYSIS](./01_PAGES_ANALYSIS.md) | 0 | – | Pages comply with shell guidance and suspense usage. |
| [02_QUERIES_ANALYSIS](./02_QUERIES_ANALYSIS.md) | 6 | Critical 2 / High 4 | Massive reliance on schema tables; wrong `Database['public']['Views']` indices; loyalty/referral queries stubbed. |
| [03_MUTATIONS_ANALYSIS](./03_MUTATIONS_ANALYSIS.md) | 5 | Critical 2 / High 3 | Ownership checks on tables, booking/reschedule hitting scheduling tables, loyalty/referral mutations unguarded. |
| [04_COMPONENTS_ANALYSIS](./04_COMPONENTS_ANALYSIS.md) | 3 | High 2 / Medium 1 | shadcn slot styling violations, loyalty/referral UI exposing dead CTAs, raw buttons for rating widget. |
| [05_TYPES_ANALYSIS](./05_TYPES_ANALYSIS.md) | 3 | High 2 / Medium 1 | Invalid view names in type aliases; customer components using scheduling table types. |
| [06_VALIDATION_ANALYSIS](./06_VALIDATION_ANALYSIS.md) | 2 | High 1 / Medium 1 | Placeholder schemas; no validation for loyalty/referral inputs or search filters. |
| [07_SECURITY_ANALYSIS](./07_SECURITY_ANALYSIS.md) | 2 | Critical 1 / High 1 | Table reads bypass RLS; Supabase filters interpolate timestamps. |
| [08_UX_ANALYSIS](./08_UX_ANALYSIS.md) | 2 | High 1 / Medium 1 | Loyalty/referral dashboards expose unusable workflows. |

---

## Recommended Fix Order

1. **Restore RLS compliance (Critical)**  
   - Swap all customer reads to public views; remove `.schema('scheduling').from('appointments')` and similar patterns.  
   - Update type aliases to point to actual `_view` entries.  
   - Track in L2/L3/L7 issues #1.

2. **Refactor booking/availability logic (Critical/High)**  
   - Replace raw `.or(...)` filters with parameterized comparisons.  
   - Align booking conflict checks and dashboard components with `appointments_view`.  
   - Address L3 Issue #1, L7 Issue #2, L5 Issue #2.

3. **Stabilize loyalty/referral features (High)**  
   - Feature-flag dashboards or provide “coming soon” states.  
   - Implement real schemas + validation before enabling server actions.  
   - Covers L2 Issue #6, L3 Issue #5, L4 Issue #2, L6 Issue #1, L8 Issue #1-2.

4. **Clean up component styling & validation gaps (Medium)**  
   - Remove non-layout Tailwind utilities from shadcn slots.  
   - Introduce search/discovery filter schemas and enforce them in queries.  
   - Update review rating widget to use shadcn primitives.

5. **Re-run toolchain**  
   - After code fixes, run `npm run typecheck` and Supabase security advisors to confirm RLS/validation coverage.

---

## Quick Stats

- Pages analysed: 22 (all compliant).
- API modules analysed: 35 (18 require view migration).  
- Components reviewed: 53 (14 still apply typography/color utilities).  
- Validation coverage: 9/18 schemas meaningful; 9 placeholders.  
- Supabase advisories: multiple `SECURITY DEFINER` warnings still outstanding.

---

## Next Steps & Ownership

1. **Engineering**: Begin with the RLS/view migrations (L2/L3) and booking conflict refactor (L7).  
2. **Design/PM**: Decide on loyalty/referral rollout; if delayed, ship explicit “Coming soon” UX.  
3. **QA**: Prepare regression plan for booking, dashboard metrics, sessions, and favorites after refactors.  
4. **Follow-up**: Update this summary once critical items are complete, then re-evaluate remaining high/medium issues.
