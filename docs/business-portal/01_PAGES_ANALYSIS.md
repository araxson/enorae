# Business Portal - Pages Analysis
**Date**: 2025-10-23
**Portal**: Business
**Layer**: Pages
**Files Analyzed**: 37
**Issues Found**: 2 (Critical: 0, High: 2, Medium: 0, Low: 0)

---

## Summary

Reviewed all Business portal route entries under `app/(business)/business/**/page.tsx`. Each file is a thin server component shell delegating to feature modules, and none contain client directives or direct data fetching. The main gaps are around metadata consistency and robots directives: several pages do not export any metadata, and many others omit `noIndex`, leaving authenticated-only routes indexable by default.

---

## Issues

### High Priority

#### Issue #1: Several business pages are missing metadata exports entirely
**Severity**: High
**File**: `app/(business)/business/chains/page.tsx:1`
**Rule Violation**: docs/stack-patterns/nextjs-patterns.md (Metadata Patterns) — portal routes must define metadata and control robots

**Current Code**:
```tsx
import { SalonChains } from '@/features/business/chains'

export default async function ChainsPage() {
  return <SalonChains />
}
```

**Problem**:
- The following files lack an `export const metadata` (or `generateMetadata`) export:  
  - `app/(business)/business/analytics/customers/page.tsx:1`  
  - `app/(business)/business/chains/page.tsx:1`  
  - `app/(business)/business/chains/[chainId]/page.tsx:1`  
  - `app/(business)/business/coupons/page.tsx:1`  
  - `app/(business)/business/pricing/page.tsx:1`
- Without an explicit metadata export, these authenticated routes inherit global robots settings (`index: true`), risking accidental indexing of private portal URLs.

**Required Fix**:
```tsx
import { generateMetadata as genMeta } from '@/lib/metadata'
import { SalonChains } from '@/features/business/chains'

export const metadata = genMeta({
  title: 'Salon Chains',
  description: 'Manage multi-location chain settings',
  noIndex: true,
})

export default async function ChainsPage() {
  return <SalonChains />
}
```

**Steps to Fix**:
1. Add a metadata export (using `genMeta`) to each listed file with meaningful title/description and `noIndex: true`.
2. Confirm the metadata composes with existing layout defaults (keywords/OpenGraph).
3. Run `npm run lint && npm run typecheck` to ensure imports and types remain valid.

**Acceptance Criteria**:
- [ ] Every affected page exports metadata using `generateMetadata` helper.
- [ ] Robots directives set `index: false` for each business portal route.
- [ ] Lint and typecheck succeed without new warnings.

**Dependencies**: None

---

#### Issue #2: Metadata declarations omit `noIndex`, leaving portal routes indexable
**Severity**: High
**File**: `app/(business)/business/blocked-times/page.tsx:3`
**Rule Violation**: docs/stack-patterns/nextjs-patterns.md (Metadata Patterns) — protect authenticated routes with explicit robots controls

**Current Code**:
```tsx
export const metadata = {
  title: 'Blocked Times',
  description: 'Manage blocked time slots',
}
```

**Problem**:
- 18 business portal pages export metadata but omit `noIndex`, inheriting `robots.index = true`.  
  - Examples: `app/(business)/business/blocked-times/page.tsx:3`, `app/(business)/business/settings/media/page.tsx:3`, `app/(business)/business/webhooks/monitoring/page.tsx:3`, `app/(business)/business/services/booking-rules/page.tsx:3`, etc.
- Authenticated-only surfaces should never be indexed; missing robots controls conflict with the documented metadata pattern and risk exposing private URLs.

**Required Fix**:
```tsx
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Blocked Times',
  description: 'Manage blocked time slots',
  noIndex: true,
})
```

**Steps to Fix**:
1. Replace ad-hoc metadata objects with `generateMetadata` helper (or extend existing usage) and pass `noIndex: true` for every affected file.
2. Include concise descriptions that match the feature module so OpenGraph/Twitter data stays accurate.
3. Verify via `npm run lint` that the helper import path is correct and unused imports are removed.

**Acceptance Criteria**:
- [ ] All metadata exports include `noIndex: true` and use the shared helper for consistency.
- [ ] Resulting robots directives render `index: false` when inspecting `metadata.robots`.
- [ ] Static analysis passes with no unused import warnings.

**Dependencies**: None

---

## Statistics

- Total Issues: 2
- Files Affected: 23
- Estimated Fix Time: 1.5 hours
- Breaking Changes: No

---

## Next Steps

1. Add metadata exports to the five pages currently missing them and re-run lint/typecheck.
2. Update existing metadata declarations to use `genMeta` with `noIndex: true` and add concise descriptions.
3. After fixes, re-run this audit layer to confirm robots coverage before moving to query analysis.

---

## Related Files

This analysis should be done after:
- [x] docs/stack-patterns/nextjs-patterns.md review (metadata patterns)

This analysis blocks:
- [ ] docs/business-portal/02_QUERIES_ANALYSIS.md
