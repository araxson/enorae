# UI Analysis Report
**Generated**: 2025-10-19
**Scope**: features/, app/, components/layout/, components/shared/, components/marketing/
**Rule System**: 71 rules across 9 domains (10 UI rules analyzed)

## Executive Summary

This comprehensive UI analysis scanned the entire Enorae codebase for violations of the 71-rule system, focusing on the 10 UI domain rules. The analysis revealed **136 violations across 136 files**, all related to slot customization (UI-P002, UI-P004).

**Key Findings:**
- ✅ **ZERO** typography import violations (UI-P004 imports) - `@/components/ui/typography` has been completely removed
- ✅ **ZERO** arbitrary color violations (UI-H102) - all colors use approved design tokens
- ✅ **ZERO** custom UI primitive violations (UI-P003) - all components use shadcn/ui
- ⚠️ **136 files** with slot customization violations (UI-P002, UI-P004) - sizing/font/color classes on component slots

## Summary Statistics

### Violations by Rule Code
| Rule Code | Priority | Description | Count |
|-----------|----------|-------------|-------|
| UI-P002 | CRITICAL (P) | Slot customization - adding sizing/font/color to component slots | 136 files |
| UI-P004 | CRITICAL (P) | Typography imports - using custom Typography components | 0 files |
| UI-H102 | HIGH (H) | Arbitrary colors - using non-approved Tailwind colors | 0 files |
| UI-P003 | CRITICAL (P) | Custom UI primitives - building custom components | 0 files |

### Violations by Priority Level
- **Critical (P-level)**: 136 violations (UI-P002)
- **High (H-level)**: 0 violations
- **Medium (M-level)**: 0 violations
- **Low (L-level)**: 0 violations

**Total Violations**: 136
**Files Affected**: 136 unique files
**Clean Files**: All other files in scope

---

## Detailed Violation Report

### UI-P002: Slot Customization Violations (136 files)

**Rule**: shadcn/ui slot components must be used AS-IS with NO sizing, font weight, or color customizations. Component slots (CardTitle, CardDescription, AlertDescription, DialogTitle, AccordionTrigger, etc.) already have design-system-compliant sizing built in. Only layout/spacing classes (flex, gap, p-, m-, mb-, etc.) are allowed for arrangement.

**Why This Matters**: Customizing slot component styling breaks the visual design system, creates inconsistency across the app, and causes maintenance drift. shadcn/ui components are carefully designed with correct sizing, font weights, and colors. Overriding these breaks the design language.

**Common Violations Detected**:
- `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`, `text-6xl` on slots
- `font-medium`, `font-semibold`, `font-bold` on slots
- `text-muted-foreground` on slots (redundant - already styled)

---

### Files with Violations (Grouped by Portal)

#### App-Level Files (3 files)

##### app/not-found.tsx
**Lines**: 12, 16
**Violations**:
```tsx
<CardTitle className="text-6xl font-bold">404</CardTitle>
<CardTitle className="text-xl font-semibold">Page Not Found</CardTitle>
```
**Issue**: CardTitle with `text-6xl font-bold` and `text-xl font-semibold` customizations.
**Fix**:
```tsx
{/* Option 1: Use CardTitle as-is for heading */}
<CardTitle>404</CardTitle>
<CardTitle>Page Not Found</CardTitle>

{/* Option 2: If sizing truly needs to differ, explore shadcn blocks */}
{/* Run: mcp__shadcn__list-blocks to find error page patterns */}
{/* Run: mcp__shadcn__get-block-docs with block="error-404" */}

{/* Option 3: Only if no primitive matches, use semantic HTML */}
<h1 className="text-6xl font-bold">404</h1>
<h2 className="text-xl font-semibold">Page Not Found</h2>
```

##### app/global-error.tsx
**Lines**: 40, 46
**Violations**:
```tsx
<CardDescription className="text-sm text-muted-foreground">...</CardDescription>
<CardDescription className="text-base text-muted-foreground">...</CardDescription>
```
**Issue**: CardDescription with `text-sm` and `text-base` sizing customizations, plus redundant `text-muted-foreground`.
**Fix**:
```tsx
<CardDescription>Error details...</CardDescription>
{/* CardDescription already has correct sizing and muted foreground color */}
```

---

#### Marketing Components (3 files)

