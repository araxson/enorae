# File Placement Remediation Guide

This guide provides exact steps to fix all 97 architecture violations identified in the audit.

---

## CRITICAL FIX: Server-Only Directive

### Fix 1: admin/reviews/api/queries/index.ts

**File:** `/Users/afshin/Desktop/Enorae/features/admin/reviews/api/queries/index.ts`

**Current Content:**
```typescript
export { getReviewsStats } from './data'
export { getReviewsListFiltered } from './filters'
export { getReviewDetail, getReviewContext } from './details'
```

**Issue:** Missing `import 'server-only'` directive at top of file

**Fix:**
```typescript
import 'server-only'

export { getReviewsStats } from './data'
export { getReviewsListFiltered } from './filters'
export { getReviewDetail, getReviewContext } from './details'
```

**Bash Command:**
```bash
# Navigate to file
cd /Users/afshin/Desktop/Enorae

# Add directive (using sed - takes first line)
sed -i '' '1s/^/import '\''server-only'\''\n\n/' features/admin/reviews/api/queries/index.ts
```

**Verification:**
```bash
head -3 features/admin/reviews/api/queries/index.ts
# Should show:
# import 'server-only'
#
# export { getReviewsStats }
```

---

## HIGH PRIORITY: Component Index Exports

### Fix 2: business/daily-analytics/components/index.ts

**File:** `/Users/afshin/Desktop/Enorae/features/business/daily-analytics/components/index.ts`

**Current Content:**
```typescript
export { DailyAnalyticsPage } from './daily-analytics-page'
export { DailyMetricsDashboard } from './daily-metrics-dashboard'
```

**Missing Components:**
- `types.ts` → TypeScript type definitions

**Fix:**
```typescript
export { DailyAnalyticsPage } from './daily-analytics-page'
export { DailyMetricsDashboard } from './daily-metrics-dashboard'
export type { DailyAnalyticsProps } from './types'
```

**Implementation:**
```bash
# Append type export
echo "export type { DailyAnalyticsProps } from './types'" >> \
  /Users/afshin/Desktop/Enorae/features/business/daily-analytics/components/index.ts
```

**Verify Missing Components:**
```bash
# List all component files
ls -1 /Users/afshin/Desktop/Enorae/features/business/daily-analytics/components/ | grep -E "\.(tsx|ts)$" | grep -v index

# Should show: daily-analytics-page.tsx, daily-metrics-dashboard.tsx, types.ts, partials/
# Check what's in partials:
ls -1 /Users/afshin/Desktop/Enorae/features/business/daily-analytics/components/partials/
```

---

### Fix 3: admin/roles/components/index.ts

**File:** `/Users/afshin/Desktop/Enorae/features/admin/roles/components/index.ts`

**Current Content:** (18 exports)
```typescript
export { AdminRoles } from './admin-roles'
export { AssignRoleForm } from './assign-role-form'
export { AssignRoleFormFields } from './assign-role-form-fields'
export { AssignRoleFormHeader } from './assign-role-form-header'
export { AssignRolePermissionsSection } from './assign-role-permissions-section'
export { BulkAssignDialog } from './bulk-assign-dialog'
export { BulkAssignRow } from './bulk-assign-row'
export { EditPermissionsDialog } from './edit-permissions-dialog'
export { PermissionsEditor } from './permissions-editor'
export { RoleAuditTimeline } from './role-audit-timeline'
export { RolePermissionMatrix } from './role-permission-matrix'
export { RoleSelector } from './role-selector'
export { RolesClient } from './roles-client'
export { RolesFilters } from './roles-filters'
export { RolesStats } from './roles-stats'
export { RolesTable } from './roles-table'
export { SalonSelector } from './salon-selector'

// Export types
export type { RoleValue } from './types'
```

**Missing Components:**
- `role-permission-presets.tsx` → Not exported
- `role-templates.tsx` → Not exported

**Fix:**
```bash
# First, verify these files exist
ls -1 /Users/afshin/Desktop/Enorae/features/admin/roles/components/ | grep -E "(role-permission-presets|role-templates)"

# Add exports before the types comment
sed -i '' '/^\/\/ Export types/i\
export { RolePermissionPresets } from "./role-permission-presets"\
export { RoleTemplates } from "./role-templates"\
' /Users/afshin/Desktop/Enorae/features/admin/roles/components/index.ts
```

