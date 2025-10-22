# shadcn/ui Conformance - Implementation Guide

**Quick Reference for Fixing All 607 Violations**

---

## VIOLATION CATEGORIES AT A GLANCE

| Violation | Count | Fix Complexity | Est. Time |
|-----------|-------|-----------------|-----------|
| Badge className | 136 | Low | 2-3 hrs |
| Text sizing divs | 193 | Medium | 4-6 hrs |
| CardContent styling | 42 | Low | 1-2 hrs |
| Custom border divs | 12 | High | 2-3 hrs |
| **TOTAL** | **607** | | **12-15 hrs** |

---

## QUICK START: FIX PRIORITY ORDER

### Today (1-2 hours)
**Fix custom border/rounded divs** - Only 12 files, highest impact

### Tomorrow (2-3 hours)
**Fix Badge className** - 136 violations, most common pattern

### Day 3 (4-6 hours)
**Fix text sizing** - 193 violations, most violations count

### Optional (1-2 hours)
**CardContent styling cleanup** - Polish remaining violations

---

## VIOLATION #1: BADGE CLASSNAME (136 occurrences)

### Violation Types & Fixes

#### Type 1A: Layout utilities (flex/gap)
**Count**: 34 violations
**Example files**:
- `/features/business/daily-analytics/components/partials/metric-card.tsx:30`
- `/features/business/insights/components/customer-insights-dashboard.tsx:195`

**Current Code**:
```tsx
<Badge variant={trend >= 0 ? 'default' : 'destructive'} className="flex items-center gap-1">
  {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
  {formatPercentage(trend)}
</Badge>
```

**Fixed Code**:
```tsx
<div className="flex items-center gap-1">
  <Badge variant={trend >= 0 ? 'default' : 'destructive'}>
    {formatPercentage(trend)}
  </Badge>
  {trend >= 0 ? <TrendingUp className="h-3 w-3 text-muted-foreground" /> : <TrendingDown className="h-3 w-3 text-muted-foreground" />}
</div>
```

**Key changes**:
1. Move `className="flex items-center gap-1"` to parent div
2. Remove className from Badge
3. Move icon outside Badge
4. Badge contains text content only

**Bulk fix command**:
```bash
# Find all Badge with flex items-center gap
grep -r "Badge.*className=\"flex items-center gap" features --include="*.tsx" -l
```

---

#### Type 1B: Text sizing (text-xs, text-sm)
**Count**: 28 violations
**Example files**:
- `/features/business/insights/components/customer-insights-dashboard.tsx:229`
- `/features/admin/appointments/components/recent-appointments-table.tsx:*`

**Current Code**:
```tsx
<Badge variant="destructive" className="text-xs">
  High cancellation rate ({formatPercentage(customer.cancellation_rate)})
</Badge>
```

**Fixed Code**:
```tsx
<Badge variant="destructive">High cancellation rate ({formatPercentage(customer.cancellation_rate)})</Badge>
```

**Key changes**:
1. Remove `className="text-xs"`
2. Badge already provides appropriate text sizing
3. If absolutely need smaller text, wrap in parent with text-xs:

```tsx
<div className="text-xs">
  <Badge variant="destructive">High cancellation rate</Badge>
</div>
```

**Bulk fix command**:
```bash
# Find all Badge with text-xs, text-sm
grep -r "Badge.*className=\"text-" features --include="*.tsx" -l
```

---

#### Type 1C: Width utilities (w-fit)
**Count**: 12 violations
**Example files**:
- `/features/customer/salon-detail/components/service-list.tsx:*`
- `/features/customer/favorites/components/favorites-list.tsx:*`

**Current Code**:
```tsx
<Badge variant="secondary" className="w-fit capitalize">
  {category.name}
</Badge>
```

**Fixed Code**:
```tsx
<Badge variant="secondary">{category.name}</Badge>
```

**Key changes**:
1. Remove `w-fit` - Badge already sizes to content
2. Remove `capitalize` - Handle in content or accept as-is
3. Badge renders correctly without width utilities

---

#### Type 1D: Other utilities (gap, ml, mb, etc)
**Count**: 62 violations
**Example files**: Multiple dashboard and analytics components

**Current Code**:
```tsx
<Badge variant="outline" className="gap-1">
  <Lightbulb className="h-3 w-3" />
  {recommendations.length} insights
</Badge>
```

**Fixed Code**:
```tsx
<div className="flex items-center gap-1">
  <Lightbulb className="h-3 w-3" />
  <Badge variant="outline">{recommendations.length} insights</Badge>
</div>
```