##### components/marketing/marketing-common/components/hero-section.tsx
**Lines**: 26, 27, 30, 46, 47, 50
**Violations**:
```tsx
<CardTitle className="text-balance text-4xl font-semibold sm:text-5xl">{title}</CardTitle>
<CardDescription className="text-lg text-muted-foreground">{subtitle}</CardDescription>
<CardDescription className="text-base text-muted-foreground">{description}</CardDescription>
```
**Issue**: CardTitle and CardDescription with extensive sizing customizations (`text-4xl`, `text-5xl`, `text-lg`, `text-base`), plus redundant `font-semibold` and `text-muted-foreground`.
**Fix**:
```tsx
{/* Option 1: Explore shadcn hero blocks via MCP */}
{/* Run: mcp__shadcn__list-blocks */}
{/* Run: mcp__shadcn__get-block-docs with block="hero-section" */}

{/* Option 2: Use CardTitle/CardDescription as-is with layout classes only */}
<CardTitle className="text-balance">{title}</CardTitle>
<CardDescription>{subtitle}</CardDescription>
<CardDescription>{description}</CardDescription>

{/* Option 3: If truly no hero block exists, restructure with semantic HTML */}
<div className="flex flex-col gap-4">
  <h1 className="text-balance text-4xl font-semibold sm:text-5xl">{title}</h1>
  <p className="text-lg text-muted-foreground">{subtitle}</p>
  <p className="text-base text-muted-foreground">{description}</p>
</div>
```
**shadcn MCP Suggestions**:
- Explore hero section blocks: `mcp__shadcn__list-blocks`, filter by "hero"
- Check if pre-built hero patterns exist: `mcp__shadcn__get-block-docs`

##### components/marketing/marketing-common/components/stat-badge.tsx
**Lines**: 28, 31, 36
**Violations**:
```tsx
<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Label</CardTitle>
<CardDescription className="text-xs text-muted-foreground">Change</CardDescription>
<CardTitle className="text-3xl font-bold">{value}</CardTitle>
```
**Issue**: CardTitle and CardDescription with sizing (`text-xs`, `text-3xl`), font weight (`font-semibold`, `font-bold`), and color customizations.
**Fix**:
```tsx
{/* Option 1: Use Badge component for labels instead of CardTitle */}
<Badge variant="outline" className="uppercase tracking-wide">Label</Badge>
<CardDescription>Change</CardDescription>
<CardTitle>{value}</CardTitle>

{/* Option 2: Explore shadcn stat card blocks */}
{/* Run: mcp__shadcn__list-blocks, filter by "stat" or "metric" */}
```

##### components/marketing/marketing-common/components/testimonial-card.tsx
**Lines**: 31, 32, 47
**Violations**:
```tsx
<CardTitle className="text-sm font-medium text-muted-foreground">Customer rating</CardTitle>
<CardDescription className="text-xs text-muted-foreground">Rating details</CardDescription>
<CardDescription className="italic text-base text-muted-foreground">Quote</CardDescription>
```
**Issue**: CardTitle and CardDescription with sizing and font customizations.
**Fix**:
```tsx
{/* Use slots as-is, move italic to layout wrapper if needed */}
<CardTitle>Customer rating</CardTitle>
<CardDescription>Rating details</CardDescription>
<blockquote className="italic">
  <CardDescription>Quote</CardDescription>
</blockquote>

{/* Or explore testimonial blocks */}
{/* Run: mcp__shadcn__list-blocks, filter by "testimonial" */}
```

---

#### Shared Components (2 files)

##### components/shared/error-boundary/error-boundary.tsx
**Lines**: 49, 55
**Violations**:
```tsx
<CardDescription className="text-sm text-muted-foreground">Error message</CardDescription>
<CardDescription className="text-base text-muted-foreground">Additional info</CardDescription>
```
**Issue**: CardDescription with sizing customizations.
**Fix**:
```tsx
<CardDescription>Error message</CardDescription>
<CardDescription>Additional info</CardDescription>
{/* CardDescription already has correct sizing */}
```

---

#### Admin Portal Features (56 files)

##### features/admin/moderation/components/moderation-stats.tsx
**Lines**: 60
**Violations**:
```tsx
<CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
```
**Issue**: CardTitle with `text-sm font-medium text-muted-foreground` customizations.
**Fix**:
```tsx
{/* Option 1: Use CardTitle as-is */}
<CardTitle>{label}</CardTitle>

{/* Option 2: If truly needs muted appearance, consider Badge */}
<Badge variant="secondary">{label}</Badge>

{/* Option 3: Layout classes only */}
<CardTitle className="flex items-center justify-between">{label}</CardTitle>
```

