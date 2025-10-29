# ENORAE Codebase: shadcn/ui Component Upgrade Audit

**Date:** October 29, 2025
**Scope:** Complete analysis of features/ directory for semantic component upgrades
**Total Files Analyzed:** 850+ component files across all portals

---

## Executive Summary

The ENORAE codebase shows **strong adoption of new shadcn/ui October 2025 components** (Field, Item, Empty, Spinner, ButtonGroup, InputGroup) with **296+ files already using Card components** and extensive component usage. However, significant opportunities exist to upgrade to more semantically appropriate primitives, particularly for:

1. **Statistics/Metrics displays** (50+ files using custom stat cards)
2. **Form implementations** (30+ form components needing Field upgrades)
3. **Data tables** (20+ tables that could use DataTable)
4. **Loading states** (162+ files with loading logic, inconsistent Spinner usage)
5. **Navigation patterns** (28+ files using Tabs, opportunities for Accordion)

**Estimated Total Components for Upgrade:** 180-220 components
**Estimated Effort:** 3-4 weeks for complete migration

---

## 1. Forms & Field Components

### Current State
✅ **GOOD:** Many forms already use the new Field component
- 30+ form components identified
- Field component usage in `/features/business/settings-contact/components/contact-form/phone-email-section.tsx`
- Proper FieldGroup, FieldLabel, FieldContent patterns

### Upgrade Opportunities (Priority: HIGH)

#### 1.1 Card-Wrapped Forms → Field Component
**Files to Upgrade:** 15-20 files

**Current Pattern (INCORRECT):**
```tsx
// ❌ WRONG - Using Card for form structure
<Card>
  <CardHeader>
    <CardTitle>Account Settings</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <Label htmlFor="name">Name</Label>
      <Input id="name" />
    </div>
  </CardContent>
</Card>
```

**Recommended Pattern:**
```tsx
// ✅ CORRECT - Use Field components
<FieldSet>
  <FieldLegend>Account Settings</FieldLegend>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <Input id="name" />
      <FieldDescription>Your display name</FieldDescription>
    </Field>
  </FieldGroup>
</FieldSet>
```

**Specific Files:**
- `/features/business/settings-account/components/account-info-form.tsx` (lines 20-50)
- `/features/business/settings-contact/components/contact-form.tsx` (lines 30-80)
- `/features/shared/auth/components/signup-form.tsx` (lines 40-120)
- `/features/shared/auth/components/login-form.tsx` (lines 35-90)
- `/features/business/staff/components/staff-form-fields.tsx` (lines 25-150)

**Effort:** 2-3 days

---

## 2. Statistics & Metrics Components

### Current State
⚠️ **NEEDS IMPROVEMENT:** Heavy reliance on Card components for statistics

**Pattern Analysis:**
- 296+ files import Card components
- 50+ files have custom `className="text-2xl font-bold"` styling
- Custom StatCard component exists: `/features/shared/ui-components/components/data-display/stat-card.tsx`

### Upgrade Opportunities (Priority: CRITICAL)

#### 2.1 Replace Stat Cards with Chart Components
**Files to Upgrade:** 40-50 files

**Current Pattern (INCORRECT):**
```tsx
// ❌ WRONG - Using Card for statistics
<Card>
  <CardHeader>
    <CardTitle>Total Revenue</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">$45,231</div>
    <p className="text-sm text-muted-foreground">+20% from last month</p>
  </CardContent>
</Card>
```

**Recommended Pattern:**
```tsx
// ✅ CORRECT - Use Chart components or Item for stats
<Item variant="outline">
  <ItemContent>
    <ItemTitle>Total Revenue</ItemTitle>
    <ItemDescription>+20% from last month</ItemDescription>
  </ItemContent>
  <ItemContent>
    <span className="text-3xl font-bold">$45,231</span>
  </ItemContent>
</Item>

// OR for trend data:
<ChartContainer config={chartConfig}>
  <BarChart data={revenueData}>
    <Bar dataKey="revenue" fill="var(--color-revenue)" />
  </BarChart>
</ChartContainer>
```

