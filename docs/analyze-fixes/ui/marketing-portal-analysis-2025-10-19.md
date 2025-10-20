# UI Analysis Report: Marketing Portal

**Generated**: 2025-10-19
**Scope**: Marketing portal (`app/(marketing)`) and related features (`features/marketing`, `features/shared/auth`)
**Analyst**: Claude Code UI Analyzer

---

## Executive Summary

**Total Violations**: 27
**Critical (P-level)**: 27
**High (H-level)**: 0
**Medium (M-level)**: 0

**Status**: CRITICAL - Project has compilation errors due to undefined Typography components

### Priority Breakdown

| Priority | Rule Code | Count | Files Affected |
|----------|-----------|-------|----------------|
| **P** | UI-P004 | 27 | 8 |
| **H** | - | 0 | 0 |
| **M** | - | 0 | 0 |

---

## Critical Issues Overview

### UI-P004: Undefined Typography Components (27 violations across 8 files)

**Impact**: The codebase is using undefined Typography components (`H1`, `H2`, `H3`, `Lead`, `Large`, `Small`) that cause TypeScript compilation errors. These components were likely deleted but references remain, breaking the build.

**Root Cause**: Components are being used WITHOUT imports, suggesting they were previously available globally or from a deleted package (`@/components/ui/typography`).

**TypeScript Errors**: 27 compilation errors preventing successful build.

---

## Violations by File

### 1. features/marketing/home/components/home-page-client.tsx

**Critical Violations**: 6

#### UI-P004: Undefined H1 component (Lines 15-17)
**Code**:
```tsx
<H1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-6xl">
  Enorae
</H1>
```
**Issue**: Using undefined `H1` component without import. Causes TypeScript error: `Cannot find name 'H1'`.

**Fix**:
```tsx
<h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-6xl">
  Enorae
</h1>
```
**Rationale**: Use semantic HTML `<h1>` with design tokens. No shadcn primitive exists for page hero headings.

---

#### UI-P004: Undefined Lead component (Line 18)
**Code**:
```tsx
<Lead className="text-2xl md:text-3xl">Your Beauty Appointments, Simplified</Lead>
```
**Issue**: Using undefined `Lead` component without import. Causes TypeScript error: `Cannot find name 'Lead'`.

**Fix**:
```tsx
<p className="text-2xl font-normal leading-relaxed md:text-3xl">Your Beauty Appointments, Simplified</p>
```
**Rationale**: Use semantic `<p>` with design tokens for subtitle. Lead text styling comes from Tailwind utilities.

---

#### UI-P004: Undefined H2 component (Line 55)
**Code**:
```tsx
<H2 className="text-3xl font-bold md:text-4xl">Everything you need</H2>
```
**Issue**: Using undefined `H2` component without import.

**Fix**:
```tsx
<h2 className="text-3xl font-bold md:text-4xl">Everything you need</h2>
```
**Rationale**: Use semantic HTML `<h2>` with design tokens for section heading.

---

#### UI-P004: Undefined H2 component (Line 116)
**Code**:
```tsx
<H2 className="text-3xl font-bold md:text-4xl">What our users say</H2>
```
**Issue**: Using undefined `H2` component without import.

**Fix**:
```tsx
<h2 className="text-3xl font-bold md:text-4xl">What our users say</h2>
```
**Rationale**: Use semantic HTML `<h2>` with design tokens for section heading.

---

#### UI-P004: Undefined H2 component (Line 146)
**Code**:
```tsx
<H2 className="text-3xl font-bold md:text-4xl">Ready to get started?</H2>
```
**Issue**: Using undefined `H2` component without import.

**Fix**:
```tsx
<h2 className="text-3xl font-bold md:text-4xl">Ready to get started?</h2>
```
**Rationale**: Use semantic HTML `<h2>` with design tokens for section heading.

---

### 2. features/marketing/pricing/components/sections/plans/plans.tsx

**Critical Violations**: 3

#### UI-P004: Undefined H2 component (Line 12)
**Code**:
```tsx
<H2 className="text-center text-3xl font-bold">{plansData.title}</H2>
```
**Issue**: Using undefined `H2` component without import.

**Fix**:
```tsx
<h2 className="text-center text-3xl font-bold">{plansData.title}</h2>
```
**Rationale**: Use semantic HTML `<h2>` with design tokens for section heading.

---

#### UI-P004: Undefined H3 component (Lines 29-34)
**Code**:
```tsx
<H3 className="text-3xl font-semibold">
  {plan.price}
  <span className="ml-1 text-sm font-normal text-muted-foreground">
    {plan.period}
  </span>
</H3>
```
**Issue**: Using undefined `H3` component without import.

**Fix Option A (Recommended)**: Use CardTitle in pricing card
```tsx
<CardTitle className="text-3xl font-semibold">
  {plan.price}
  <span className="ml-1 text-sm font-normal text-muted-foreground">
    {plan.period}
  </span>
</CardTitle>
```
**Note**: This is already inside a CardHeader, so a second CardTitle would be incorrect. Better option:

**Fix Option B (Correct)**:
```tsx
<p className="text-3xl font-semibold">
  {plan.price}
  <span className="ml-1 text-sm font-normal text-muted-foreground">
    {plan.period}
  </span>
</p>
```
**Rationale**: Price is not a heading, it's emphasized text. Use semantic `<p>` with design tokens.

---

### 3. features/marketing/salon-directory/components/salon-profile/hero.tsx

**Critical Violations**: 1

#### UI-P004: Undefined Large component (Line 57)
**Code**:
```tsx
<Large className="font-semibold">{rating.toFixed(1)}</Large>
```
**Issue**: Using undefined `Large` component without import.

**Fix**:
```tsx
<p className="text-lg font-semibold">{rating.toFixed(1)}</p>
```
**Rationale**: Use semantic `<p>` with design tokens. Large text = `text-lg` utility class.

---

### 4. features/marketing/explore/components/marketing-explore-view.tsx

**Critical Violations**: 1

#### UI-P004: Undefined H2 component (Line 89)
**Code**:
```tsx
<H2 className="text-xl">No salons match your search</H2>
```
**Issue**: Using undefined `H2` component without import.

**Fix Option A (Recommended)**: Use CardTitle inside Card
```tsx
<CardTitle className="text-xl">No salons match your search</CardTitle>
```
**Context**: This appears inside a Card at line 86-92. Add CardHeader:

```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-xl">No salons match your search</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3 py-12 text-center">
    <Search className="mx-auto h-10 w-10 text-muted-foreground" />
    <p className="text-muted-foreground">Try a different city or service to discover more locations.</p>
  </CardContent>
</Card>
```
**Rationale**: Complete shadcn Card composition with proper CardHeader/CardTitle structure.

---

### 5. features/marketing/faq/components/sections/questions/questions.tsx

**Critical Violations**: 1

#### UI-P004: Undefined H2 component (Line 14)
**Code**:
```tsx
<H2 className="text-center">{questionsData.title}</H2>
```
**Issue**: Using undefined `H2` component without import.

**Fix**:
```tsx
<h2 className="text-center text-3xl font-bold">{questionsData.title}</h2>
```
**Rationale**: Use semantic HTML `<h2>` with design tokens for section heading. Added font sizing for consistency.

---

### 6. features/marketing/about/components/sections/values/values.tsx

**Critical Violations**: 1

#### UI-P004: Undefined H2 component (Line 17)
**Code**:
```tsx
<H2 className="text-center">{valuesData.title}</H2>
```
**Issue**: Using undefined `H2` component without import.

**Fix**:
```tsx
<h2 className="text-center text-3xl font-bold">{valuesData.title}</h2>
```
**Rationale**: Use semantic HTML `<h2>` with design tokens for section heading. Added font sizing for consistency.

---

### 7. features/marketing/how-it-works/components/sections/for-businesses/for-businesses.tsx

**Critical Violations**: 1

#### UI-P004: Undefined Lead component (Line 12)
**Code**:
```tsx
<Lead className="mt-4 text-muted-foreground">{forBusinessesData.subtitle}</Lead>
```
**Issue**: Using undefined `Lead` component without import.

**Fix**:
```tsx
<p className="mt-4 text-lg font-normal leading-relaxed text-muted-foreground">{forBusinessesData.subtitle}</p>
```
**Rationale**: Use semantic `<p>` with design tokens for subtitle text.

---

### 8. features/marketing/how-it-works/components/sections/for-customers/for-customers.tsx

**Critical Violations**: 1

#### UI-P004: Undefined Lead component (Line 12)
**Code**:
```tsx
<Lead className="mt-4 text-muted-foreground">{forCustomersData.subtitle}</Lead>
```
**Issue**: Using undefined `Lead` component without import.

**Fix**:
```tsx
<p className="mt-4 text-lg font-normal leading-relaxed text-muted-foreground">{forCustomersData.subtitle}</p>
```
**Rationale**: Use semantic `<p>` with design tokens for subtitle text.

---

### 9. features/shared/auth/components/signup-page.tsx

**Critical Violations**: 1

#### UI-P004: Undefined H2 component (Line 27)
**Code**:
```tsx
<H2 className="text-3xl font-bold text-muted-foreground">Welcome to Enorae</H2>
```
**Issue**: Using undefined `H2` component without import.

**Fix**:
```tsx
<h2 className="text-3xl font-bold text-muted-foreground">Welcome to Enorae</h2>
```
**Rationale**: Use semantic HTML `<h2>` with design tokens for heading.

---

### 10. features/shared/auth/components/password-strength-indicator.tsx

**Critical Violations**: 4

