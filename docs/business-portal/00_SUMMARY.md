# Business Portal – Deep Analysis Summary

**Date**: 2025-10-20  
**Scope**: Business portal (app/(business), features/business)  
**Total Issues**: 16 (Critical: 8, High: 8, Medium: 0, Low: 0)

---

## Quick Stats
- Pages inspected: 47 (`app/(business)/**/page.tsx`)
- Server queries: 47 files (`features/**/api/queries.ts`)
- Server mutations: 47 files (`features/**/api/mutations.ts`)
- UI components: 198 files (`features/**/components/*.tsx`)
- Type-safety sweep: 767 TS/TSX modules
- Validation schemas: 53 files (`features/**/schema.ts`)
- Security review: 254 API modules
- Supabase MCP advisories: 1 active warning (leaked-password protection disabled)

---

## Issues by Layer
| Layer | Critical | High | Notes |
| --- | --- | --- | --- |
| 01 Pages | 0 | 0 | All shells follow shell pattern. |
| 02 Queries | 2 | 2 | Pricing/coupon reads bypass auth; missing view typing. |
| 03 Mutations | 2 | 1 | Pricing/coupon writes unguarded; incorrect coupon usage logging. |
| 04 Components | 0 | 2 | Dashboard widgets override shadcn slots with custom Tailwind. |
| 05 Type Safety | 0 | 2 | Pricing rules return `any`; manual transactions rely on `as unknown as`. |
| 06 Validation | 2 | 0 | Pricing & coupon schemas empty (no validation). |
| 07 Security | 2 | 1 | Tenant bypasses + leaked-password protection disabled. |

---

## Key Findings (Severity)
1. **Critical – Tenant bypass across pricing & coupons**  
   - Queries (`features/business/pricing/api/queries.ts`, `features/business/coupons/api/queries.ts`) trust caller `salonId`.  
   - Mutations (`features/business/pricing/api/pricing-rules.mutations.ts`, `features/business/coupons/api/coupons.mutations.ts`) insert/update/delete catalog data without verifying ownership.  
   - Violates CLAUDE.md Rule 8 and Supabase best practices; enables cross-tenant data tampering.

2. **Critical – Validation missing for core catalog features**  
   - `pricing/schema.ts` and `coupons/schema.ts` export empty Zod schemas, so invalid payloads reach Supabase.  
   - Breaks forms-patterns and compounds above security risks.

3. **High – shadcn UI misuse**  
   - `dashboard/components/metric-card.tsx` and `dashboard/components/dashboard-toolbar.tsx` add bespoke Tailwind classes, contravening `ui-patterns.md`.  
   - Produces inconsistent styling, complicates theming.

4. **High – Type confidence gaps**  
   - `dynamic-pricing.ts` returns `Promise<any>`; manual transactions cast `as unknown as`, hiding schema drift.  
   - Weakens compile-time guarantees and can mask runtime errors.

5. **High – Platform security advisory**  
   - Supabase MCP warning: leaked-password protection disabled (remediation link provided in Layer 7 report).

---

## Recommended Fix Order
1. **Tenant & Validation Hardening (Critical)**  
   - Add `requireAnyRole`/`getSalonContext` (or `resolveAccessibleSalonIds`) to pricing/coupon queries & mutations.  
   - Implement real Zod schemas for pricing/coupon flows and parse inputs before Supabase calls.
2. **Security Follow-up**  
   - Enable Supabase leaked-password protection.  
   - Update coupon usage logging to persist actual customer IDs.
3. **Type Safety & Data Contracts**  
   - Introduce `pricing_rules_view`, update `getPricingRules` return types, remove `as unknown as` casts.  
   - Regenerate `Database` types after view changes.
4. **UI Alignment**  
   - Refactor dashboard components to use shadcn layout primitives without custom Tailwind overrides.
5. **Regression Testing**  
   - After code changes, re-run `npm run typecheck`, targeted page smoke tests, and Supabase advisor checks.

---

## Estimated Effort
- Critical remediation (tenant checks + validation + advisor setting): **~2.5 days**  
  (Cross-cutting changes across pricing/coupon modules, plus Supabase configuration)
- High-severity follow-up (type safety + UI refactors): **~2 days**
- Retest & verification: **~0.5 day**

Total estimated engineering effort: **~5 days**

---

## References
- Context7 `/vercel/next.js/v15.1.8` – App Router async params guidance
- Context7 `/reactjs/react.dev` – Server/client component separation
- Context7 `/microsoft/typescript-website` – Strict typing best practices
- Context7 `/supabase/supabase` – Auth & RLS recommendations
- Supabase Advisor (`auth_leaked_password_protection`) – [Remediation link](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

