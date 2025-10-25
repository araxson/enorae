# Business Portal - Components Analysis

**Date**: 2025-10-25  
**Portal**: Business  
**Layer**: Components  
**Files Analyzed**: 242  
**Issues Found**: 2 (Critical: 0, High: 0, Medium: 2, Low: 0)

---

## Summary

- Surveyed all `.tsx` files under `features/business/**/components/`. Most components follow shadcn/ui composition and avoid editing primitives.
- Verified no imports from `@/components/ui/typography` and minimal custom primitives; layout is typically handled via `flex`, `grid`, and spacing utilities.
- Found recurring typography styling that conflicts with `docs/stack-patterns/ui-patterns.md`, which mandates using shadcn slots for semantic headings and avoiding ad-hoc Tailwind font/size classes on text content.
- Also noted a few hero sections duplicating heading styles with raw `<h1>` tags instead of `CardTitle`/`SectionHeading` wrappers, leading to inconsistent typography and i18n drift.

---

## Issues

### Medium Priority

#### Issue #1: Audit Logs Content Uses Custom Typography Instead of shadcn Slots
**Severity**: Medium  
**File**: `features/business/settings-audit-logs/components/audit-logs-content.tsx:17-20`  
**Rule Violation**: UI Typography Rule — `docs/stack-patterns/ui-patterns.md` (“Use shadcn slots as-is; avoid manual font sizing”)

**Current Code**:
```tsx
<div>
  <h1 className="text-4xl font-bold">Security Audit Logs</h1>
  <p className="leading-7 text-muted-foreground">
    Track all system activities and security events
  </p>
</div>
```

**Problem**:
- Manually applies `text-4xl font-bold` to a raw `<h1>`, bypassing shadcn slots (`CardTitle`, `SectionHeading`) that enforce consistent typography. This duplicates styling logic across pages, makes localization harder, and violates the “no custom typography” directive.
- The paragraph likewise relies on Tailwind typography classes where `CardDescription` or `Muted` slots should be used.

**Required Fix**:
```tsx
<CardHeader className="px-0">
  <CardTitle>Security Audit Logs</CardTitle>
  <CardDescription>Track all system activities and security events</CardDescription>
</CardHeader>
```
*(or reuse a shared `<SectionHeader>` component if available)*

**Steps to Fix**:
1. Wrap the intro copy in the existing shadcn card header (or shared heading) and drop custom font classes.
2. Remove redundant spacing utilities once the shadcn slots are in place.
3. Verify the hero still renders correctly in desktop and mobile breakpoints.

**Acceptance Criteria**:
- [ ] No `text-4xl font-bold` style blocks remain in audit logs components.
- [ ] Heading + description render via shadcn slots.
- [ ] Snapshots (if any) updated to reflect new structure.

**Dependencies**: None

---

#### Issue #2: Customer Insights Dashboard Uses Tailwind Typography in Card Content
**Severity**: Medium  
**File**: `features/business/analytics/components/customer-insights-dashboard.tsx:46-118`  
**Rule Violation**: UI Typography Rule — `docs/stack-patterns/ui-patterns.md`

**Current Code**:
```tsx
<CardContent>
  <p className="text-3xl font-bold">${metrics.lifetime_value.toFixed(2)}</p>
</CardContent>
…
<p className="text-lg font-semibold">
  {metrics.first_visit_date ? … : 'Unavailable'}
</p>
```

**Problem**:
- Relies on ad-hoc `text-3xl font-bold` / `text-lg font-semibold` styling inside cards. Over time these diverge from the design system, and designers must manually police weights/sizes.
- The pattern appears across multiple cards in the dashboard, duplicating styles and increasing maintenance.

**Required Fix**:
```tsx
<CardContent>
  <MetricValue value={metrics.lifetime_value} />
</CardContent>
…
<span className="text-sm text-muted-foreground">First visit</span>
<MetricSubheading>{formattedFirstVisit}</MetricSubheading>
```
*(either introduce reusable metric components or lean on existing shadcn text primitives such as `CardTitle`, `CardDescription`, `Badge` variants.)*

**Steps to Fix**:
1. Extract a shared metric value component (e.g., `<MetricValue>` using `text-2xl font-semibold` standard) or reuse an existing shadcn slot.
2. Replace ad-hoc `<p className="text-lg …">` usages with the shared component.
3. Remove redundant typography classes from the dashboard.

**Acceptance Criteria**:
- [ ] Dashboard cards rely on shared metric/text primitives rather than custom Tailwind font utilities.
- [ ] Visual hierarchy matches design system tokens.
- [ ] ESLint/TypeScript lint runs clean.

**Dependencies**: None

---

## Statistics

- Total Issues: 2
- Files Affected: 2
- Estimated Fix Time: 3 hours
- Breaking Changes: No (styling only)

---

## Next Steps

1. Implement shared metric/section heading primitives and adopt them across analytics/audit sections.
2. Perform a secondary sweep for remaining `text-xxl` typography utilities in Business components.
3. Sync with design to confirm the standardized tokens before batching PRs.

---

## Related Files

This analysis should be done after:
- [x] `docs/business-portal/03_MUTATIONS_ANALYSIS.md`

This analysis blocks:
- [ ] `docs/business-portal/05_TYPES_ANALYSIS.md`