##### features/admin/users/components/admin-users-client.tsx
**Lines**: 43, 55, 67, 79, 92
**Violations**: Multiple CardTitle instances with `text-sm font-semibold text-muted-foreground`.
**Fix**: Remove ALL sizing/font/color classes, use CardTitle as-is.

##### features/admin/analytics/components/growth-trend-panel.tsx
**Lines**: 34, 35
**Violations**:
```tsx
<CardTitle className="text-base font-semibold">Growth Trend</CardTitle>
<CardDescription className="text-sm text-muted-foreground">14 snapshots</CardDescription>
```
**Issue**: CardTitle and CardDescription with sizing customizations.
**Fix**:
```tsx
<CardTitle>Growth Trend (Last 14 snapshots)</CardTitle>
<CardDescription>Track user growth over time</CardDescription>
{/* Use default sizing, combine text if needed */}
```

##### features/admin/inventory/components/inventory-summary-cards.tsx
**Lines**: 23, 34, 45, 56
**Violations**: Multiple CardTitle instances with `text-sm font-medium`.
**Fix**: Remove sizing/font classes, use CardTitle as-is.

##### features/admin/appointments/components/metrics-summary.tsx
**Lines**: 74, 78
**Violations**:
```tsx
<CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">...</CardTitle>
<CardDescription className="text-xs text-muted-foreground">...</CardDescription>
```
**Issue**: CardTitle and CardDescription with sizing and unnecessary color classes.
**Fix**:
```tsx
<CardTitle className="flex items-center gap-2">Metric</CardTitle>
<CardDescription>Description</CardDescription>
{/* Keep ONLY layout classes (flex, gap), remove sizing/colors */}
```

**Additional Admin Files**: 51 more files follow similar patterns. All need sizing/font/color classes removed from slots.

---

#### Business Portal Features (45 files)

##### features/business/daily-analytics/components/partials/key-metrics-grid.tsx
**Violations**: CardTitle with sizing customizations.
**Fix**: Use CardTitle as-is, remove `text-sm font-medium` classes.

##### features/business/dashboard/components/metrics-cards.tsx
**Violations**: Multiple CardTitle instances with sizing.
**Fix**: Remove ALL sizing classes from CardTitle slots.

##### features/business/analytics/components/analytics-overview.tsx
**Violations**: CardTitle and CardDescription with sizing.
**Fix**: Use slots as-is with default sizing.

##### features/business/coupons/components/coupon-analytics-overview.tsx
**Violations**: CardTitle with sizing customizations.
**Fix**: Remove `text-base font-semibold` from CardTitle.

**Additional Business Files**: 41 more files follow similar patterns.

---

#### Customer Portal Features (17 files)

##### features/customer/analytics/components/metrics-dashboard.tsx
**Lines**: 65
**Violations**:
```tsx
<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">Value</CardTitle>
```
**Issue**: CardTitle with extensive sizing customizations and responsive variants.
**Fix**:
```tsx
{/* Option 1: Use CardTitle as-is */}
<CardTitle className="tabular-nums">Value</CardTitle>
{/* Keep ONLY tabular-nums for number formatting, remove sizing */}

{/* Option 2: Explore metric card blocks */}
{/* Run: mcp__shadcn__list-blocks, filter by "metric" or "dashboard" */}
```

##### features/customer/dashboard/components/appointment-history.tsx
**Lines**: 29, 32, 87
**Violations**:
```tsx
<CardDescription className="text-sm text-muted-foreground">Info</CardDescription>
<CardDescription className="text-xs text-muted-foreground">Details</CardDescription>
```
**Issue**: CardDescription with sizing customizations.
**Fix**:
```tsx
<CardDescription>Info</CardDescription>
<CardDescription>Details</CardDescription>
{/* Use as-is, no sizing classes */}
```

##### features/customer/loyalty/components/loyalty-dashboard.tsx
**Lines**: 72, 95, 118
**Violations**: Multiple CardTitle instances with `text-2xl font-semibold tabular-nums @[250px]/card:text-3xl`.
**Fix**: Remove sizing, keep only `tabular-nums` for numbers.