**Verification:**
```bash
grep "export.*RolePermissionPresets\|export.*RoleTemplates" \
  /Users/afshin/Desktop/Enorae/features/admin/roles/components/index.ts
```

---

### Fix 4: admin/staff/components/index.ts

**File:** `/Users/afshin/Desktop/Enorae/features/admin/staff/components/index.ts`

**Missing Components:**
- `staff-filters-component.tsx`
- `staff-filters-types.ts`
- `use-staff-filters.ts`

**Fix:**
```bash
# List current directory to see what's exported
ls -1 /Users/afshin/Desktop/Enorae/features/admin/staff/components/ | grep -v "^index"

# Add missing exports
cat >> /Users/afshin/Desktop/Enorae/features/admin/staff/components/index.ts << 'EOF'
export { StaffFiltersComponent } from './staff-filters-component'
export { useStaffFilters } from './use-staff-filters'
export type { StaffFiltersProps, StaffFilterState } from './staff-filters-types'
EOF
```

---

### Fix 5: customer/appointments/components/index.ts

**File:** `/Users/afshin/Desktop/Enorae/features/customer/appointments/components/index.ts`

**Missing Components:**
- `reschedule-alerts.tsx`
- `reschedule-form-fields.tsx`

**Fix:**
```bash
cat >> /Users/afshin/Desktop/Enorae/features/customer/appointments/components/index.ts << 'EOF'
export { RescheduleAlerts } from './reschedule-alerts'
export { RescheduleFormFields } from './reschedule-form-fields'
EOF
```

---

### Fix 6: customer/sessions/components/index.ts

**File:** `/Users/afshin/Desktop/Enorae/features/customer/sessions/components/index.ts`

**Missing Components:**
- `revoke-all-dialog.tsx`
- `session-table-row.tsx`

**Fix:**
```bash
cat >> /Users/afshin/Desktop/Enorae/features/customer/sessions/components/index.ts << 'EOF'
export { RevokeAllDialog } from './revoke-all-dialog'
export { SessionTableRow } from './session-table-row'
EOF
```

---

### Fix 7: customer/profile/components/index.ts

**File:** `/Users/afshin/Desktop/Enorae/features/customer/profile/components/index.ts`

**Missing Components:**
- `customer-profile-content.tsx`
- `customer-profile-error.tsx`

**Fix:**
```bash
cat >> /Users/afshin/Desktop/Enorae/features/customer/profile/components/index.ts << 'EOF'
export { CustomerProfileContent } from './customer-profile-content'
export { CustomerProfileError } from './customer-profile-error'
EOF
```

---

### Fix 8: customer/chains/components/index.ts

**File:** `/Users/afshin/Desktop/Enorae/features/customer/chains/components/index.ts`

**Missing Components:**
- `chain-detail-content.tsx`
- `chains-page-content.tsx`

**Fix:**
```bash
cat >> /Users/afshin/Desktop/Enorae/features/customer/chains/components/index.ts << 'EOF'
export { ChainDetailContent } from './chain-detail-content'
export { ChainsPageContent } from './chains-page-content'
EOF
```

---

## Remaining Index Files to Verify

The following index files need manual verification to determine if other components are missing:

1. `business/coupons/components/index.ts` - Missing: `types.ts`
2. `customer/salon-search/components/index.ts` - Verify completeness
3. Any others flagged in audit

**Manual Verification Script:**
```bash
#!/bin/bash
# For each feature with flagged index file:

FEATURE="business/coupons"
INDEX_DIR="/Users/afshin/Desktop/Enorae/features/$FEATURE/components"

echo "Files in directory:"
ls -1 "$INDEX_DIR" | grep -E "\.(tsx|ts)$" | grep -v "^index"

echo ""
echo "Exported from index:"
grep "^export" "$INDEX_DIR/index.ts" | sed "s/.*from '\.\\/\(.*\)'.*/\1/" | sort

echo ""
echo "Missing exports (will appear below if any):"
comm -23 <(ls -1 "$INDEX_DIR" | grep -E "\.(tsx|ts)$" | grep -v "^index" | sed 's/\.\(tsx\|ts\)$//' | sort) \
         <(grep "^export" "$INDEX_DIR/index.ts" | sed "s/.*from '\.\\/\(.*\)'.*/\1/" | sed 's/\..*//' | sort)
```

---

## HIGH PRIORITY: Split Oversized Components

These 6 components exceed the 200-line hard limit and need to be split.