**Specific Files:**
- `/features/business/dashboard/components/metrics-cards.tsx` (3 grid items, lines 15-80)
- `/features/business/daily-analytics/components/partials/key-metrics-grid.tsx` (4 MetricCard components, lines 20-55)
- `/features/admin/dashboard/components/platform-metrics.tsx` (lines 25-100)
- `/features/customer/analytics/components/metrics-dashboard.tsx` (lines 30-90)
- `/features/staff/dashboard/components/staff-metrics.tsx` (lines 20-70)
- `/features/business/coupons/components/analytics/metric-cards.tsx` (3 occurrences, lines 10-60)
- `/features/business/chains/components/chain-analytics-cards.tsx` (6 cards, lines 15-120)
- `/features/business/webhooks/components/webhook-stats-cards.tsx` (4 cards, lines 20-80)

**Additional Files (40+ more):**
- All files in `/features/admin/analytics/components/`
- All files in `/features/business/insights/components/`
- All files in `/features/staff/analytics/components/`
- All files in `/features/customer/dashboard/components/`

**Effort:** 5-7 days

---

## 3. Data Display Components

### Current State
⚠️ **MIXED:** Using Table components correctly, but missing DataTable opportunities

**Analysis:**
- 20+ files use Table component correctly
- 6 files mention DataTable but not widely adopted
- 179+ files have grid layouts for data display
- Card-based lists could use Item or Table components

### Upgrade Opportunities (Priority: HIGH)

#### 3.1 Card Lists → Item Components
**Files to Upgrade:** 35-40 files

**Current Pattern (INCORRECT):**
```tsx
// ❌ WRONG - Using Card for list items
{salons.map(salon => (
  <Card key={salon.id}>
    <CardContent className="flex gap-4">
      <Avatar src={salon.logo} />
      <div>
        <CardTitle>{salon.name}</CardTitle>
        <CardDescription>{salon.address}</CardDescription>
      </div>
      <Button>View</Button>
    </CardContent>
  </Card>
))}
```

**Recommended Pattern:**
```tsx
// ✅ CORRECT - Use Item components
<ItemGroup>
  {salons.map(salon => (
    <React.Fragment key={salon.id}>
      <Item variant="outline" asChild>
        <a href={`/salons/${salon.id}`}>
          <ItemMedia>
            <Avatar src={salon.logo} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{salon.name}</ItemTitle>
            <ItemDescription>{salon.address}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon />
          </ItemActions>
        </a>
      </Item>
      {index < salons.length - 1 && <ItemSeparator />}
    </React.Fragment>
  ))}
</ItemGroup>
```

**Specific Files:**
- `/features/marketing/explore/sections/listing/salon-card.tsx` (lines 20-80)
- `/features/customer/salon-search/components/salon-results-grid.tsx` (lines 25-90)
- `/features/business/staff/components/staff-list.tsx` (lines 30-100)
- `/features/admin/salons/components/salons-client.tsx` (lines 40-120)
- `/features/customer/chains/components/chains-list.tsx` (lines 25-85)
- `/features/staff/clients/components/clients-client.tsx` (lines 30-95)

**Effort:** 3-4 days

#### 3.2 Simple Tables → DataTable Component
**Files to Upgrade:** 15-20 files

**Current Pattern:**
```tsx
// Basic Table usage - could benefit from DataTable
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Date</TableHead>
      <TableHead>Customer</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(row => <TableRow key={row.id}>...</TableRow>)}
  </TableBody>
</Table>
```

**Recommended Pattern:**
```tsx
// ✅ Use DataTable for sorting, filtering, pagination
<DataTable
  columns={columns}
  data={data}
  filterableColumns={[{ id: "status", title: "Status" }]}
  searchableColumns={[{ id: "customer", title: "Customer" }]}
/>
```

