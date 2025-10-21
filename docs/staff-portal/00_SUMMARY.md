# Staff Portal - Summary

**Date**: 2025-10-20  
**Portal**: Staff  
**Issues Found**: 22 (Critical: 6, High: 9, Medium: 7, Low: 0)

---

## Totals

- **Pages**: 19 files reviewed – no violations.  
- **Queries**: 19 files – 6 issues (2 Critical / 3 High / 1 Medium).  
- **Mutations**: 19 files – 6 issues (2 Critical / 2 High / 2 Medium).  
- **Components**: 79 files – 3 issues (2 High / 1 Medium).  
- **Type Safety**: 132 files – 2 issues (1 High / 1 Medium).  
- **Validation**: 21 schema files – 2 issues (1 Critical / 1 Medium).  
- **Security**: 42 API modules – 3 issues (1 Critical / 1 High / 1 Medium).  
- **Estimated remediation effort**: ~43 hours (sum of per-layer estimates).  
- **Supabase advisors**: `auth_leaked_password_protection` WARN; numerous performance lints (unused indexes) noted for follow-up.

---

## Issues by Layer

| Layer | Critical | High | Medium | Notes |
| --- | --- | --- | --- | --- |
| Pages | 0 | 0 | 0 | All page shells compliant. |
| Queries | 2 | 3 | 1 | Revenue analytics & messaging data scope broken. |
| Mutations | 2 | 2 | 2 | Time-off + messaging actions allow escalation. |
| Components | 0 | 2 | 1 | shadcn slot misuse across shared UI. |
| Type Safety | 0 | 1 | 1 | View/table type mismatch; unsafe casts. |
| Validation | 1 | 0 | 1 | Empty schemas leave inputs unvalidated. |
| Security | 1 | 1 | 1 | staffId spoofing & tenant leaks. |

---

## Recommended Fix Order

1. **Patch security-critical flows**  
   - Lock down time-off mutations (Issues Mutations #1, Security #1).  
   - Scope messaging customer access + per-thread read updates (Security #2 + #3, Queries #5).  
2. **Restore analytics data integrity**  
   - Fix revenue/metrics queries (Queries Issues #3 & #4) so dashboards show correct numbers.  
3. **Implement real validation + shared schemas**  
   - Replace placeholder Zod schemas (Validation #1/#2) and align mutations with them.  
4. **Address type-safety regressions**  
   - Swap `identity` table reads for public views and remove `unknown as` coercions (Types Issues #1/#2).  
5. **Clean up UI consistency**  
   - Refactor shared cards/headings to follow shadcn slot rules (Components Issues #1-#3).  
6. **Notify platform team**  
   - Enable Supabase leaked password protection per advisor warning.

---

## Quick Stats

- **Total files touched**: 331 unique files inspected across layers.  
- **Critical issues concentrated in**: time-off workflows, analytics queries, messaging actions, and missing validation.  
- **Revalidation gaps**: Staff time-off + schedule mutations currently revalidate business routes only (Mutations Issues #5 & #6).  
- **Testing status**: No automated coverage; recommend adding unit/integration tests after fixes (messaging + time-off).

---

## Suggested Next Steps

1. Pair an engineer with a designer to refactor shadcn card usage (Components layer).  
2. Schedule a data QA session after analytics fixes to verify dashboards against known numbers.  
3. Coordinate with DevOps/Security to enable Supabase leaked-password protection and review remaining advisor warnings.  
4. After addressing critical/high items, run `npm run typecheck` and relevant E2E tests before release.

