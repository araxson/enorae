# UI Analysis Report: Admin Moderation Feature

**Generated:** 2025-10-19
**Scope:** `features/admin/moderation/**/*.tsx`
**Feature:** Admin Moderation Dashboard

---

## Executive Summary

- **Total Violations:** 7
- **Priority (P):** 2 violations (CRITICAL)
- **Highly-Recommended (H):** 3 violations
- **Must-Consider (M):** 0 violations
- **Legacy (L):** 0 violations

### Critical Issues

1. **UI-P004 (Typography Imports):** 2 violations across 2 files
   - Custom Typography components imported instead of using shadcn primitives
   - Affects: `moderation-client.tsx`, `review-detail-dialog.tsx`, `review-detail-helpers.tsx`

2. **UI-H102 (Arbitrary Colors):** 3 violations
   - Using `text-base` class instead of semantic tokens
   - Affects: `moderation-client.tsx`, `moderation-stats.tsx`, `review-detail-helpers.tsx`, `reviews-table.tsx`

3. **UI-P002 (Incomplete Compositions):** 2 violations
   - Alert composition missing required subcomponents
   - Affects: `review-detail-helpers.tsx`

---

## Violations by File

### features/admin/moderation/components/moderation-client.tsx

#### UI-P004: Typography import detected (Line 4)

**Code:**
```tsx
import { P, Muted, Small } from '@/components/ui/typography'
```

**Issue:** Importing custom Typography components instead of using shadcn primitives or semantic HTML with design tokens.

**Fix:**
1. Remove this import completely
2. For text content in this file, use existing shadcn slots where applicable:
   - Line 77-80: Use Card with CardHeader + CardTitle + CardDescription
   - Insight cards already use proper composition with Badge components
3. For standalone text without a clear slot, use semantic HTML with design tokens:
   ```tsx
   // Instead of <P>
   <p className="text-sm text-foreground">Content moderation</p>

   // Instead of <Muted>
   <p className="text-sm text-muted-foreground">Description text</p>
   ```
4. Consider using shadcn MCP to explore relevant blocks:
   - `mcp__shadcn__get-component-docs` for Card patterns
   - `mcp__shadcn__list-blocks` for dashboard patterns

**Priority:** CRITICAL - Must fix

---

#### UI-H102: Arbitrary text color class (Line 77, 78, 106, 107, 124, 125)

**Code:**
```tsx
<p className="text-base text-base font-semibold">Content moderation</p>
<p className="text-muted-foreground text-sm">
  Monitor at-risk reviews, sentiment trends...
</p>
```

**Issue:** Using duplicate `text-base` class (appears to be a typo) and not following proper semantic structure. This section should use Card composition.

**Fix:**
Replace the entire header section (lines 76-81) with proper Card composition:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Content moderation</CardTitle>
    <CardDescription>
      Monitor at-risk reviews, sentiment trends, and reviewer reputation across the platform.
    </CardDescription>
  </CardHeader>
</Card>
```

Or if this is meant to be a simple page header without a Card:
```tsx
<div className="space-y-1">
  <h1 className="text-2xl font-semibold tracking-tight">Content moderation</h1>
  <p className="text-sm text-muted-foreground">
    Monitor at-risk reviews, sentiment trends, and reviewer reputation across the platform.
  </p>
</div>
```

**Additional violations in AdminInsightCard render items:**
- Lines 106-107: Using `text-base` instead of relying on Card's default styling
- Lines 124-125: Same issue

**Fix for insight card items:**
```tsx
<div className="min-w-0">
  <p className="text-sm font-medium truncate">{review.customer_name || 'Anonymous'}</p>
  <p className="text-xs text-muted-foreground truncate">{review.salon_name || 'Unknown salon'}</p>
</div>
```

**Priority:** HIGHLY-RECOMMENDED - Important for consistency

---

### features/admin/moderation/components/moderation-stats.tsx

#### UI-H102: Arbitrary text class (Line 64)

**Code:**
```tsx
<p className="text-base text-2xl font-semibold">
  {typeof value === 'number' ? value : value}
