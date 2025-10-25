# Customer Portal - Components Analysis

**Date**: 2025-10-25
**Portal**: Customer
**Layer**: Components
**Files Analyzed**: 53
**Issues Found**: 3 (Critical: 0, High: 2, Medium: 1, Low: 0)

---

## Summary

- Surveyed every component under `features/customer/**/components`. Client-side modules correctly declare `'use client'` when using React hooks, and most server components remain pure presentation, following `docs/stack-patterns/react-patterns.md`.
- shadcn/ui primitives (`Card`, `Button`, `Dialog`, etc.) are consistently imported, but many components still layer typography and color utilities on top of the slots, which breaks the “layout classes only” rule in `docs/stack-patterns/ui-patterns.md`.
- Loyalty and referral dashboards surface CTAs that depend on backend features which do not exist (see Layer 2 & 3 analyses). Because the components surface “Redeem”/“Generate code” pathways without working data, the UX misleads customers.

---

## Issues

### High Priority

#### Issue #1: Typography & color utilities applied directly to shadcn slots
**Severity**: High  
**File**: `features/customer/staff-profiles/components/staff-profile-detail.tsx:24-125` (also see `favorites/components/favorites-list.tsx:35-78`, `loyalty/components/loyalty-dashboard.tsx:34-178`)  
**Rule Violation**: UI Pattern Rule #2 (“Use component slots AS-IS”) & Rule #6 (“No arbitrary styling – layout classes only”).

**Current Code**:
```tsx
<div className="flex gap-2 items-center">
  <Star className="h-5 w-5 fill-primary text-primary" />
  <p className="text-sm text-muted-foreground">
    ({profile.review_count || 0} reviews)
  </p>
</div>
...
<h3 className="scroll-m-20 text-2xl mb-4">Services Offered</h3>
<p className="text-sm text-muted-foreground line-clamp-2">
  {service['description']}
</p>
<Card className="bg-primary/5">
```

**Problem**:
- Components rely on Tailwind typography/color utilities (`text-sm`, `text-muted-foreground`, `text-2xl`, `bg-primary/5`, `border-b`, etc.) instead of using the semantic slots provided by shadcn UI.  
- This violates the enforced styling contract (slots must remain unstyled, only layout utilities like `flex`, `gap`, `px` are allowed) and introduces inconsistent theming across the portal.

**Required Fix**:
```tsx
<div className="flex items-center gap-2">
  <Star className="h-5 w-5 text-primary" aria-label="Average rating" />
  <CardDescription>{profile.review_count ?? 0} reviews</CardDescription>
</div>
...
<SectionHeading>Services Offered</SectionHeading> {/* new wrapper built from shadcn primitives */}
<CardDescription>{service.description}</CardDescription>
<Card variant="secondary">...</Card>
```
*(Wrap repeated layout/text patterns in reusable components—e.g., `SectionHeading`, `KeyValueRow`—that internally use shadcn slots without extra Tailwind typography utilities.)*

**Steps to Fix**:
1. Audit each component for non-layout class names (`text-*`, `bg-*`, `border-*`, `line-clamp`, etc.) and replace them with semantic shadcn slots (`CardDescription`, `Muted`, `Badge` variants) or purpose-built wrapper components.
2. Where contextual emphasis is required, add new shadcn-based primitives under `features/shared/ui-components` instead of bolting on Tailwind text utilities.
3. Remove color overlays like `bg-primary/5`; use component variants (`Card`, `Badge`, `Alert`) to achieve the desired tone.
4. Run `npm run typecheck` (ensures refactors preserve props).

**Acceptance Criteria**:
- [ ] No customer component applies non-layout Tailwind classes to shadcn slots.
- [ ] Headings/paragraphs use semantic shadcn typography helpers.
- [ ] Visual hierarchy matches design via component variants, not ad-hoc utilities.

**Dependencies**: May require product design alignment on acceptable variants.

---

#### Issue #2: Loyalty & referral dashboards surface non-functional CTAs
**Severity**: High  
**File**: `features/customer/loyalty/components/loyalty-dashboard.tsx:34-178`, `features/customer/referrals/components/referral-dashboard.tsx:34-190`  
**Rule Violation**: Phase 1.5 Database Alignment (“Database is the source of truth”); UX layer requirement for truthful states.