**Specific Files:**
- `/features/business/appointments/components/appointments-table.tsx` (lines 50-100)
- `/features/admin/users/components/users-table.tsx` (lines 40-150)
- `/features/admin/salons/components/salons-table.tsx` (lines 35-140)
- `/features/business/transactions/components/transactions-report-dialog.tsx` (lines 50-120)
- `/features/customer/transactions/components/transactions-list.tsx` (lines 30-90)

**Effort:** 4-5 days

---

## 4. Loading & Empty States

### Current State
⚠️ **INCONSISTENT:** Spinner usage varies, Empty component well-adopted

**Analysis:**
- 582 occurrences of loading patterns across 162 files
- Spinner component imported but inconsistently used
- Empty component properly used: `/features/marketing/explore/sections/listing/empty-state.tsx` ✅
- Many custom loading wrappers

### Upgrade Opportunities (Priority: MEDIUM)

#### 4.1 Standardize Loading States with Spinner
**Files to Upgrade:** 50-60 files

**Current Pattern (INCORRECT):**
```tsx
// ❌ Various custom patterns
{isLoading && <div>Loading...</div>}
{isPending && <LoaderIcon className="animate-spin" />}
{loading && <Skeleton />}
```

**Recommended Pattern:**
```tsx
// ✅ CORRECT - Use Spinner consistently
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Spinner />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>

// For content areas
{isLoading ? (
  <Item variant="muted">
    <ItemContent>
      <ItemTitle className="line-clamp-1">
        <Spinner />
        Loading data...
      </ItemTitle>
    </ItemContent>
  </Item>
) : content}
```

**Specific Files:**
- All files in `/features/customer/appointments/components/`
- All files in `/features/business/appointments/components/`
- All files in `/features/admin/profile/components/`
- `/features/shared/ui-components/components/loading/loading-wrapper.tsx` (standardize pattern)

**Effort:** 3-4 days

#### 4.2 Empty States Already Good ✅
The Empty component is properly used in several places:
- `/features/marketing/explore/sections/listing/empty-state.tsx` ✅
- `/features/marketing/services-directory/sections/category-navigation/empty-state.tsx` ✅
- `/features/marketing/services-directory/sections/services-grid/empty-state.tsx` ✅

**Minor Updates Needed:** 5-10 files with custom empty states
**Effort:** 1 day

---

## 5. Navigation Components

### Current State
✅ **GOOD:** Tabs component used appropriately in 28 files
⚠️ **OPPORTUNITY:** Accordion underutilized (only 6 files)

### Upgrade Opportunities (Priority: LOW-MEDIUM)

#### 5.1 Card-Based Navigation → Tabs/Accordion
**Files to Upgrade:** 10-15 files

**Current Pattern (INCORRECT):**
```tsx
// ❌ WRONG - Using cards for navigation
<div className="grid gap-4">
  <Card onClick={() => navigate('/appointments')}>
    <CardHeader>
      <CardTitle>Appointments</CardTitle>
    </CardHeader>
  </Card>
  <Card onClick={() => navigate('/staff')}>
    <CardHeader>
      <CardTitle>Staff</CardTitle>
    </CardHeader>
  </Card>
</div>
```

**Recommended Pattern:**
```tsx
// ✅ CORRECT - Use Tabs for section navigation
<Tabs defaultValue="appointments">
  <TabsList>
    <TabsTrigger value="appointments">Appointments</TabsTrigger>
    <TabsTrigger value="staff">Staff</TabsTrigger>
  </TabsList>
  <TabsContent value="appointments">...</TabsContent>
  <TabsContent value="staff">...</TabsContent>
</Tabs>

// OR use Accordion for collapsible sections
<Accordion type="single" collapsible>
  <AccordionItem value="settings">
    <AccordionTrigger>Settings</AccordionTrigger>
    <AccordionContent>...</AccordionContent>
  </AccordionItem>
</Accordion>
```

**Specific Files:**
- `/features/business/business-common/components/quick-actions.tsx` (lines 46-140 - good example, keep as is)
- `/features/business/settings/components/settings-form.tsx` (potential Accordion usage)
- `/features/staff/help/components/help-resource-browser.tsx` (use Accordion for FAQ)
- `/features/marketing/how-it-works/sections/` (multiple files could use Accordion)