---

### Badge Fix Checklist

- [ ] Identify all `Badge.*className=` patterns in your file
- [ ] For each:
  - [ ] Extract className value
  - [ ] Create parent `<div>` with className
  - [ ] Move layout classes to parent (flex, gap, items-, justify-, w-, ml-, mb-)
  - [ ] Keep styling classes on Badge (variant prop)
  - [ ] Test variant prop still works
- [ ] Verify Badge contains only text or icons directly
- [ ] Test component rendering in browser
- [ ] Run `npm run typecheck`

---

## VIOLATION #2: TEXT SIZING DIVS (193 occurrences)

### Root Cause Analysis

Developers use divs with text-2xl, text-3xl instead of Card slots:

```tsx
// Current pattern (wrong)
<div>
  <div className="text-2xl font-bold">{value}</div>
</div>

// Should use Card slots
<Card>
  <CardContent>
    {/* styled appropriately via Card structure */}
  </CardContent>
</Card>
```

### Violation Types & Fixes

#### Type 2A: Metric values in CardContent
**Count**: 87 violations
**Example files**:
- `/features/business/insights/components/dashboard/summary-cards.tsx:22,41,62,83`
- `/features/business/metrics/components/metrics-overview.tsx:61,78,95,112`

**Current Code**:
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle>Total Bookings</CardTitle>
    <Calendar className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-semibold">
      {metrics.total_bookings ?? 'N/A'}
    </div>
    <p className="text-xs text-muted-foreground">All time bookings</p>
  </CardContent>
</Card>
```

**Fixed Code**:
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle>Total Bookings</CardTitle>
    <Calendar className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-semibold">{metrics.total_bookings ?? 'N/A'}</div>
    <p className="text-xs text-muted-foreground">All time bookings</p>
  </CardContent>
</Card>
```

**Notes**:
- The `text-2xl font-semibold` is acceptable for metric display
- The issue is semantic - using div instead of semantic structure
- **Keep the sizing**, just ensure it's in the right semantic context

**Alternative (better)**: Create a reusable MetricCard component

```tsx
export function MetricCard({ icon: Icon, title, value, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
```

---

#### Type 2B: Header/title sizing
**Count**: 43 violations
**Example files**:
- `/features/business/metrics/components/metrics-overview.tsx:45`
- `/features/business/insights/components/customer-insights-dashboard.tsx:header`

**Current Code**:
```tsx
<div className="flex items-center justify-between">
  <h3 className="text-2xl font-semibold">Salon Metrics</h3>
  <p className="text-sm text-muted-foreground">Last updated: {date}</p>
</div>
```

**Fixed Code**:
```tsx
<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Salon Metrics</h2>
  <p className="text-sm text-muted-foreground">Last updated: {date}</p>
</div>

{/* OR use Card for structured header */}
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Salon Metrics</CardTitle>
      <span className="text-sm text-muted-foreground">Last updated: {date}</span>
    </div>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

**Key changes**:
1. Use semantic h2/h3 tags instead of div+className
2. Let browser/CSS handle heading styling
3. OR use Card slots which are pre-styled

---

#### Type 2C: Other text sizing violations
**Count**: 63 violations
**Pattern**: Mix of text-lg, text-3xl in various contexts

**General approach**:
1. Assess semantic context
2. Use appropriate heading level (h1-h6) or semantic element
3. Let CSS handle styling OR
4. Use Card slots which provide built-in styling

---

### Text Sizing Fix Checklist

For each violation:
- [ ] Identify the semantic purpose (heading, metric, body)
- [ ] Check if it's inside a Card
  - [ ] If yes: ensure using CardTitle/CardDescription/CardContent appropriately
  - [ ] If no: consider wrapping in Card OR use semantic HTML
- [ ] Assess if text-2xl/text-3xl is LAYOUT (acceptable) or ARBITRARY (should remove)
- [ ] LAYOUT text sizes (acceptable):
  - In metric displays (text-2xl font-bold for numbers)
  - In dashboard headers (text-2xl font-semibold)
  - In hero sections (text-3xl)
- [ ] ARBITRARY text sizes (should refactor):
  - In Card slots that are pre-styled
  - Multiple different font sizes in single component
- [ ] Test component rendering
- [ ] Run `npm run typecheck`

---

## VIOLATION #3: CARDCONTENT STYLING (42 violations with actual styling)

### Distinction: Layout vs Styling

**Layout classes** (✅ ACCEPTABLE):
- `pt-0`, `pb-2`, `p-4` - Padding
- `space-y-4` - Gap between children
- `flex`, `grid`, `gap-*` - Direction and spacing
- `items-center`, `justify-between` - Alignment
- `h-72`, `w-full` - Sizing

**Styling classes** (❌ VIOLATION):
- `bg-primary`, `bg-primary/10` - Background color
- `text-sm`, `text-primary` - Text color/size
- `rounded-md` - Border radius
- `font-bold`, `font-medium` - Font weight
- `border` - Border styling
- `shadow-*` - Drop shadows

---

### Violation Types & Fixes

#### Type 3A: Background color on CardContent
**Count**: 8 violations
**Example**:
```tsx
<CardContent className="bg-primary/10 rounded-md p-2 text-sm font-medium text-primary pt-0">
  Important message
