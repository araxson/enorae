# Business Portal - Components Analysis

**Date**: 2025-10-20
**Portal**: Business
**Layer**: Components
**Files Analyzed**: 198
**Issues Found**: 2 (Critical: 0, High: 2, Medium: 0, Low: 0)

---

## Summary

Reviewed 198 component files under `features/business/**/components`. Most modules are client components, aligning with React 19 recommendations (Context7 `/reactjs/react.dev`) for interactive UI. However, many shared widgets rely on bespoke Tailwind classes instead of composing shadcn/ui primitives “as-is,” breaching CLAUDE.md UI rules. `metric-card.tsx` and `dashboard-toolbar.tsx` inject arbitrary borders, typography, and accent props, deviating from `docs/stack-patterns/ui-patterns.md` and risking inconsistent branding. No Supabase access was detected in this layer, so security findings from MCP remain unchanged.

---

## Issues

### High Priority

#### Issue #1: Metric card introduces custom styling hooks
**Severity**: High  
**File**: `features/business/dashboard/components/metric-card.tsx:16-68`  
**Rule Violation**: UI Rule 2 – Use shadcn slots as-is (no extra classes)

**Current Code**:
```tsx
<Card … className={`overflow-hidden border-l-4 ${accent}`}>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    …
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{value}</div>
    <Progress … className={`mt-2 h-1 ${progressClass ?? ''}`} />
    <p className="mt-2 text-xs text-muted-foreground">{description}</p>
  </CardContent>
</Card>
```

**Problem**: The component adds custom borders, typography classes, and a dynamic `accent` prop to shadcn`s `Card`, contrary to UI patterns that require slot styling to stay untouched. This produces inconsistent visuals and blocks reuse of shared tokens.

**Required Fix**:
```tsx
<Card role="article" aria-label={`${title} metric`}>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    {icon}
  </CardHeader>
  <CardContent className="flex flex-col gap-2">
    <MetricValue value={value} />
    <Progress value={progress} aria-label={`${progress}% progress`} />
    <Muted>{description}</Muted>
  </CardContent>
</Card>
```
*(Extract layout wrappers (e.g., `MetricValue`, `Muted`) that compose existing tokens without overriding slot classes.)*

**Steps to Fix**:
1. Remove `className` overrides from `Card`, `CardHeader`, `CardContent`, and `Progress`.
2. Introduce small layout wrappers (div/Stack) outside shadcn slots for spacing needs.
3. Replace raw text classes with typography primitives (e.g., `Muted`) per `ui-patterns.md`.
4. Run `npm run typecheck`.

**Acceptance Criteria**:
- [ ] No shadcn slot (`Card*`, `Progress`) receives custom Tailwind classes.
- [ ] Typography uses shared tokens/components instead of `.text-*`.
- [ ] Visual spacing handled via container wrappers (not slot overrides).

**Dependencies**: None

---

#### Issue #2: Dashboard toolbar relies on bespoke Tailwind styling
**Severity**: High  
**File**: `features/business/dashboard/components/dashboard-toolbar.tsx:33-117`  
**Rule Violation**: UI Rule 5 – Avoid arbitrary styling; compose with layout primitives

**Current Code**:
```tsx
<div className="flex flex-col gap-4 rounded-xl border bg-card/40 px-4 py-3 shadow-sm md:px-6">
  …
  <Avatar className="h-9 w-9">…</Avatar>
  <span className="text-sm font-semibold text-foreground">{salonName}</span>
  …
  <Badge variant="secondary" className="gap-1">…</Badge>
  …
  <Button asChild variant="outline" className="hidden md:inline-flex">
    <Link href="/business/support">Support</Link>
  </Button>
  …
  <div className="flex items-center gap-3 text-xs text-muted-foreground">
    <Badge variant="outline">Timeframe {timeframe} days</Badge>
    …
  </div>
  …
  <Alert variant="default" className="bg-muted/30">
    <div className="flex items-center gap-2">
      <Target className="h-4 w-4 text-primary" />
      <AlertTitle>Weekly momentum</AlertTitle>
```

**Problem**: The toolbar wraps shadcn components in custom Tailwind classes (rounded borders, background, hidden breakpoints, typography overrides), violating the requirement to use layout primitives (`Stack`, `Grid`, etc.) without altering slot styling. This leads to bespoke theming that is hard to maintain.

**Required Fix**:
```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'

return (
  <Card>
    <CardHeader>
      <Stack direction="row" align="center" gap={3}>
        <Avatar>
          <AvatarFallback>{salonInitials}</AvatarFallback>
        </Avatar>
        <Stack>
          <Heading size="sm">{salonName}</Heading>
          <Muted>Review bookings, revenue, and reputation signals.</Muted>
        </Stack>
        …
      </Stack>
      …
    </CardHeader>
    <CardContent>
      {/* Compose Buttons, Select, Alert without extra Tailwind classes */}
    </CardContent>
  </Card>
)
```

**Steps to Fix**:
1. Replace outer `<div>` with `Card` + `CardHeader/CardContent`.
2. Use shared `Stack`/`Flex` utilities (from `ui-patterns.md`) for layout spacing instead of raw `className`.
3. Remove ad-hoc typography classes; use established text tokens (`Heading`, `Muted`, `Badge` defaults).
4. Keep responsive behaviour via existing primitives (e.g., `Button` variants + `Tooltip`), avoiding manual breakpoint classes.

**Acceptance Criteria**:
- [ ] Toolbar relies solely on approved layout primitives and shadcn components.
- [ ] No Tailwind class overrides remain on slot components.
- [ ] Visual design matches pattern library with theme tokens.

**Dependencies**: May require importing shared layout utilities if not already present.

---

## Statistics

- Total Issues: 2
- Files Affected: 2
- Estimated Fix Time: 4 hours
- Breaking Changes: Low (styling-only refactor)

---

## Next Steps

1. Refactor dashboard widgets to align with shadcn composition patterns.
2. Spot-check other component families after the refactor to ensure consistency.
3. Proceed to Type Safety analysis once UI adjustments are planned.

---

## Related Files

This analysis should be done after:
- [x] Layer 3: Mutations

This analysis blocks:
- [ ] Layer 5: Type Safety