**Current Code**:
```tsx
<Button size="sm" className="w-full" disabled={!points || points.total_points < 500}>
  Redeem
</Button>
...
const result = await generateReferralCode()
if (result.success) {
  toast({ title: 'Referral code generated', description: `Your code is: ${result.code}` })
}
```

**Problem**:
- Underlying queries/mutations return placeholders (`null`/`[]`, thrown TODO errors). Components still render “Redeem”, “Generate referral code”, “Share via email/SMS” flows, promising functionality that doesn’t exist.
- Users encounter fatal errors or silent no-ops, eroding trust and contradicting the “database is source of truth” directive established earlier.

**Required Fix**:
```tsx
if (!points) {
  return <EmptyState title="Loyalty unavailable" description="This program isn’t live yet." />
}

if (!referralCode) {
  return (
    <ComingSoon
      title="Referrals coming soon"
      description="We’ll notify you when referral rewards are available."
    />
  )
}
```
*Alternatively, gate the components behind feature flags tied to real schema rows.*

**Steps to Fix**:
1. Coordinate with product/engineering to determine go-live timeline for loyalty/referrals.
2. Until backend support exists, replace the dashboards with explicit “Coming soon” or remove the routes.
3. When real data lands, connect buttons to functioning mutations and handle errors surfaced by Supabase.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Loyalty and referral screens do not expose actions unless backing data/mutations are live.
- [ ] Empty/coming-soon states clearly communicate feature availability.
- [ ] Tests (or manual QA) show no runtime errors when interacting with the dashboards today.

**Dependencies**: Backend roadmap for loyalty/referral programs.

---

### Medium Priority

#### Issue #3: Custom rating widget bypasses shadcn button primitives
**Severity**: Medium  
**File**: `features/customer/reviews/components/edit-review-dialog.tsx:96-115`  
**Rule Violation**: UI Pattern guidance – prefer shadcn primitives over raw HTML controls.

**Current Code**:
```tsx
<button
  key={value}
  type="button"
  onClick={() => setRating(value)}
  className="transition-colors hover:scale-110"
>
  <Star ... />
</button>
```

**Problem**:
- The component renders plain `<button>` elements with Tailwind effects. This reintroduces custom styling and focus handling the design system already solves via `Button` or `Toggle` primitives.
- Accessibility attributes (ARIA pressed state, keyboard focus ring) are missing, making the rating control harder to use.

**Required Fix**:
```tsx
<Toggle
  key={value}
  aria-label={`Rate ${value} stars`}
  pressed={value <= rating}
  onPressedChange={() => setRating(value)}
  className="h-8 w-8"
>
  <Star className={value <= rating ? 'fill-accent text-accent' : ''} />
</Toggle>
```
*(Use shadcn’s `Toggle` or `Button` with `variant="ghost"` to inherit accessible focus/focus-visible states.)*

**Steps to Fix**:
1. Swap raw `<button>` for an accessible shadcn primitive (`Toggle`, `Button`).
2. Add an `aria-label` and rely on component variants for hover/focus styling rather than Tailwind utilities.
3. Verify keyboard navigation across the rating widget.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] Rating controls use shadcn primitives with built-in accessibility.
- [ ] No custom hover/scale Tailwind classes remain.
- [ ] Keyboard users can adjust ratings without losing focus indication.

**Dependencies**: None.

---

## Statistics

- Total Issues: 3
- Files Affected: 6
- Estimated Fix Time: 1.5 days
- Breaking Changes: Low (presentation refactor)

---

## Next Steps

1. Refactor high-traffic components (staff profile, favorites, loyalty, referrals) to rely on semantic shadcn slots and remove custom typography utilities.
2. Implement feature flags or explicit “Coming soon” states for loyalty/referral dashboards until Supabase schema and mutations are live.
3. Update custom interaction widgets (e.g., review rating stars) to use the design-system primitives.

---

## Related Files

This analysis should be done after:
- [x] docs/customer-portal/03_MUTATIONS_ANALYSIS.md

This analysis blocks:
- [ ] docs/customer-portal/05_TYPES_ANALYSIS.md
