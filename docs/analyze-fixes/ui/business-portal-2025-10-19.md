# UI Analysis Report: Business Portal

**Generated**: 2025-10-19
**Scope**: `app/(business)/**/*.tsx`, `features/business/**/components/**/*.tsx`
**Analyzer**: Claude Code UI Analysis Agent

---

## Executive Summary

- **Total Violations**: 11
- **Priority (P)**: 7
- **Highly-Recommended (H)**: 4
- **Must-Consider (M)**: 0
- **Files Affected**: 7

**Critical Issues**:
- **UI-P004 (Typography Imports)**: 7 violations across 6 files
  - All violations use deprecated Typography components (H1, H2, H3, H4, Small, Code)
  - Must replace with shadcn component slots or semantic HTML with design tokens
- **UI-H102 (Duplicate text-* classes)**: 4 violations
  - Redundant text size/weight classes in className strings

---

## Violations by File

### 1. `/Users/afshin/Desktop/Enorae/features/business/settings-audit-logs/components/audit-logs-table.tsx`

#### UI-P004: Typography import detected (Line 26)

**Code:**
```tsx
import { Code } from '@/components/ui/typography'
```

**Issue**: Using custom Typography component instead of shadcn primitives

**Fix**:
1. Remove this import completely
2. For inline code display, use semantic HTML with design tokens:
   ```tsx
   <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">
     {formatDate(selectedLog.created_at)}
   </code>
   ```
3. Or explore shadcn blocks for complex code display patterns via MCP
4. Use shadcn MCP: `mcp__shadcn__get-component-docs` to explore available components

**Usage locations in file:**
- Line 211: `<Code>{formatDate(selectedLog.created_at)}</Code>`
- Line 223: `<Code>{selectedLog.entity_id || 'N/A'}</Code>`
- Line 227: `<Code>{selectedLog.user_id}</Code>`
- Line 231: `<Code>{selectedLog.ip_address || 'N/A'}</Code>`

---

### 2. `/Users/afshin/Desktop/Enorae/features/business/staff/components/staff-list.tsx`

#### UI-P004: Typography component usage without import (Line 56)

**Code:**
```tsx
<H4 className="text-base">{member.title || 'Staff Member'}</H4>
```

**Issue**: Using Typography component `H4` (likely from a missing import or global scope)

**Fix**:
1. Remove the `<H4>` component entirely
2. Restructure to use Card composition properly:
   ```tsx
   <Card>
     <CardHeader>
       <CardTitle>Staff Members</CardTitle>
     </CardHeader>
     <CardContent>
       <div className="flex flex-col gap-6">
         {staff.map((member) => (
           <div key={member.id || ''} className="flex items-start gap-6 pb-4 border-b last:border-0 last:pb-0">
             <Avatar>
               {member.avatar_url && <AvatarImage src={member.avatar_url} alt={member.title || 'Staff'} />}
               <AvatarFallback>
                 {member.title?.slice(0, 2).toUpperCase() || 'ST'}
               </AvatarFallback>
             </Avatar>
             <div className="flex flex-col gap-2 flex-1">
               <p className="text-base font-medium">{member.title || 'Staff Member'}</p>
               {member.bio && <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>}
             </div>
             <Badge variant="default">Active</Badge>
           </div>
         ))}
       </div>
     </CardContent>
   </Card>
   ```
3. Plain text with semantic classes replaces the Typography component

---

### 3. `/Users/afshin/Desktop/Enorae/features/business/dashboard/components/metrics-cards.tsx`

#### UI-H102: Duplicate text sizing classes (Line 79, 82)

**Code:**
```tsx
<p className="text-xs text-xs font-semibold uppercase tracking-wide text-muted-foreground">
  Dashboard summary
</p>
<p className="text-xs text-muted-foreground">Monitor the metrics your team watches daily.</p>
```

**Issue**: Line 79 has `text-xs` duplicated. Line 82 has redundant `text-base` (removed in snippet but present in full file)

**Fix**:
```tsx
<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
  Dashboard summary
</p>
<p className="text-sm text-muted-foreground">Monitor the metrics your team watches daily.</p>
```

---

### 4. `/Users/afshin/Desktop/Enorae/features/business/pricing/index.tsx`