### Component 1: admin/staff/components/staff-filters-component.tsx (202 lines)

**Current Location:** `/Users/afshin/Desktop/Enorae/features/admin/staff/components/staff-filters-component.tsx`

**Analysis:** Component contains:
1. Filter form UI (80 lines)
2. Filter badge display (50 lines)
3. Filter logic handlers (40 lines)
4. Type definitions (32 lines)

**Refactoring Plan:**

```
staff-filters-component.tsx (KEEP - 45 lines, compose only)
├── Imports from child components
├── Main container/composition logic
└── Event handlers that delegate to children

staff-filters-form.tsx (NEW - 85 lines)
├── Form fields
├── Input handling
└── Submit button

staff-filters-badges.tsx (NEW - 50 lines)
├── Applied filter chips
├── Remove filter logic
└── Clear all button

staff-filters-helpers.ts (NEW - 32 lines)
├── Filter validation
├── Filter formatting
└── Type definitions moved from main component
```

**Implementation Steps:**

1. **Read current file to understand structure:**
```bash
wc -l /Users/afshin/Desktop/Enorae/features/admin/staff/components/staff-filters-component.tsx
head -50 /Users/afshin/Desktop/Enorae/features/admin/staff/components/staff-filters-component.tsx
```

2. **Extract form section to new file:** `staff-filters-form.tsx`
3. **Extract badges section to new file:** `staff-filters-badges.tsx`
4. **Extract helpers to new file:** `staff-filters-helpers.ts`
5. **Update main component** to compose children
6. **Update index.ts** to export new components
7. **Search for imports** of this component and verify they still work

**Verification:**
```bash
# Check file sizes after split
wc -l /Users/afshin/Desktop/Enorae/features/admin/staff/components/staff-filters-*.{ts,tsx}

# Should show all under 200 lines

# Update index
grep -n "StaffFilters" /Users/afshin/Desktop/Enorae/features/admin/staff/components/index.ts
```

---

### Component 2: admin/moderation/components/moderation-filters.tsx (201 lines)

**Current Location:** `/Users/afshin/Desktop/Enorae/features/admin/moderation/components/moderation-filters.tsx`

**Refactoring Plan:**

```
moderation-filters.tsx (45 lines - container)
moderation-filters-form.tsx (85 lines - form fields)
moderation-status-badges.tsx (50 lines - status display)
moderation-sort-options.tsx (21 lines - sort controls)
```

---

### Component 3: admin/moderation/components/review-detail-dialog.tsx (207 lines)

**Current Location:** `/Users/afshin/Desktop/Enorae/features/admin/moderation/components/review-detail-dialog.tsx`

**Refactoring Plan:**

```
review-detail-dialog.tsx (35 lines - dialog wrapper)
review-detail-header.tsx (60 lines - review metadata)
review-detail-body.tsx (80 lines - review content)
review-detail-actions.tsx (32 lines - action buttons)
```

---

### Component 4: shared/notifications/components/notification-center.tsx (217 lines)

**Refactoring Plan:**

```
notification-center.tsx (40 lines - container)
notification-list.tsx (90 lines - list display)
notification-preferences.tsx (55 lines - preferences panel)
notification-actions.tsx (32 lines - action buttons)
```

---

### Component 5: marketing/layout-components/footer/marketing-footer.tsx (219 lines)

**Refactoring Plan:**

```
marketing-footer.tsx (50 lines - container)
footer-links-section.tsx (60 lines - link columns)
footer-social-section.tsx (50 lines - social icons)
footer-newsletter-section.tsx (40 lines - newsletter form)
footer-legal-section.tsx (19 lines - copyright/legal)
```

---

### Component 6: customer/loyalty/components/loyalty-dashboard.tsx (211 lines)

**Refactoring Plan:**

```
loyalty-dashboard.tsx (45 lines - container)
loyalty-header-card.tsx (60 lines - member info)
loyalty-benefits-cards.tsx (70 lines - benefits grid)
loyalty-history-section.tsx (36 lines - activity log)
```

---

## MEDIUM PRIORITY: Complete Query/Mutation Index Files

### Files to Review

The following 10 index files have suspiciously low export counts:

```
1. features/business/metrics/api/queries/index.ts (1 export)
2. features/business/metrics/api/mutations/index.ts (1 export)
3. features/business/insights/api/mutations/index.ts (1 export)
4. features/business/settings/api/queries/index.ts (1 export)
5. features/business/metrics-operational/api/mutations/index.ts (1 export)
6. features/business/metrics-operational/api/queries/index.ts (1 export)
7. features/business/daily-analytics/api/mutations/index.ts (1 export)
8. features/business/daily-analytics/api/queries/index.ts (1 export)
9. features/business/webhooks-monitoring/api/mutations/index.ts (1 export)
10. features/business/webhooks-monitoring/api/queries/index.ts (1 export)
```

### Verification Script for Each

```bash
#!/bin/bash

# For each suspicious index file, verify actual file count

FEATURE="business/metrics"
TYPE="queries"  # or "mutations"

INDEX_FILE="/Users/afshin/Desktop/Enorae/features/$FEATURE/api/$TYPE/index.ts"
DIR=$(dirname "$INDEX_FILE")

echo "=== $FEATURE / $TYPE ==="
echo ""
echo "Actual files in directory:"
ls -1 "$DIR" | grep -E "\.(ts|tsx)$" | grep -v "^index"
echo ""
echo "Exports in index file:"
grep "^export" "$INDEX_FILE"
echo ""
echo "Missing exports (if any shown below):"
comm -23 <(ls -1 "$DIR" | grep -E "\.(ts|tsx)$" | grep -v "^index" | sed 's/\.\(ts\|tsx\)$//' | sort) \
         <(grep "^export" "$INDEX_FILE" | sed 's/.*from.*\///' | sed "s/'.*$//" | sed 's/\..*//' | sort)
```

### Process for Each File

For example, `business/metrics/api/queries/index.ts`:

```bash
# Step 1: List actual query files
ls -1 /Users/afshin/Desktop/Enorae/features/business/metrics/api/queries/ | grep -v index

# Step 2: Check what's exported
cat /Users/afshin/Desktop/Enorae/features/business/metrics/api/queries/index.ts

# Step 3: If missing exports, add them
# Example: If metrics.ts file exists but not exported:
echo "export { getMetricsOverview, getMetricsTrends } from './metrics'" >> \
  /Users/afshin/Desktop/Enorae/features/business/metrics/api/queries/index.ts
```

---

## Summary of All Fixes

### Step-by-Step Implementation Order

**Phase 1 - CRITICAL (5 minutes)**
- [ ] Fix 1: Add server-only to admin/reviews/api/queries/index.ts

**Phase 2 - HIGH: Index Exports (2-3 hours)**
- [ ] Fix 2-8: Complete 7 component index files
- [ ] Verify Fix 9-10: 2 additional index files needing manual review

**Phase 3 - HIGH: Oversized Files (10 hours)**
- [ ] Split staff-filters-component (2 hours)
- [ ] Split moderation-filters (1.5 hours)
- [ ] Split review-detail-dialog (1.5 hours)
- [ ] Split notification-center (2 hours)
- [ ] Split marketing-footer (1.5 hours)
- [ ] Split loyalty-dashboard (1.5 hours)

**Phase 4 - MEDIUM: Query/Mutation Indexes (3-4 hours)**
- [ ] Verify and fix 10 query/mutation index files

---

## Validation Commands

After completing each fix:

```bash
# Verify TypeScript compilation
npm run typecheck

# Check specific file line counts
wc -l features/**/components/*.tsx | awk '$1 > 200 { print }'

# Verify index exports
grep -c "^export" features/*/components/index.ts | grep ":1$"

# Check for server-only directives
grep -L "import 'server-only'" features/*/api/queries/index.ts

# Validate no imports bypassed indexes
grep -r "from '\.\/[^/]*\.tsx'" features --include="*.ts" --include="*.tsx"
```

---

## Rollback Plan

If issues occur during implementation:

```bash
# Git shows all changes
git diff --name-only

# Revert single file
git checkout -- features/admin/reviews/api/queries/index.ts

# Revert all changes
git checkout -- .

# See what's staged
git status
```

---

## Final Verification Checklist

After implementing ALL fixes:

- [ ] `npm run typecheck` passes with zero errors
- [ ] No component file exceeds 200 lines
- [ ] No index file exceeds 50 lines
- [ ] All query files have `import 'server-only'`
- [ ] All mutation files have `'use server'`
- [ ] All component indexes export all components
- [ ] No broken imports in codebase
- [ ] All query/mutation indexes are complete
- [ ] `git status` shows expected file changes
- [ ] Build process completes successfully

