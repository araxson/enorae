# Staff Portal - Components Analysis

**Date**: 2025-10-20  
**Portal**: Staff  
**Layer**: Components  
**Files Analyzed**: 79  
**Issues Found**: 3 (Critical: 0, High: 2, Medium: 1, Low: 0)

---

## Summary

Reviewed all UI modules under `features/staff/**/components`. Most components correctly declare `'use client'`, lean on shadcn/ui primitives, and separate layout from data loaders. However, several shared building blocks ignore CLAUDE.md UI rules by styling shadcn slots directly or bypassing the prescribed `CardHeader` / `CardTitle` structure. This undermines the “use component slots as-is” guidance and complicates future design updates. We cross-checked the problematic components against Context7’s React Server Component recommendations (“Composing React Server and Client Components”) to ensure no server/client boundary leaks—none were found. The remaining issues focus on design system consistency.

---

## Issues

### High Priority

#### Issue #1: `StaffSummaryGrid` customizes `CardTitle` slot
**Severity**: High  
**File**: `features/staff/staff-common/components/staff-summary-grid.tsx:24-39`  
**Rule Violation**: CLAUDE.md UI Rule 2 (“Use component slots AS-IS – zero styling changes”).

**Current Code**:
```tsx
<CardHeader className="pb-3">
  <CardTitle>
    <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
      <span>{summary.label}</span>
      {Icon ? <Icon className="h-4 w-4 text-foreground" /> : null}
    </div>
  </CardTitle>
</CardHeader>
```

**Problem**:
`CardTitle` wraps a styled `<div>` with typography utilities, effectively overriding the slot’s typography. This breaks the shadcn contract (slots should render plain text) and introduces inconsistent heading styles across the dashboard.

**Required Fix**:
```tsx
<CardHeader className="pb-3">
  <CardTitle>{summary.label}</CardTitle>
  {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
</CardHeader>
```
If supplementary meta text is needed, move it to `CardDescription` or a sibling `div` outside the slot with layout-only classes.

**Steps to Fix**:
1. Render `summary.label` directly inside `CardTitle`.  
2. Move icon + helper text into layout wrappers *outside* the slot, using flex utilities only.  
3. Update associated CSS to rely on allowed layout tokens (no typography overrides).  
4. Retest summary cards to confirm layout is preserved.

**Acceptance Criteria**:
- [ ] `CardTitle` renders plain text without nested custom styling.  
- [ ] Icons/helper text sit outside the slot using layout utilities only.  
- [ ] Visual regression check confirms consistent typography with other cards.

**Dependencies**: None

---

#### Issue #2: Profile portfolio cards bypass shadcn card structure
**Severity**: High  
**Files**:  
- `features/staff/profile/components/profile-photo-upload.tsx:24-80`  
- `features/staff/profile/components/portfolio-gallery.tsx:24-84`  
**Rule Violation**: CLAUDE.md UI Rules 1 & 2 (use shadcn compositions, no custom typography).

**Current Code** (excerpt):
```tsx
<Card className="p-6">
  <div className="flex flex-col gap-4">
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Profile Photo</h3>
    …
    <p className="text-sm text-muted-foreground text-xs">
      Supported formats: JPEG, PNG, WebP (Max 5MB)
    </p>
  </div>
</Card>
```

**Problem**:
Both components bypass `CardHeader`/`CardContent` and reintroduce bespoke typography via `<h3>`/`<p>` utilities (`text-2xl`, `text-muted-foreground`, `border-dashed`). This breaks the design system and makes it harder to enforce global typography updates.

**Required Fix**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Profile Photo</CardTitle>
    <CardDescription>Supported formats: JPEG, PNG, WebP (max 5MB)</CardDescription>
  </CardHeader>
  <CardContent className="flex flex-col gap-4">
    {/* existing layout (Avatar, buttons, error text) */}
  </CardContent>
</Card>
```
Apply the same pattern to `PortfolioGallery`, using `CardDescription` (or `Muted` text component) instead of custom `<p>` styling. For the empty state, prefer `Alert` or `EmptyState` components over a nested `Card` with `border-dashed`.

**Steps to Fix**:
1. Replace `<h3>`/custom headings with `CardHeader`, `CardTitle`, `CardDescription`.  
2. Move layout spacing into `CardContent` (`flex`, `gap` ok).  
3. Swap dashed-border placeholder for an `EmptyState` pattern (e.g., `Alert` or `div` with layout-only classes).  
4. Drop redundant `document.getElementById` click handler—the `<label htmlFor>` handles input triggering.

**Acceptance Criteria**:
- [ ] Both components use `CardHeader` + slots with no custom typography classes.  
- [ ] Empty states leverage design-system primitives (Alert, Skeleton, etc.).  
- [ ] Manual QA confirms upload flows still work.

**Dependencies**: None

---

### Medium Priority

#### Issue #3: Time-off client headings fall back to raw `<h3>` styling
**Severity**: Medium  
**File**: `features/staff/time-off/components/time-off-requests-client.tsx:118-149`  
**Rule Violation**: CLAUDE.md UI Rule 1 (Compose with shadcn primitives; avoid ad-hoc typography).

**Current Code**:
```tsx
{activeTab === 'team' && (
  <div className="space-y-4">
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Team Time Off Calendar</h3>
    …
  </div>
)}
```

**Problem**:
The section heading uses raw Tailwind typography utilities instead of design-system primitives, producing inconsistent styles across tabs and making future theme updates harder.

**Required Fix**:
```tsx
{activeTab === 'team' && (
  <Card>
    <CardHeader>
      <CardTitle>Team Time Off Calendar</CardTitle>
      <CardDescription>Upcoming requests from your teammates</CardDescription>
    </CardHeader>
    <CardContent>
      {/* existing calendar content */}
    </CardContent>
  </Card>
)}
```
If the calendar should remain card-less, introduce a shared `SectionHeading` component that encapsulates the approved typography tokens.

**Steps to Fix**:
1. Wrap the team calendar block in a `Card` (or a shared section component).  
2. Replace the raw `<h3>` element with `CardTitle` / `CardDescription` (or the shared heading).  
3. Adjust surrounding spacing to avoid double padding when nesting cards.

**Acceptance Criteria**:
- [ ] Team tab headings use shadcn slots or shared heading component without ad-hoc typography classes.  
- [ ] Layout spacing remains consistent with other tabs.  
- [ ] Calendar renders unchanged aside from typography.

**Dependencies**: None

---

## Statistics

- Total Issues: 3  
- Files Affected: 4  
- Estimated Fix Time: 6 hours  
- Breaking Changes: 0 (visual polish only, but noticeable to users)

---

## Next Steps

1. Refactor summary grid and profile cards to honour shadcn slot semantics.  
2. Replace raw headings with design-system primitives in time-off and other sections.  
3. Once UI consistency is restored, proceed to type-safety analysis.

---

## Related Files

This analysis should be done after:
- [x] docs/staff-portal/03_MUTATIONS_ANALYSIS.md

This analysis blocks:
- [ ] docs/staff-portal/05_TYPES_ANALYSIS.md