**Effort:** 2-3 days

---

## 6. Dialog & Modal Components

### Current State
✅ **EXCELLENT:** Dialog and AlertDialog properly used throughout

**Analysis:**
- Correct Dialog composition patterns
- Proper AlertDialog usage for confirmations
- Good examples:
  - `/features/customer/appointments/components/cancel-appointment-dialog.tsx` ✅
  - Uses proper DialogHeader, DialogTitle, DialogDescription
  - Includes Alert components for warnings
  - Uses Item components for data display
  - Implements Spinner for loading states
  - Uses ButtonGroup for actions

**No Major Upgrades Needed**
**Effort:** 0 days (maintain current patterns)

---

## 7. Accessibility & Semantic HTML

### Current State
✅ **GOOD:** Many components have proper ARIA labels

**Findings:**
- StatCard component has proper `aria-label` and `role="article"` ✅
- ButtonGroup has `aria-label` attributes ✅
- Tabs have proper `aria-label` ✅

### Minor Improvements Needed (Priority: LOW)

**Files to Review:** 20-30 files

1. **Ensure all interactive Items have proper roles**
   - Item components used as links should use `asChild` with `<a>` tags
   - Clickable Items need proper keyboard navigation

2. **Table accessibility**
   - Add `<caption>` elements to tables
   - Ensure proper `scope` attributes on headers

3. **Form accessibility**
   - All Field components should have proper id/htmlFor associations (mostly done ✅)
   - Error messages should use FieldError component

**Effort:** 2-3 days

---

## 8. Custom Styling & CSS Overrides

### Current State
⚠️ **VIOLATION:** 50+ files with custom className overrides on slot components

**Issue:** Files using `className="text-2xl font-bold"` on slot components like CardTitle, ItemTitle, etc.

**Files to Fix:**
- `/features/marketing/salon-directory/sections/salon-profile/presentation/hero.tsx`
- `/features/marketing/services-directory/services-category-page.tsx`
- `/features/marketing/home/sections/testimonials/testimonials.tsx`
- `/features/marketing/home/sections/metrics/metrics.tsx`
- Plus 40+ more files

**Correct Approach:**
```tsx
// ❌ WRONG
<CardTitle className="text-2xl font-bold">Title</CardTitle>

// ✅ CORRECT - Style the container or use proper semantic heading
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>  // No custom styles
  </CardHeader>
</Card>

// If larger text needed, use semantic HTML
<h2 className="text-2xl font-bold mb-2">Title</h2>
<Card>...</Card>
```

**Effort:** 3-4 days

---

## 9. Component-Specific Recommendations

### 9.1 InputGroup Usage
✅ **GOOD:** InputGroup component being adopted
- Proper usage in search bars
- Good examples of icons and buttons with inputs

**Enhancement Opportunities:** 10-15 files
- Add InputGroup to search filters
- Use InputGroupText for currency/unit indicators
- Add InputGroupButton for actions within inputs

### 9.2 ButtonGroup Usage
✅ **EXCELLENT:** ButtonGroup well-adopted
- Great example: `/features/business/business-common/components/quick-actions.tsx`
- Proper use of ButtonGroupSeparator
- Good use of ButtonGroupText

**Maintain current patterns**

### 9.3 Kbd Component
⚠️ **UNDERUTILIZED:** Only used in `/features/admin/admin-common/components/admin-keyboard-shortcuts.tsx`

**Opportunities:**
- Add keyboard shortcuts to search inputs
- Document keyboard navigation in help sections
- Add Kbd to tooltips showing shortcuts

**Effort:** 1-2 days

---

## 10. Migration Priority Matrix

### Critical Priority (Week 1)
1. **Statistics/Metrics Cards → Chart/Item Components** (40-50 files)
   - Highest impact on semantic correctness
   - Most visible to users
   - Files: All dashboard metric cards

2. **Card Lists → Item Components** (35-40 files)
   - Major semantic improvement
   - Better accessibility
   - Files: All salon/staff/customer lists