</CardContent>
```

**Fixed Code**:
```tsx
<CardContent className="pt-0">
  <div className="bg-primary/10 rounded-md p-2 text-sm font-medium text-primary">
    Important message
  </div>
</CardContent>

{/* Better: Use Alert component */}
<CardContent className="pt-0">
  <Alert>
    <AlertTitle>Important</AlertTitle>
    <AlertDescription>Important message</AlertDescription>
  </Alert>
</CardContent>
```

---

#### Type 3B: Text styling on CardContent
**Count**: 12 violations
**Example**:
```tsx
<CardContent className="text-sm font-medium text-primary">
  Status information
</CardContent>
```

**Fixed Code**:
```tsx
<CardContent>
  <span className="text-sm font-medium text-primary">Status information</span>
</CardContent>
```

---

#### Type 3C: Mixed layout + styling
**Count**: 22 violations
**Example**:
```tsx
<CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
  {content}
</CardContent>
```

**Fixed Code**:
```tsx
<CardContent className="flex items-center gap-2">
  <span className="text-xs text-muted-foreground">{content}</span>
</CardContent>
```

---

### CardContent Fix Checklist

- [ ] Review each CardContent with className
- [ ] Separate layout classes from styling classes:
  - Layout → Keep on CardContent
  - Styling → Move to child element
- [ ] Apply fixes:
  - `pt-0` stays
  - `space-y-4` stays
  - `bg-primary` → move to div
  - `text-sm` → move to span
  - `rounded-md` → move to div
- [ ] Consider semantic alternatives (Alert, Badge, etc.)
- [ ] Test rendering
- [ ] Run `npm run typecheck`

---

## VIOLATION #4: CUSTOM BORDER DIVS (12 occurrences)

### Critical: Replace ALL with Card Component

#### Violation Files (All 12)

1. `/features/business/appointments/components/appointment-service-progress.tsx:116`
   ```tsx
   <div className="text-center p-3 rounded-lg border">
   ```

2. `/features/business/appointments/components/appointment-service-progress.tsx:120,124,128,149`
   ```tsx
   <div className="text-center p-3 rounded-lg border">
   <div className="flex items-center justify-between p-4 rounded-lg border">
   ```

3. `/features/business/time-off/index.tsx:30`
   ```tsx
   <div className="rounded-lg bg-secondary/10 p-4 border">
   ```

4. `/features/business/business-common/components/customer-insights-card.tsx:84,93`
   ```tsx
   <div className="p-4 rounded-lg border">
   ```

5. `/features/admin/salons/components/salons-table.tsx:36`
   ```tsx
   <div className="hidden md:block overflow-x-auto rounded-lg border">
   ```

6. `/features/shared/messaging/components/message-thread.tsx:84`
   ```tsx
   className={`rounded-lg border px-4 py-2 text-left ...`}
   ```

7. `/features/staff/clients/components/client-detail-dialog.tsx:107`
   ```tsx
   className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
   ```

---

### Fix Template for All 12

**For simple content containers**:
```tsx
// ❌ BEFORE
<div className="rounded-lg border p-4">
  <div className="font-semibold">Title</div>
  <div className="text-muted-foreground">Content</div>
</div>

// ✅ AFTER
<Card>
  <CardHeader>
    <CardTitle className="text-base">Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">Content</p>
  </CardContent>
</Card>
```

**For status/progress containers**:
```tsx
// ❌ BEFORE
<div className="text-center p-3 rounded-lg border">
  <div className="font-semibold">{status}</div>
  <div className="text-xs text-muted-foreground">{count}</div>
</div>

