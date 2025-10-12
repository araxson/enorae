# Project Structure Analysis Report
Date: 2025-10-11

## Executive Summary
- Total Issues Found: 5
- Critical Issues: 0
- High Priority: 0
- Medium Priority: 3
- Low Priority: 2

## 🔴 CRITICAL ISSUES (Fix Immediately)

### Portal Organization
- [x] Feature relocated to business portal: `features/business/booking-rules/`
  - Update: Moved from `features/shared/booking-rules/` and rewired all route imports to keep booking rules within the business portal boundary.
  - Impact: Restores clear access control ownership for salon booking constraints.
- [x] Feature relocated to business portal: `features/business/service-categories/`
  - Update: Moved from `features/shared/service-categories/`; all consumer imports now target the business portal package.
  - Impact: Aligns catalog management with business-only permissions and reduces shared surface area.
- [x] Feature relocated to business portal: `features/business/service-product-usage/`
  - Update: Migrated from `features/shared/service-product-usage/` so inventory tooling sits beside other business ops.
  - Impact: Keeps Supabase mutations and validation under the correct portal authority.
- [x] Feature relocated to business portal: `features/business/transactions/`
  - Update: Moved manual transaction tooling out of `features/shared/transactions/` and updated route imports.
  - Impact: Prevents cross-portal leakage of revenue operations and clarifies responsibility.

### Feature Structure Violations
- [x] Added canonical `api/mutations.ts`: `features/business/staff-services/`
  - Update: Moved server actions into the feature (`features/business/staff-services/api/mutations.ts`) and retargeted business staff UI imports.
  - Impact: Server actions now sit alongside the feature’s queries, following the standard entrypoint contract.

## 🟠 HIGH PRIORITY ISSUES

### API Layer
- [x] Data fetching centralized in API layer: `features/business/{coupons,pricing,settings,inventory-movements,inventory-purchase-orders,media,booking-rules}/`, `features/staff/profile/`
  - Update: Introduced query helpers (e.g., `getCouponServiceOptions`, `getPricingServices`, `getInventoryMovementReferences`, `getMyStaffProfileDetails`) so entry Server Components only orchestrate feature rendering.
  - Impact: Aligns with Next.js 15 server-component guidance and keeps Supabase access inside dedicated `api/queries.ts`.

- [x] Fragmented API modules with bespoke filenames
  - Update: Moved appointment, staff, and shared auth sub-modules under `api/internal/` and re-exported through canonical `mutations.ts`; removed obsolete backup `features/marketing/salon-directory/api/queries.ts.bkp37`.
  - Impact: Restores predictable API entrypoints and simplifies static analysis for `'use server'/'server-only'` enforcement.

## 🟡 MEDIUM PRIORITY ISSUES

### Feature Structure
- [ ] Missing `api/mutations.ts` scaffolding: `features/business/webhooks-monitoring/`, `features/marketing/explore/`
  - Reason: Both features expose write paths (retrying or future actions) but lack the standard entry file; any future mutations will sprawl into arbitrary helpers.
  - Impact: Harder to audit server actions and to add `'use server'` directives consistently.

### Type Organization
- [ ] Inline domain types in feature entries: `features/business/pricing/index.tsx`, `features/business/coupons/index.tsx`, `features/staff/profile/index.tsx`
  - Reason: Large type aliases (`PricingRuleRecord`, service/product shapes, metadata records) are declared inside components instead of `types.ts`.
  - Impact: Duplicates types across files, weakens TypeScript 5.6 inference, and blocks reuse in API/validation layers.

### File Organization
- [ ] Nonstandard `utils/` directories: `features/business/business-common/utils/`, `features/admin/admin-common/utils/`
  - Reason: Business logic and formatting live under generic `utils/` instead of dedicated `api/` or `components/` subfolders.
  - Impact: Obscures the data flow, breaks automated structure checks, and encourages future misc. dumping grounds.

## 🟢 LOW PRIORITY IMPROVEMENTS

- [ ] Backup artifact checked in: `features/marketing/salon-directory/api/queries.ts.bkp37`
  - Reason: Temp snapshot with forbidden suffix remains in version control.
  - Impact: Noise in imports and risk of accidental usage.

- [ ] Generic utility filenames: `features/admin/profile/api/utils.ts`, `features/marketing/salon-directory/components/salon-profile/utils.ts`
  - Reason: Vague names hide intent; should be renamed to reflect actual behaviour (e.g., `sanitize-profile.ts`).
  - Impact: Minor friction for discoverability and code search.

## Recommended File Moves

| Current Path | New Path | Status |
|-------------|----------|--------|
| features/shared/booking-rules | features/business/booking-rules | ✅ Completed |
| features/shared/service-categories | features/business/service-categories | ✅ Completed |
| features/shared/service-product-usage | features/business/service-product-usage | ✅ Completed |
| features/shared/transactions | features/business/transactions | ✅ Completed |

## Recommended Deletions

| File | Reason |
|------|--------|
| features/marketing/salon-directory/api/queries.ts.bkp37 | Remove obsolete backup to restore clean API surface. |

## Recommended Renames

| Old Name | New Name | Reason |
|----------|----------|--------|
| features/admin/profile/api/utils.ts | features/admin/profile/api/sanitize-profile.ts | Replace generic filename with descriptive intent. |
| features/marketing/salon-directory/components/salon-profile/utils.ts | features/marketing/salon-directory/components/salon-profile/media-formatters.ts | Clarifies component helpers and discourages additional catch-all utilities. |