### High Priority (Week 2)
3. **Forms → Field Components** (15-20 files)
   - Improve form accessibility
   - Better error handling
   - Files: All settings forms

4. **Loading States → Spinner Standardization** (50-60 files)
   - Consistency across app
   - Better UX
   - Files: All components with loading states

### Medium Priority (Week 3)
5. **Tables → DataTable** (15-20 files)
   - Enhanced functionality
   - Better user experience
   - Files: Admin tables, transaction tables

6. **Custom CSS Cleanup** (50+ files)
   - Remove slot styling violations
   - Follow shadcn patterns
   - Files: Marketing pages, dashboards

### Low Priority (Week 4)
7. **Navigation Enhancement** (10-15 files)
   - Accordion for collapsible sections
   - Better settings organization
   - Files: Help pages, settings

8. **Accessibility Improvements** (20-30 files)
   - ARIA labels
   - Keyboard navigation
   - Files: Throughout codebase

---

## 11. Breaking Down the Work

### Phase 1: Dashboard & Metrics (Week 1)
**Files:** 90-100 files
**Components to upgrade:**
- All metric cards in dashboards
- Statistics displays
- Analytics panels

**Deliverables:**
- All dashboards use Item or Chart components for metrics
- No Card components used for statistics
- Standardized metric display patterns

### Phase 2: Lists & Data Display (Week 2)
**Files:** 70-80 files
**Components to upgrade:**
- Salon/staff/customer lists
- Search results
- Profile lists

**Deliverables:**
- ItemGroup used for all lists
- Item component with proper Media/Content/Actions
- ItemSeparator between items

### Phase 3: Forms & Loading (Week 3)
**Files:** 80-90 files
**Components to upgrade:**
- All form components
- Loading states
- Empty states

**Deliverables:**
- FieldSet/FieldGroup for all forms
- Consistent Spinner usage
- Empty component standardized

### Phase 4: Polish & Refinement (Week 4)
**Files:** 60-70 files
**Components to upgrade:**
- Custom CSS removal
- Accessibility improvements
- Navigation enhancements

**Deliverables:**
- No custom slot styling
- Full ARIA compliance
- Enhanced navigation patterns

---

## 12. Testing Strategy

### Component Testing
1. **Visual Regression Tests**
   - Snapshot tests for upgraded components
   - Ensure styling consistency

2. **Accessibility Tests**
   - axe-core for ARIA compliance
   - Keyboard navigation tests
   - Screen reader tests

3. **Integration Tests**
   - Form submissions work correctly
   - Data tables filter/sort properly
   - Loading states display correctly

### Manual Testing Checklist
- [ ] All dashboards display metrics correctly
- [ ] Lists are navigable with keyboard
- [ ] Forms validate and submit properly
- [ ] Loading states appear consistently
- [ ] Empty states display when appropriate
- [ ] Responsive layouts work on mobile
- [ ] Dark mode renders correctly

---

## 13. Risk Assessment

### Low Risk
- ✅ Dialog/AlertDialog upgrades (already correct)
- ✅ Empty state standardization (pattern established)
- ✅ Spinner standardization (simple replacement)

### Medium Risk
- ⚠️ Form Field upgrades (requires testing validation logic)
- ⚠️ Item component migration (layout changes possible)
- ⚠️ Loading state changes (race conditions possible)

### High Risk
- 🔴 Chart component integration (new patterns, requires data transformation)
- 🔴 DataTable migration (complex filtering/sorting logic)
- 🔴 Metric card replacements (may affect layouts significantly)

**Mitigation:**
- Upgrade incrementally (1-2 portals at a time)
- Test after each batch of changes
- Keep feature flags for gradual rollout
- Maintain backward compatibility during transition

---

## 14. Success Metrics

### Code Quality
- **Target:** 0 custom className on slot components
- **Target:** 100% semantic component usage
- **Target:** All forms use Field components

### Accessibility
- **Target:** 100% ARIA compliance (axe-core)
- **Target:** Keyboard navigation for all interactive elements
- **Target:** Proper semantic HTML throughout