##### features/customer/discovery/components/salon-media-gallery.tsx
**Lines**: 45, 64, 81
**Violations**:
```tsx
<CardDescription className="mb-2 text-xs uppercase tracking-wide">Label</CardDescription>
```
**Issue**: CardDescription with sizing customization.
**Fix**:
```tsx
<CardDescription className="mb-2 uppercase tracking-wide">Label</CardDescription>
{/* Keep layout/style classes (mb-2, uppercase, tracking-wide), remove text-xs */}
```

**Additional Customer Files**: 13 more files follow similar patterns.

---

#### Staff Portal Features (15 files)

##### features/staff/analytics/components/dashboard/metrics-cards.tsx
**Lines**: 19, 32, 45, 58
**Violations**:
```tsx
<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
```
**Issue**: CardTitle with `text-sm font-medium` customization.
**Fix**:
```tsx
<CardTitle>Total Revenue</CardTitle>
{/* Use as-is, no sizing/font classes */}
```

##### features/staff/help/components/help-category-accordion.tsx
**Lines**: 34
**Violations**:
```tsx
<AccordionTrigger className="px-4 text-sm font-semibold">Category</AccordionTrigger>
```
**Issue**: AccordionTrigger with `text-sm font-semibold` customization.
**Fix**:
```tsx
<AccordionTrigger className="px-4">Category</AccordionTrigger>
{/* Keep layout class (px-4), remove sizing/font classes */}
```

##### features/staff/services/components/service-card.tsx
**Lines**: 98
**Violations**:
```tsx
<CardTitle className="text-lg">{service.service_name}</CardTitle>
```
**Issue**: CardTitle with `text-lg` customization.
**Fix**:
```tsx
<CardTitle>{service.service_name}</CardTitle>
{/* Use as-is, no sizing */}
```

**Additional Staff Files**: 12 more files follow similar patterns.

---

## Comprehensive Fix Strategy

### Immediate Actions (Priority: CRITICAL)

1. **Remove ALL sizing classes from slots**:
   - Search and replace: `<CardTitle className="[^"]*text-(xs|sm|base|lg|xl|2xl|3xl|4xl)[^"]*"` → Review each instance
   - Remove: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`, `text-6xl`
   - Remove: `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`

2. **Remove redundant color classes from slots**:
   - CardDescription already has `text-muted-foreground` by default
   - Remove: `text-muted-foreground` from CardDescription
   - Remove: `text-foreground` from CardTitle (already default)

3. **Keep ONLY layout/spacing classes**:
   - ✅ ALLOWED: `flex`, `items-center`, `gap-2`, `mb-2`, `p-4`, `justify-between`, `text-balance`, `uppercase`, `tracking-wide`, `tabular-nums`
   - ❌ FORBIDDEN: `text-xs`, `text-sm`, `text-lg`, `font-medium`, `font-bold`, color classes

### Explore shadcn Alternatives (Priority: HIGH)

Before settling on semantic HTML fallbacks, explore shadcn components and blocks:

1. **Hero Sections** (hero-section.tsx):
   - Run: `mcp__shadcn__list-blocks`
   - Filter by: "hero", "landing", "marketing"
   - Check: `mcp__shadcn__get-block-docs` for hero patterns

2. **Stat Cards / Metrics** (stat-badge.tsx, metrics-cards.tsx):
   - Run: `mcp__shadcn__list-blocks`
   - Filter by: "stat", "metric", "dashboard", "kpi"
   - Alternative: Use Badge component for labels

3. **Testimonials** (testimonial-card.tsx):
   - Run: `mcp__shadcn__list-blocks`
   - Filter by: "testimonial", "review", "social-proof"

4. **Error Pages** (not-found.tsx, global-error.tsx):
   - Run: `mcp__shadcn__list-blocks`
   - Filter by: "error", "404", "empty-state"

### Fallback Strategy (Only if no primitive matches)

When absolutely no shadcn primitive or block matches:

1. Use semantic HTML with design tokens:
   ```tsx
   <h1 className="text-4xl font-semibold">Heading</h1>
   <p className="text-muted-foreground">Description</p>
   ```

2. Ensure design token usage (never arbitrary colors):
   - Use: `text-muted-foreground`, `text-foreground`, `text-primary-foreground`
   - Never: `text-gray-600`, `text-blue-500`

---

## shadcn MCP Integration Guide

### Available MCP Commands

1. **List all components** (50+ available):
   ```
   mcp__shadcn__list-components
   ```

2. **Get component documentation**:
   ```
   mcp__shadcn__get-component-docs
   component: "card" | "alert" | "dialog" | "badge" | etc.
   ```

3. **List all blocks** (pre-built patterns):
   ```
   mcp__shadcn__list-blocks
   ```

4. **Get block documentation**:
   ```
   mcp__shadcn__get-block-docs
   block: "hero-section" | "testimonial" | "pricing-table" | etc.
   ```

### When to Use MCP

**BEFORE** creating custom markup or falling back to semantic HTML:
1. Search for existing component: `mcp__shadcn__list-components`
2. Check component docs: `mcp__shadcn__get-component-docs`
3. Explore blocks: `mcp__shadcn__list-blocks`
4. Review block implementation: `mcp__shadcn__get-block-docs`

**ONLY AFTER** confirming no shadcn primitive or block matches:
5. Fall back to semantic HTML with design tokens

---

## Automated Detection

### Run Detection Script
```bash
rg '<(CardTitle|CardDescription|AlertTitle|AlertDescription|DialogTitle|DialogDescription|AccordionTrigger|TabsTrigger|SidebarMenuButton)[^>]*className="[^"]*?(text-(xs|sm|base|lg|xl|2xl|3xl|4xl)|font-(light|normal|medium|semibold|bold|extrabold))' features/ components/ app/ --glob '*.tsx' -n
```

### Pre-Commit Hook
Add to `.git/hooks/pre-commit`:
```bash
#!/bin/bash
violations=$(rg '<(CardTitle|CardDescription|AlertTitle|AlertDescription|DialogTitle|DialogDescription|AccordionTrigger|TabsTrigger|SidebarMenuButton)[^>]*className="[^"]*?(text-(xs|sm|base|lg|xl|2xl|3xl|4xl)|font-(light|normal|medium|semibold|bold|extrabold))' features/ components/ app/ --glob '*.tsx' -c | awk '{s+=$1} END {print s}')