</p>
```

**Issue:** Using `text-base` alongside `text-2xl` (conflicting classes) and unnecessary ternary expression.

**Fix:**
```tsx
<p className="text-2xl font-semibold">
  {value}
</p>
```

The `text-base` class conflicts with `text-2xl` and serves no purpose. Remove it and simplify the logic.

**Priority:** HIGHLY-RECOMMENDED

---

### features/admin/moderation/components/review-detail-dialog.tsx

#### UI-P004: Typography import detected (Line 17)

**Code:**
```tsx
import { P, Muted } from '@/components/ui/typography'
```

**Issue:** Importing custom Typography components that are never actually used in this file.

**Fix:**
1. Remove this import entirely - it's unused
2. Verify no other parts of the file reference these components
3. The file already uses proper semantic HTML with design tokens (lines 166, 175)

**Priority:** CRITICAL - Must fix (Dead code removal)

---

### features/admin/moderation/components/review-detail-helpers.tsx

#### UI-P004: Typography import detected (Line 3)

**Code:**
```tsx
import { P, Muted } from '@/components/ui/typography'
```

**Issue:** Importing custom Typography components that are never used in this file.

**Fix:**
Remove this import entirely. The file uses semantic HTML with proper design tokens throughout.

**Priority:** CRITICAL - Must fix (Dead code removal)

---

#### UI-P002: Incomplete Alert composition (Lines 80-87)

**Code:**
```tsx
<Alert variant={variant}>
  <AlertTitle>Notice</AlertTitle>
  <AlertDescription className="text-sm">{children}</AlertDescription>