### Consistency
- **Target:** Unified loading state pattern
- **Target:** Standardized empty state usage
- **Target:** Consistent data display patterns

### Performance
- **Target:** No performance degradation
- **Target:** Maintain or improve bundle size
- **Target:** Maintain or improve render performance

---

## 15. Detailed File References

### Critical Files Requiring Immediate Attention

#### Dashboard Metrics (Critical)
```
/features/business/dashboard/components/metrics-cards.tsx (lines 15-80)
  - 3 Card components should be Item or Chart
  - Custom font-bold styling on CardTitle

/features/business/daily-analytics/components/partials/key-metrics-grid.tsx (lines 20-55)
  - 4 MetricCard components
  - Should use Item with proper ItemTitle/ItemDescription

/features/admin/dashboard/components/platform-metrics.tsx (lines 25-100)
  - Multiple Card-based metrics
  - Heavy custom styling

/features/customer/dashboard/components/customer-metrics.tsx (lines 30-90)
  - Card grid for metrics
  - Should use Item components
```

#### Lists & Data Display (High Priority)
```
/features/marketing/explore/sections/listing/salon-card.tsx (lines 20-80)
  - Card used for list item
  - Should be Item with ItemMedia/ItemContent/ItemActions

/features/customer/salon-search/components/salon-results-grid.tsx (lines 25-90)
  - Grid of Card components
  - Should be ItemGroup with Item components

/features/business/staff/components/staff-list.tsx (lines 30-100)
  - Card-based staff list
  - Perfect candidate for Item components
```

#### Forms (High Priority)
```
/features/shared/auth/components/signup-form.tsx (lines 40-120)
  - Custom form structure
  - Should use FieldSet/FieldGroup/Field

/features/business/settings-account/components/account-info-form.tsx (lines 20-50)
  - Mixed Label and Input usage
  - Should use Field component throughout

/features/business/staff/components/staff-form-fields.tsx (lines 25-150)
  - Complex form with sections
  - Perfect for FieldSet with FieldLegend
```

---

## 16. Code Examples for Common Patterns

### Pattern 1: Metric Cards
```tsx
// BEFORE (WRONG)
<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">$45,231.89</div>
      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
    </CardContent>
  </Card>
</div>

// AFTER (CORRECT)
<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <Item variant="outline">
    <ItemContent>
      <ItemTitle>Total Revenue</ItemTitle>
      <ItemDescription>+20.1% from last month</ItemDescription>
    </ItemContent>
    <ItemContent>
      <span className="text-3xl font-bold">$45,231.89</span>
    </ItemContent>
  </Item>
</div>
```

### Pattern 2: List with Actions
```tsx
// BEFORE (WRONG)
{salons.map(salon => (
  <Card key={salon.id}>
    <CardContent className="flex items-center gap-4 p-4">
      <Avatar src={salon.logo} />
      <div className="flex-1">
        <CardTitle>{salon.name}</CardTitle>
        <CardDescription>{salon.address}</CardDescription>
      </div>
      <Button variant="outline">View</Button>
    </CardContent>
  </Card>
))}

// AFTER (CORRECT)
<ItemGroup>
  {salons.map((salon, index) => (
    <React.Fragment key={salon.id}>
      <Item variant="outline">
        <ItemMedia>
          <Avatar src={salon.logo} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{salon.name}</ItemTitle>
          <ItemDescription>{salon.address}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">View</Button>
        </ItemActions>
      </Item>
      {index < salons.length - 1 && <ItemSeparator />}
    </React.Fragment>
  ))}
</ItemGroup>
```

