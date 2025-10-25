# Admin Portal - Components Analysis

**Date**: 2025-10-26
**Portal**: Admin
**Layer**: Components
**Files Analyzed**: 112
**Issues Found**: 2 (Critical: 0, High: 1, Medium: 1, Low: 0)

---

## Summary

Surveyed every component under `features/admin/**/components/`. Most files already lean on shadcn primitives (`Card`, `Table`, `Badge`, `Button`) and client components correctly declare `'use client'` before using React hooks. The main regressions came from slot styling: several `CardContent` blocks append typography classes (`text-sm`, `text-xs`) even though the pattern library mandates that card slots remain unstyled. Additionally, a handful of list/action affordances fall back to raw `<button>` tags with bespoke Tailwind styles instead of the shared `Button` primitive, fragmenting focus and hover behaviour.

---

## Issues

### High Priority

#### Issue #1: Card slots include typography classes
**Severity**: High  
**File**: `features/admin/analytics/components/acquisition-panel.tsx:22`, `features/admin/profile/components/profile-activity-card.tsx:104`, `features/admin/moderation/components/review-detail-helpers.tsx:88`, `features/admin/staff/components/staff-table-mobile.tsx:30`  
**Rule Violation**: UI Patterns – “Never customize slot styling; typography classes on CardContent/CardHeader are forbidden” (`docs/stack-patterns/ui-patterns.md`, Critical Rule #2)

**Current Code**:
```tsx
<CardContent className="space-y-4 text-sm">
  …
</CardContent>

<CardContent className="flex … gap-3 pt-0 text-xs text-muted-foreground">
  …
</CardContent>
```

**Problem**: Applying `text-sm`, `text-xs`, or color tokens directly to `CardContent`/`CardDescription` breaks the contract that shadcn slots remain style-free wrappers. This was explicitly called out as a “never” in the UI pattern guide; typography adjustments must live inside inner wrappers so that slot defaults stay cohesive across the design system.

**Required Fix**:
```tsx
<CardContent className="space-y-4">
  <div className="text-sm">
    …
  </div>
</CardContent>

<CardContent className="flex flex-wrap items-center justify-between gap-3 pt-0">
  <div className="text-xs text-muted-foreground">
    …
  </div>
</CardContent>
```

**Steps to Fix**:
1. Search for `CardContent className` (and other slot components) where typography classes appear.
2. Move text-related classes onto nested `<div>` / `<span>` wrappers, leaving the slot with layout-only classes (flex, gap, padding).
3. Run `npm run lint` or component previews to verify spacing remains correct.

**Acceptance Criteria**:
- [ ] No `text-*`, `font-*`, or color classes remain on `CardHeader`, `CardContent`, or `CardDescription`.
- [ ] Typography is applied only to inner elements while layout classes stay on the slot.
- [ ] Screenshots/visual tests confirm cards still render with expected spacing.

**Dependencies**: None

---

### Medium Priority

#### Issue #2: Raw `<button>` elements replace shadcn Button primitives
**Severity**: Medium  
**File**: `features/admin/roles/components/permissions-editor.tsx:41-53`, `features/admin/profile/components/profile-search-panel.tsx:60-82`  
**Rule Violation**: UI Patterns – “Use shadcn/ui primitives instead of bespoke controls” (`docs/stack-patterns/ui-patterns.md`, “Use shadcn/ui primitives”)

**Current Code**:
```tsx
<button
  type="button"
  onClick={() => onRemove(permission)}
  className="text-muted-foreground hover:text-foreground"
>
  <X className="h-3 w-3" />
</button>

<button
  type="button"
  onClick={() => onSelect(profile.id)}
  className={cn('w-full px-4 py-3 text-left …', isActive && 'bg-muted/80')}
>
  …
</button>
```

**Problem**: These bespoke buttons reimplement focus, hover, and disabled behaviour that the shared `Button` component already standardises. They also sprinkle raw Tailwind classes (`text-muted-foreground`, `hover:bg-muted/60`) instead of relying on the design tokens embedded in the primitive, increasing drift between admin and the rest of the product.

**Required Fix**:
```tsx
<Button
  type="button"
  variant="ghost"
  size="icon"
  onClick={() => onRemove(permission)}
  className="h-6 w-6 text-muted-foreground"
>
  <X className="h-3 w-3" />
</Button>

<Button
  type="button"
  variant={isActive ? 'secondary' : 'ghost'}
  className={cn('w-full justify-start px-4 py-3 text-left', isActive && 'bg-muted/80')}
  onClick={() => onSelect(profile.id)}
>
  …
</Button>
```

**Steps to Fix**:
1. Replace raw `<button>` instances with `Button` from `@/components/ui/button`, selecting `ghost`/`secondary` variants to replicate existing visuals.
2. Retain layout adjustments via `className`, but let the primitive control typography, focus ring, and disabled state.
3. Manually test keyboard navigation to confirm focus outlines remain accessible.

**Acceptance Criteria**:
- [ ] All interactive buttons in these components use the shared `Button` primitive.
- [ ] Focus, hover, and disabled states match the rest of the admin UI.
- [ ] No bespoke `<button>` elements with Tailwind styling remain.

**Dependencies**: None

---

### Low Priority

_No low-severity issues found._

---

## Statistics

- Total Issues: 2
- Files Affected: 6
- Estimated Fix Time: 3 hours
- Breaking Changes: No

---

## Next Steps

1. Refactor card slots to move typography classes into inner wrappers.
2. Swap bespoke buttons for the shared `Button` component and verify focus styles.

---

## Related Files

This analysis should be done after:
- [x] Layer 3 – Mutations analysis

This analysis blocks:
- [ ] Layer 5 – Types analysis