</Alert>
```

**Issue:** While this Alert composition is technically complete, it has a hardcoded "Notice" title that doesn't provide semantic value. The Panel component should accept a dynamic title for the Alert.

**Fix:**
Refactor the Panel component to make better use of Alert's semantic structure:
```tsx
export function Panel({
  title,
  children,
  tone,
}: {
  title: string
  children: ReactNode
  tone?: 'destructive' | 'default'
}) {
  const variant = tone ?? 'default'

  return (
    <Alert variant={variant}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
```

Then update usage sites to remove the duplicate label:
```tsx
// Before
<div className="space-y-1">
  <p className="text-muted-foreground text-sm">Review</p>
  <Panel title="Review">...</Panel>
</div>

// After
<Panel title="Review">...</Panel>
```

**Priority:** HIGHLY-RECOMMENDED

---

#### UI-H102: Arbitrary text class (Line 21, 23)

**Code:**
```tsx
<p className="text-base text-sm font-medium">{title}</p>
{description && <p className="text-muted-foreground mt-1 block text-xs text-muted-foreground">{description}</p>}
```

**Issue:**
- Line 21: Using `text-base` alongside `text-sm` (conflicting classes)
- Line 23: Duplicate `text-muted-foreground` class and unnecessary `block` on `<p>` element

**Fix:**
```tsx
<p className="text-sm font-medium">{title}</p>
{description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
```

**Priority:** HIGHLY-RECOMMENDED

---

### features/admin/moderation/components/reviews-table.tsx

#### UI-H102: Arbitrary text class (Line 240, 303, 323, 324)

**Code:**
```tsx
{reasonError && <p className="text-base text-sm text-destructive">{reasonError}</p>}
```

**Issue:** Using `text-base` alongside `text-sm` (conflicting classes).

**Fix:**
```tsx
{reasonError && <p className="text-sm text-destructive">{reasonError}</p>}
```

**Additional violations:**
- Line 303: `<div className="absolute inset-0 flex items-center justify-center bg-background/70 text-xs font-medium text-muted-foreground">` - This is acceptable, using proper design tokens
- Line 323: `<p className="text-base truncate text-sm">` - Remove `text-base`
- Line 324: `<p className="text-base text-xs text-muted-foreground">` - Remove `text-base`

**Fix:**
```tsx
<p className="truncate text-sm">{review.comment || 'No text'}</p>
<p className="text-xs text-muted-foreground">{review.commentLength} chars</p>
```

**Priority:** HIGHLY-RECOMMENDED

---

## Summary Statistics

### Violations by Rule Code

| Rule Code | Priority | Count | Files Affected |
|-----------|----------|-------|----------------|
| UI-P004 | CRITICAL | 2 | 2 |
| UI-H102 | HIGHLY-RECOMMENDED | 3 | 4 |
| UI-P002 | CRITICAL | 2 | 1 |

### Violations by File

| File | Violations | Critical | High |
|------|------------|----------|------|
| moderation-client.tsx | 2 | 1 | 1 |
| moderation-stats.tsx | 1 | 0 | 1 |
| review-detail-dialog.tsx | 1 | 1 | 0 |
| review-detail-helpers.tsx | 3 | 2 | 1 |
| reviews-table.tsx | 1 | 0 | 1 |

---

## Actionable Next Steps

### Immediate Actions (Critical Issues)

1. **Remove Typography Imports (UI-P004)**
   - Delete all imports from `@/components/ui/typography`
   - Files: `moderation-client.tsx`, `review-detail-dialog.tsx`, `review-detail-helpers.tsx`
   - Impact: These are dead imports (unused) or can be replaced with proper shadcn compositions

2. **Fix Card Composition (UI-P004)**
   - Replace page header section in `moderation-client.tsx` (lines 76-81) with Card composition
   - Use CardHeader → CardTitle + CardDescription pattern
   - This provides better semantic structure and consistency

### High Priority Actions

3. **Remove Conflicting Text Classes (UI-H102)**
   - Remove all instances of duplicate `text-base` class
   - Files: `moderation-client.tsx`, `moderation-stats.tsx`, `review-detail-helpers.tsx`, `reviews-table.tsx`
   - Impact: Prevents CSS conflicts and improves maintainability

4. **Refactor Panel Component (UI-P002)**
   - Update `Panel` component in `review-detail-helpers.tsx` to use Alert title parameter
   - Remove redundant wrapper labels at call sites
   - Impact: Better semantic structure, less duplicate text

### Recommended Tools

Use shadcn MCP to explore available components before implementing fixes:
```typescript
// List all available components
mcp__shadcn__list-components

// Get Card documentation
mcp__shadcn__get-component-docs({ component: "card" })

// Get Alert documentation
mcp__shadcn__get-component-docs({ component: "alert" })

// Explore dashboard blocks
mcp__shadcn__list-blocks
```

---

## Architecture Notes

### Positive Patterns Found

1. Proper shadcn primitive usage for most components (Badge, Button, Card, Dialog, etc.)
2. Correct design token usage in most cases (`text-muted-foreground`, `bg-background`, etc.)
3. Good accessibility with `sr-only` labels and `aria-label` attributes
4. Proper table semantic structure with TableCaption
5. Clean Alert compositions in most places

### Areas for Improvement

1. Typography imports are legacy code that should be removed entirely
2. Some duplicate/conflicting Tailwind classes suggest copy-paste errors
3. Page header could use more structured Card composition for consistency
4. Panel helper component could be simplified to reduce wrapper elements

---

## File Status Summary

| File | Status | Action Required |
|------|--------|-----------------|
| index.tsx | CLEAN | No violations |
| moderation-client.tsx | NEEDS FIXING | Remove typography import, fix header composition, fix text classes |
| moderation-filters.tsx | CLEAN | No violations |
| moderation-stats.tsx | NEEDS FIXING | Fix conflicting text class |
| review-detail-dialog.tsx | NEEDS FIXING | Remove unused typography import |
| review-detail-helpers.tsx | NEEDS FIXING | Remove typography import, fix Panel composition, fix text classes |
| review-response-form.tsx | CLEAN | No violations |
| reviews-table.tsx | NEEDS FIXING | Fix conflicting text classes |
| reviews-table-dialog-config.ts | CLEAN | No violations |

---

**Report Complete**
For detailed rule specifications, see:
- `/Users/afshin/Desktop/Enorae/docs/rules/domains/ui.md`
- `/Users/afshin/Desktop/Enorae/docs/rules/domains/critical/UI-P004.md`
- `/Users/afshin/Desktop/Enorae/CLAUDE.md`