#### UI-P004: Typography component usage without import (Line 75)

**Code:**
```tsx
<H2 className="mb-4 text-2xl font-semibold">Active Pricing Rules</H2>
```

**Issue**: Using Typography component `H2`

**Fix**:
1. Remove `<H2>` component
2. Use semantic HTML with design tokens:
   ```tsx
   <h2 className="text-2xl font-semibold mb-4">Active Pricing Rules</h2>
   ```
3. Or restructure into a Card with CardHeader if this is a section heading:
   ```tsx
   <Card>
     <CardHeader>
       <CardTitle className="text-2xl">Active Pricing Rules</CardTitle>
     </CardHeader>
     <CardContent>
       <PricingRulesList rules={normalizedRules} />
     </CardContent>
   </Card>
   ```

---

### 5. `/Users/afshin/Desktop/Enorae/features/business/business-common/components/revenue-card.tsx`

#### UI-P004: Typography components usage without imports (Lines 144, 170)

**Code:**
```tsx
<H3 className={compact ? 'text-2xl' : 'text-3xl font-bold'}>
  {formattedAmount}
</H3>
```

```tsx
<Small className={`text-xs ${growthRate >= 0 ? 'text-success' : 'text-destructive'}`}>
  {growthRate >= 0 ? 'Growth' : 'Decline'} vs. previous period
</Small>
```

**Issue**: Using Typography components `H3` and `Small`

**Fix**:
1. Remove Typography components entirely
2. Replace with semantic HTML and design tokens:
   ```tsx
   <div className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold`}>
     {formattedAmount}
   </div>

   {/* ... */}

   <p className={`text-xs ${growthRate >= 0 ? 'text-success' : 'text-destructive'}`}>
     {growthRate >= 0 ? 'Growth' : 'Decline'} vs. previous period
   </p>
   ```

---

### 6. `/Users/afshin/Desktop/Enorae/features/business/business-common/components/customer-insights-card.tsx`

#### UI-P004: Typography component usage without import (Lines 88, 97, 109)

**Code:**
```tsx
<H3 className="text-base">Avg Lifetime Value</H3>
```

```tsx
<H3 className="text-base">Avg Order Value</H3>
```

```tsx
<H3 className="mb-4">Top Customers</H3>
```

**Issue**: Using Typography component `H3` in three locations

**Fix**:
1. Remove all `<H3>` components
2. These are subsection labels within a Card - use plain text with appropriate classes:
   ```tsx
   <p className="text-base font-medium">Avg Lifetime Value</p>

   {/* ... */}

   <p className="text-base font-medium">Avg Order Value</p>

   {/* ... */}

   <p className="text-base font-semibold mb-4">Top Customers</p>
   ```
3. Or better yet, restructure using nested Cards for each metric section with CardTitle

---

### 7. `/Users/afshin/Desktop/Enorae/features/business/service-pricing/components/pricing-card.tsx`

#### UI-P004: Typography component usage without import (Line 63)

**Code:**
```tsx
<Small className={hasDiscount ? 'line-through' : ''}>
  {formatCurrency(pricing.base_price)}
</Small>
```

**Issue**: Using Typography component `Small`

**Fix**:
1. Remove `<Small>` component
2. Replace with semantic HTML:
   ```tsx
   <p className={`text-sm ${hasDiscount ? 'line-through' : ''}`}>
     {formatCurrency(pricing.base_price)}
   </p>
   ```

---

### 8. `/Users/afshin/Desktop/Enorae/features/business/dashboard/components/dashboard-filters.tsx`

#### UI-P004: Typography component usage without import (Line 162)

**Code:**
```tsx
<Small id={serviceMixLabelId} className="font-medium text-muted-foreground">
  Service mix
</Small>
```

**Issue**: Using Typography component `Small`

**Fix**:
1. Remove `<Small>` component
2. This is a label element - use appropriate semantic HTML:
   ```tsx
   <Label id={serviceMixLabelId} className="text-sm font-medium text-muted-foreground">
     Service mix
   </Label>
   ```
   Or simply:
   ```tsx
   <p className="text-sm font-medium text-muted-foreground" id={serviceMixLabelId}>
     Service mix
   </p>
   ```

#### UI-H102: Duplicate text sizing class (Line 204)

**Code:**
```tsx
<p className="text-xs text-xs text-muted-foreground">
  Alerts when booking load exceeds 75% capacity.