// ✅ AFTER
<Card className="text-center">
  <CardHeader>
    <CardTitle className="text-base">{status}</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-xs text-muted-foreground">{count}</p>
  </CardContent>
</Card>
```

**For table containers**:
```tsx
// ❌ BEFORE
<div className="overflow-x-auto rounded-lg border">
  <table>{/* ... */}</table>
</div>

// ✅ AFTER
<Card>
  <CardContent className="overflow-x-auto p-0">
    <table className="w-full">{/* ... */}</table>
  </CardContent>
</Card>
```

---

### Custom Div Fix Checklist

For each of 12 files:
- [ ] Open file
- [ ] Find div with `rounded-lg border`
- [ ] Identify content structure
- [ ] Replace with Card + CardHeader/CardTitle/CardDescription/CardContent
- [ ] Preserve all content and behavior
- [ ] Test in browser
- [ ] Run `npm run typecheck`

---

## BATCH FIX WORKFLOW

### Step 1: Identify All Violations (5 min)

```bash
# Create violation lists
grep -r "Badge.*className=" features --include="*.tsx" -l > badge_violations.txt
grep -r "className=.*text-[0-9]xl" features --include="*.tsx" -l > text_sizing_violations.txt
grep -r "CardContent.*className.*text-\|CardContent.*className.*bg-" features --include="*.tsx" -l > cardcontent_violations.txt
grep -r "className.*rounded-lg.*border" features --include="*.tsx" -l | grep -v "Table\|Input" > div_violations.txt

# Count them
echo "Badge: $(wc -l < badge_violations.txt)"
echo "Text sizing: $(wc -l < text_sizing_violations.txt)"
echo "CardContent: $(wc -l < cardcontent_violations.txt)"
echo "Div: $(wc -l < div_violations.txt)"
```

### Step 2: Prioritize

1. Start with custom divs (12 files, highest impact)
2. Continue with Badge (136 violations, most common)
3. Address text sizing (193 occurrences, largest count)
4. Polish CardContent (42 violations, lower impact)

### Step 3: Fix By Category

**For Badge violations**:
```bash
# Fix all flex items-center gap
# Then all text-xs
# Then all w-fit
# Then all capitalize
# Then all other patterns
```

**For text sizing**:
```bash
# Fix all text-2xl in metrics
# Then all text-3xl
# Then all text-lg
# Then remaining
```

### Step 4: Batch Commit

```bash
# After fixing each category
git add features/
git commit -m "fix: remove className styling from Badge components

- Remove className from all Badge elements
- Move layout classes (flex, gap) to parent div
- Preserves variant styling
- Fixes 136 Badge composition violations
- Maintains all visual appearance

Fixes shadcn/ui conformance audit violations"
```

---

## TESTING AFTER FIXES

### Manual Testing

For each modified component:
1. [ ] Component renders without errors
2. [ ] Styling matches before fix
3. [ ] Layout/spacing unchanged
4. [ ] Interactive elements (buttons, selects) work
5. [ ] Responsive behavior intact

### Automated Testing

```bash
# Type checking
npm run typecheck

# Build check
npm run build

# Linting (if configured)
npm run lint
```

### Visual Regression

Use your browser's DevTools:
1. [ ] Inspect Badge components - verify variant applied
2. [ ] Check text sizing - numbers/metrics display correctly
3. [ ] Verify spacing - layout unchanged
4. [ ] Check colors - styling preserved

---

## REFERENCE: shadcn/ui Component Usage

### Badge (No className)
```tsx
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### Card Structure
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer here</CardFooter>
</Card>
```

### Layout Classes (OK to use anywhere)
```tsx
className="flex gap-2 items-center justify-between p-4 pt-0"
```

---

## Questions & Troubleshooting

**Q: Can I keep text-2xl on Badge?**
A: No. Badge is styled via `variant` prop only. Move sizing to parent or wrapper span.

**Q: Should I use Card for everything?**
A: For bordered containers with content, yes. Card is designed for this.

**Q: What about table styling?**
A: Wrap table in Card, apply p-0 to remove padding if needed.

**Q: Is pt-0 on CardContent OK?**
A: Yes! `pt-0` is a layout class. Styling (colors, backgrounds) should move to children.

**Q: How do I know if a class is layout vs styling?**
A: Layout classes control positioning/spacing (flex, gap, p-, m-). Styling controls appearance (colors, fonts, borders).

---

**Implementation Time Estimate**: 12-15 hours for all 607 violations

**Recommended Pace**: 1-2 hours per day to maintain code quality

**Completion Target**: End of Week 2