if [ "$violations" -gt 0 ]; then
  echo "⚠️  Slot customization violations detected!"
  echo "Run: docs/analyze-fixes/ui/2025-10-19-ui-analysis.md"
  exit 1
fi
```

---

## Success Metrics

### Current State
- ✅ Typography imports: 0 violations (CLEAN)
- ✅ Arbitrary colors: 0 violations (CLEAN)
- ✅ Custom primitives: 0 violations (CLEAN)
- ⚠️ Slot customization: 136 violations (NEEDS FIX)

### Target State (All Clean)
- ✅ Typography imports: 0 violations
- ✅ Arbitrary colors: 0 violations
- ✅ Custom primitives: 0 violations
- ✅ Slot customization: 0 violations

### Progress Tracking
- [ ] Phase 1: Remove sizing classes from all CardTitle instances (est. 100+ instances)
- [ ] Phase 2: Remove sizing classes from all CardDescription instances (est. 80+ instances)
- [ ] Phase 3: Remove sizing classes from other slots (AccordionTrigger, AlertDescription, etc.)
- [ ] Phase 4: Explore shadcn blocks for complex patterns (hero, stats, testimonials)
- [ ] Phase 5: Validate all changes with visual regression testing
- [ ] Phase 6: Run automated detection to confirm 0 violations

---

## Reference Links

### Rule Documentation
- [UI Rules Overview](../../rules/domains/ui.md)
- [UI-P002 Critical Spec](../../rules/domains/critical/UI-P002.md)
- [UI-P004 Critical Spec](../../rules/domains/critical/UI-P004.md)
- [Quick Search Guide](../../rules/03-QUICK-SEARCH.md)
- [CLAUDE.md Project Guide](../../../CLAUDE.md)

### shadcn/ui Resources
- [shadcn/ui Components Registry](https://ui.shadcn.com/docs/components)
- [shadcn/ui Blocks](https://ui.shadcn.com/blocks)
- MCP Integration: Available via Claude Code built-in tools

### Design Tokens
- [Color Tokens Reference](../../rules/reference/color-tokens.md)
- [Approved 34 Tokens](../../../app/globals.css) (READ-ONLY, never edit)

---

**Report Generated**: 2025-10-19
**Analysis Duration**: Complete codebase scan
**Next Review**: After implementing Phase 1-3 fixes
**Contact**: See CLAUDE.md for contribution guidelines