</p>
```

**Issue**: `text-xs` is duplicated in the className string

**Fix**:
```tsx
<p className="text-xs text-muted-foreground">
  Alerts when booking load exceeds 75% capacity.
</p>
```

---

### 9. `/Users/afshin/Desktop/Enorae/features/business/metrics-operational/components/operational-dashboard.tsx`

#### UI-P004: Typography component usage without import (Line 41)

**Code:**
```tsx
<H2 className="text-2xl font-bold tracking-tight">Operational Intelligence</H2>
```

**Issue**: Using Typography component `H2`

**Fix**:
1. Remove `<H2>` component
2. This is a page heading - restructure to use semantic HTML or wrap the entire dashboard in a Card:
   ```tsx
   <div className="flex flex-col gap-8">
     <Card>
       <CardHeader>
         <CardTitle className="text-2xl font-bold tracking-tight">Operational Intelligence</CardTitle>
         <CardDescription>Real-time operational insights and forecasting</CardDescription>
       </CardHeader>
     </Card>

     {/* Rest of content */}
   </div>
   ```
   Or if this should remain as a page-level heading:
   ```tsx
   <h1 className="text-2xl font-bold tracking-tight">Operational Intelligence</h1>
   <p className="text-sm text-muted-foreground">Real-time operational insights and forecasting</p>
   ```

#### UI-H102: Duplicate text-base class (Line 42)

**Code:**
```tsx
<p className="text-base text-sm text-muted-foreground">Real-time operational insights and forecasting</p>
```

**Issue**: Both `text-base` and `text-sm` are present - they conflict

**Fix**:
```tsx
<p className="text-sm text-muted-foreground">Real-time operational insights and forecasting</p>
```

---

## Summary Statistics

### Violations by Rule Code

| Rule Code | Count | Priority | Description |
|-----------|-------|----------|-------------|
| UI-P004 | 7 | P (Critical) | Typography component usage (H1, H2, H3, H4, Small, Code) |
| UI-H102 | 4 | H (High) | Duplicate/conflicting text utility classes |

### Violations by File

| File | Total Violations | Critical (P) | High (H) |
|------|-----------------|--------------|----------|
| `settings-audit-logs/components/audit-logs-table.tsx` | 1 | 1 | 0 |
| `staff/components/staff-list.tsx` | 1 | 1 | 0 |
| `dashboard/components/metrics-cards.tsx` | 1 | 0 | 1 |
| `pricing/index.tsx` | 1 | 1 | 0 |
| `business-common/components/revenue-card.tsx` | 1 | 1 | 0 |
| `business-common/components/customer-insights-card.tsx` | 1 | 1 | 0 |
| `service-pricing/components/pricing-card.tsx` | 1 | 1 | 0 |
| `dashboard/components/dashboard-filters.tsx` | 2 | 1 | 1 |
| `metrics-operational/components/operational-dashboard.tsx` | 2 | 1 | 1 |

---

## Recommendations

### Immediate Actions (Critical Priority)

1. **Eliminate ALL Typography component usage** across the 6 files identified
   - Files use `H1`, `H2`, `H3`, `H4`, `Small`, and `Code` without proper imports
   - These components are from the deprecated `@/components/ui/typography` module
   - Replace with shadcn component slots (CardTitle, CardDescription, Badge, etc.) or semantic HTML with design tokens

2. **Restructure components to use shadcn compositions**
   - Many violations occur because developers are manually creating headings/labels instead of using Card compositions
   - Example: Replace standalone `<H2>` + description with `<Card><CardHeader><CardTitle>` + `<CardDescription>`
   - Use shadcn MCP to explore available components before writing custom markup

3. **Fix duplicate className strings**
   - 4 instances of redundant text sizing classes (`text-xs text-xs`, `text-base text-sm`)
   - Clean these up to prevent styling conflicts

### Medium-Term Improvements

1. **Audit other business portal files**
   - This analysis covered component files but not all page files
   - Run automated detection: `docs/rules/_automation/detect-ui-violations.sh`

2. **Establish pre-commit hooks**
   - Prevent future Typography imports from being committed
   - Add ESLint rule to detect `@/components/ui/typography` imports

3. **Create reference examples**
   - Document approved patterns for common use cases (headings, labels, inline code, etc.)
   - Add to `docs/rules/reference/examples.md`

---

## Next Steps

### For Developers

1. **Use shadcn MCP to explore components**
   - Before creating custom markup, check: `mcp__shadcn__list-components`
   - Get component docs: `mcp__shadcn__get-component-docs({ component: "card" })`
   - Explore blocks for complex patterns: `mcp__shadcn__list-blocks`

2. **Follow shadcn composition patterns**
   - Cards: Always use CardHeader → CardTitle + CardDescription → CardContent → CardFooter
   - Alerts: Use AlertTitle + AlertDescription within Alert
   - Dialogs: Use DialogHeader → DialogTitle + DialogDescription

3. **Use semantic HTML with design tokens as fallback**
   - Only when NO shadcn primitive matches your use case
   - Approved tokens: `text-foreground`, `text-muted-foreground`, `bg-muted`, `bg-background`, `border-border`
   - Never use arbitrary Tailwind colors like `text-gray-600` or `bg-blue-500`

### For Reviewers

1. **Check for Typography imports in PRs**
   - Any import from `@/components/ui/typography` should be rejected
   - Any usage of `H1`, `H2`, `H3`, `H4`, `P`, `Lead`, `Muted`, `Small`, `Large`, `Code` components should be flagged

2. **Verify shadcn composition completeness**
   - Cards should have CardHeader with CardTitle (and optionally CardDescription)
   - Dialogs should have DialogHeader with DialogTitle + DialogDescription
   - Alerts should have AlertTitle + AlertDescription

---

## Additional Context

### Design Token Reference

**Approved text colors** (from `app/globals.css`):
- `text-foreground` - Primary text
- `text-muted-foreground` - Secondary/muted text
- `text-primary` - Primary brand color text
- `text-primary-foreground` - Text on primary background
- `text-destructive` - Error/destructive text
- `text-destructive-foreground` - Text on destructive background
- `text-success` - Success state text
- `text-warning` - Warning state text
- `text-info` - Info state text

**Approved background colors**:
- `bg-background` - Main background
- `bg-muted` - Muted/secondary background
- `bg-primary` - Primary brand background
- `bg-destructive` - Destructive action background
- `bg-card` - Card background

**Approved border colors**:
- `border-border` - Default border
- `border-input` - Input border

### shadcn Component Slots for Typography

Instead of custom Typography components, use these shadcn slots:

| Use Case | shadcn Slot | Example |
|----------|-------------|---------|
| Card heading | `CardTitle` | `<CardTitle>Revenue</CardTitle>` |
| Card subheading | `CardDescription` | `<CardDescription>Last 30 days</CardDescription>` |
| Dialog heading | `DialogTitle` | `<DialogTitle>Confirm action</DialogTitle>` |
| Dialog description | `DialogDescription` | `<DialogDescription>This cannot be undone</DialogDescription>` |
| Alert heading | `AlertTitle` | `<AlertTitle>Heads up!</AlertTitle>` |
| Alert message | `AlertDescription` | `<AlertDescription>Your session expires soon</AlertDescription>` |
| Accordion trigger | `AccordionTrigger` | `<AccordionTrigger>Show details</AccordionTrigger>` |
| Tab label | `TabsTrigger` | `<TabsTrigger value="overview">Overview</TabsTrigger>` |
| Badge text | `Badge` | `<Badge>Active</Badge>` |
| Inline emphasis | Semantic HTML | `<strong className="font-semibold">Important</strong>` |
| Inline code | Semantic HTML | `<code className="text-xs font-mono bg-muted px-1 rounded">code</code>` |
| Small text | Semantic HTML | `<p className="text-sm text-muted-foreground">Helper text</p>` |

---

**Report generated by**: Claude Code UI Analysis Agent
**For questions**: Refer to `docs/rules/domains/ui.md`
**Automation**: Run `docs/rules/_automation/detect-ui-violations.sh` for continuous monitoring