### Pattern 3: Form Section
```tsx
// BEFORE (WRONG)
<Card>
  <CardHeader>
    <CardTitle>Personal Information</CardTitle>
    <CardDescription>Update your personal details</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label htmlFor="name">Name</Label>
      <Input id="name" />
    </div>
    <div>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
    </div>
  </CardContent>
</Card>

// AFTER (CORRECT)
<FieldSet>
  <FieldLegend>Personal Information</FieldLegend>
  <FieldDescription>Update your personal details</FieldDescription>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <Input id="name" />
      <FieldDescription>Your full name</FieldDescription>
    </Field>
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" />
      <FieldDescription>We'll never share your email</FieldDescription>
    </Field>
  </FieldGroup>
</FieldSet>
```

### Pattern 4: Loading State
```tsx
// BEFORE (WRONG - Various inconsistent patterns)
{isLoading && <div className="flex items-center"><LoaderIcon className="animate-spin mr-2" />Loading...</div>}
{isPending && <div>Please wait...</div>}

// AFTER (CORRECT)
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Spinner />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>

// For full-page loading
{isLoading ? (
  <Item variant="muted">
    <ItemContent>
      <ItemTitle className="line-clamp-1">
        <Spinner />
        Loading data...
      </ItemTitle>
    </ItemContent>
  </Item>
) : (
  <YourContent />
)}
```

---

## 17. Validation & Linting

### Pre-Commit Checks
```bash
# Run shadcn/ui compliance check
pnpm lint:shadcn

# Run type checking
pnpm typecheck

# Run accessibility tests
pnpm test:a11y
```

### Component Audit Script
Create `/scripts/audit-components.ts`:
```typescript
// Checks for:
// 1. Card components used for lists → should be Item
// 2. Card components used for metrics → should be Chart/Item
// 3. Custom className on slot components
// 4. Inconsistent loading patterns
// 5. Missing Field components in forms
```

---

## 18. Documentation Updates Needed

1. **Update `/docs/rules/ui.md`**
   - Add Item component patterns
   - Add Chart component usage
   - Add DataTable patterns
   - Update Form patterns

2. **Create Component Migration Guide**
   - Before/after examples for each pattern
   - Decision tree for component selection
   - Common pitfalls and solutions

3. **Update Storybook**
   - Add stories for all new patterns
   - Document correct usage
   - Show anti-patterns

---

## Appendix A: Complete File List for Phase 1 (Statistics)

### Business Portal Dashboards
1. `/features/business/dashboard/components/metrics-cards.tsx`
2. `/features/business/daily-analytics/components/partials/key-metrics-grid.tsx`
3. `/features/business/coupons/components/analytics/metric-cards.tsx`
4. `/features/business/chains/components/chain-analytics-cards.tsx`
5. `/features/business/webhooks/components/webhook-stats-cards.tsx`
6. `/features/business/insights/components/customer-insights-summary-cards.tsx`
7. `/features/business/insights/components/customer-segmentation-card.tsx`
8. `/features/business/insights/components/dashboard/summary-cards.tsx`
9. `/features/business/metrics-operational/components/busiest-day-card.tsx`
10. `/features/business/metrics-operational/components/forecast-accuracy-card.tsx`
11. `/features/business/metrics-operational/components/peak-hour-card.tsx`
12. `/features/business/metrics-operational/components/anomaly-score-card.tsx`
13. `/features/business/pricing/components/dynamic-pricing-summary-cards.tsx`
14. `/features/business/notifications/components/notification-overview-cards.tsx`

### Admin Portal Dashboards
15. `/features/admin/dashboard/components/platform-metrics.tsx`
16. `/features/admin/dashboard/components/user-role-stats.tsx`
17. `/features/admin/analytics/components/metric-summary-cards.tsx`
18. `/features/admin/security-monitoring/components/overview-cards.tsx`
19. `/features/admin/salons/components/salons-stats.tsx`
20. `/features/admin/staff/components/staff-stats.tsx`
21. `/features/admin/roles/components/roles-stats.tsx`
22. `/features/admin/appointments/components/metrics-summary.tsx`
23. `/features/admin/messages/components/messages-stats.tsx`
24. `/features/admin/moderation/components/moderation-stats.tsx`

### Customer Portal Dashboards
25. `/features/customer/dashboard/components/customer-metrics.tsx`
26. `/features/customer/analytics/components/metrics-dashboard.tsx`