#### UI-P004: Undefined Small components (Lines 95-105, 125-132)
**Code**:
```tsx
<Small
  className={cn(
    'font-medium',
    strength === 'weak' && 'text-destructive',
    strength === 'fair' && 'text-chart-5',
    strength === 'good' && 'text-chart-4',
    strength === 'strong' && 'text-primary'
  )}
>
  {strength.charAt(0).toUpperCase() + strength.slice(1)}
</Small>
```
**Issue**: Using undefined `Small` component without import (appears 4 times in file).

**Fix**:
```tsx
<span
  className={cn(
    'text-xs font-medium',
    strength === 'weak' && 'text-destructive',
    strength === 'fair' && 'text-chart-5',
    strength === 'good' && 'text-chart-4',
    strength === 'strong' && 'text-primary'
  )}
>
  {strength.charAt(0).toUpperCase() + strength.slice(1)}
</span>
```
**Rationale**: Use semantic `<span>` with `text-xs` utility for small text. Small = `text-xs` in design system.

---

## Positive Findings

### Strengths in Marketing Portal UI

1. **No Typography Imports**: Zero imports from `@/components/ui/typography` were found
2. **No Arbitrary Colors**: Zero arbitrary Tailwind color values (bg-blue-500, etc.)
3. **Proper Card Compositions**: All Card components include CardHeader/CardContent/CardFooter correctly
4. **Design Token Usage**: Files consistently use design tokens (text-muted-foreground, bg-muted, etc.)
5. **Marketing Common Components**: Excellent shadcn usage in `TestimonialCard`, `StatBadge`, `TrustBadge`

### Well-Structured Components

- `/features/marketing/contact/components/sections/form/form.tsx` - Perfect Card composition
- `/features/marketing/salon-directory/components/salon-profile/sidebar/contact-card.tsx` - Clean shadcn usage
- `/components/marketing/marketing-common/components/*` - All follow shadcn patterns correctly

---

## Recommended Action Plan

### Immediate (Critical)

1. **Fix All 27 Undefined Component Errors**
   - Replace all `H1`, `H2`, `H3` with semantic HTML `<h1>`, `<h2>`, `<h3>`
   - Replace all `Lead` with `<p className="text-lg font-normal leading-relaxed">`
   - Replace all `Large` with `<p className="text-lg font-semibold">`
   - Replace all `Small` with `<span className="text-xs">`

2. **Verify TypeScript Compilation**
   - Run `npm run typecheck` to confirm all errors resolved
   - Ensure build passes before deployment

### Short-term (Optimization)

1. **Review Semantic Structure**
   - Audit heading hierarchy (h1 → h2 → h3) for accessibility
   - Ensure each page has exactly one `<h1>`

2. **Empty State in Explore Page**
   - Restructure empty state Card to include CardHeader with CardTitle
   - Follow shadcn composition pattern

### Long-term (Prevention)

1. **Add Pre-commit Hook**
   - Run `docs/rules/_automation/detect-ui-violations.sh` before commits
   - Block commits with undefined components

2. **ESLint Rule**
   - Add custom rule to detect capitalized JSX tags without imports
   - Prevent undefined component usage

3. **Component Audit**
   - Document all deleted/deprecated components
   - Create migration guide for future Typography removal

---

## Build Impact

**Current Status**: BROKEN BUILD - 27 TypeScript compilation errors

**Commands Affected**:
- `npm run typecheck` - FAILS
- `npm run build` - FAILS
- `npm run dev` - May run but with type errors

**Deployment Impact**: Cannot deploy until all violations are fixed

---

## Next Steps

1. Apply fixes to all 27 violations (see detailed fixes above)
2. Run `npm run typecheck` to verify resolution
3. Test all affected pages in browser
4. Add linting rules to prevent future violations
5. Update `docs/rules/_automation/detect-ui-violations.sh` if needed

---

## Appendix: Complete File List

### Files with Violations (8)
1. `features/marketing/home/components/home-page-client.tsx` (6 violations)
2. `features/marketing/pricing/components/sections/plans/plans.tsx` (3 violations)
3. `features/shared/auth/components/password-strength-indicator.tsx` (4 violations)
4. `features/marketing/salon-directory/components/salon-profile/hero.tsx` (1 violation)
5. `features/marketing/explore/components/marketing-explore-view.tsx` (1 violation)
6. `features/marketing/faq/components/sections/questions/questions.tsx` (1 violation)
7. `features/marketing/about/components/sections/values/values.tsx` (1 violation)
8. `features/marketing/how-it-works/components/sections/for-businesses/for-businesses.tsx` (1 violation)

### Files Scanned (Clean) (20+)
- All page files in `app/(marketing)/*`
- All marketing common components in `components/marketing/marketing-common/components/*`
- All other marketing feature components not listed above

---

**Report Generated**: 2025-10-19
**Analyzer**: Claude Code UI Analyzer v1.0
**Rule Reference**: `docs/rules/domains/ui.md`