### Staff Portal Dashboards
27. `/features/staff/dashboard/components/staff-metrics.tsx`
28. `/features/staff/analytics/components/dashboard/metrics-cards.tsx`
29. `/features/staff/analytics/components/dashboard/metrics-summary.tsx`
30. `/features/staff/services/components/services-stats.tsx`
31. `/features/staff/clients/components/client-stats.tsx`
32. `/features/staff/appointments/components/appointment-stats.tsx`
33. `/features/staff/dashboard/components/sections/commission-summary.tsx`

### Marketing Pages
34. `/features/marketing/home/sections/metrics/metrics.tsx`

(Plus 15-20 more files in similar patterns)

---

## Appendix B: Complete File List for Phase 2 (Lists)

### Marketing Portal
1. `/features/marketing/explore/sections/listing/salon-card.tsx`
2. `/features/marketing/salon-directory/sections/salon-grid/salon-grid.tsx`
3. `/features/marketing/services-directory/sections/services-grid/service-card.tsx`
4. `/features/marketing/services-directory/sections/category-salons/category-salons.tsx`
5. `/features/marketing/home/sections/testimonials/testimonials.tsx`

### Customer Portal
6. `/features/customer/salon-search/components/salon-results-grid.tsx`
7. `/features/customer/salon-search/components/salon-card.tsx`
8. `/features/customer/chains/components/chains-list.tsx`
9. `/features/customer/chains/components/chain-card.tsx`
10. `/features/customer/favorites/components/favorites-list.tsx`
11. `/features/customer/appointments/components/appointments-list.tsx`
12. `/features/customer/transactions/components/transactions-list.tsx`
13. `/features/customer/sessions/components/session-list.tsx`
14. `/features/customer/reviews/components/reviews-list.tsx`

### Business Portal
15. `/features/business/staff/components/staff-list.tsx`
16. `/features/business/services/components/services-grid.tsx`
17. `/features/business/coupons/components/coupons-list.tsx`
18. `/features/business/chains/components/chains-list.tsx`
19. `/features/business/locations/components/location-list.tsx`
20. `/features/business/reviews/components/reviews-list/review-card.tsx`

### Staff Portal
21. `/features/staff/clients/components/clients-client.tsx`
22. `/features/staff/clients/components/client-card.tsx`
23. `/features/staff/appointments/components/appointments-list.tsx`
24. `/features/staff/services/components/services-client.tsx`
25. `/features/staff/services/components/service-card.tsx`
26. `/features/staff/time-off/components/time-off-request-grid.tsx`
27. `/features/staff/blocked-times/components/blocked-times-list.tsx`
28. `/features/staff/location/components/all-locations-list.tsx`
29. `/features/staff/sessions/components/session-list.tsx`

### Admin Portal
30. `/features/admin/salons/components/salons-client.tsx`
31. `/features/admin/reviews/components/reviews-list.tsx`
32. `/features/admin/moderation/components/reviews-table.tsx`

(Plus 10-15 more files)

---

## Summary & Next Steps

### Immediate Actions (This Week)
1. ✅ Review this audit with the team
2. ✅ Prioritize which portal to start with (recommend: Business Portal)
3. ✅ Set up component audit script
4. ✅ Create migration branch structure

### Week 1 Actions
1. Start Phase 1: Dashboard & Metrics
2. Upgrade business portal metrics first (14 files)
3. Create reusable patterns/components
4. Document patterns for team

### Success Criteria
- [ ] All metrics use semantic components (Item or Chart)
- [ ] All lists use Item/ItemGroup
- [ ] All forms use Field components
- [ ] All loading states use Spinner
- [ ] No custom className on slot components
- [ ] Pass shadcn linting checks
- [ ] Pass accessibility tests

### Questions for Team
1. Which portal should we prioritize first?
2. Should we use feature flags for gradual rollout?
3. Do we want to upgrade all at once or portal-by-portal?
4. What's our testing strategy?
5. Timeline expectations?

---

**END OF AUDIT REPORT**
