# Component Details

## AdminDashboardPage
**File**: `features/admin/dashboard/admin-dashboard.tsx`
**Status**: ❌
**Deviations**: 2

### Deviations Found
1. **Badge Slot Styling Overrides**
   - Current: `<Badge variant="outline" className="flex w-fit items-center gap-2 rounded-full border-foreground/20 px-3 py-1 text-xs font-semibold text-muted-foreground">` (`features/admin/dashboard/admin-dashboard.tsx:142`)
   - Should be: badge used with `variant` only, icon spacing handled with `mr-*` on the icon per shadcn badge demo
2. **Tooltip Badge Hover Styling Override**
   - Current: `<Badge variant="secondary" className="gap-1.5 hover:bg-secondary/80">` (`features/admin/dashboard/admin-dashboard.tsx:164`)
   - Should be: rely on default hover treatment and manage internal spacing with inline icon markup

### Details
These overrides alter typography, hover colors, and layout inside the badge primitive. Official shadcn guidance keeps badges unstyled beyond provided `variant` and `size` props, pushing layout to surrounding containers.

---

## UserRoleStats
**File**: `features/admin/dashboard/components/user-role-stats.tsx`
**Status**: ❌
**Deviations**: 3

### Deviations Found
1. **Total Users Badge Overrides**
   - Current: `<Badge variant="outline" className="gap-1 text-xs">` (`features/admin/dashboard/components/user-role-stats.tsx:73`)
   - Should be: default badge sizing with icon margin
2. **Most Common Badge Typography**
   - Current: `<Badge variant="secondary" className="w-fit text-xs font-semibold">` (`features/admin/dashboard/components/user-role-stats.tsx:79`)
   - Should be: default badge text with emphasis handled via nested `<span>`
3. **Per-Role Count Badge Overrides**
   - Current: `<Badge variant="outline" className="gap-1 text-xs">` (`features/admin/dashboard/components/user-role-stats.tsx:96`)
   - Should be: default badge with numeric value directly as content

### Details
Badges repeat text and layout overrides across the component, creating a maintenance hotspot and diverging from the documented badge contract.

---

## AdminOverviewRevenueTab
**File**: `features/admin/dashboard/components/admin-overview-revenue-tab.tsx`
**Status**: ⚠️
**Deviations**: 1

### Deviations Found
1. **Window Size Badge Overrides**
   - Current: `<Badge variant="outline" className="gap-1 text-xs">` (`features/admin/dashboard/components/admin-overview-revenue-tab.tsx:47`)
   - Should be: badge without overrides, with optional `<span className="mr-1">` to separate text segments

### Details
Extra class utilities duplicate the badge’s base styling and should be moved to surrounding layout.

---

## AdminOverviewReviewsTab
**File**: `features/admin/dashboard/components/admin-overview-reviews-tab.tsx`
**Status**: ⚠️
**Deviations**: 1

### Deviations Found
1. **Rating Badge Overrides**
   - Current: `<Badge variant="outline" className="gap-1 text-xs">` (`features/admin/dashboard/components/admin-overview-reviews-tab.tsx:47`)
   - Should be: default badge with the `Star` icon carrying `mr-1` for spacing

### Details
The badge already renders at `text-xs`; adding the same utility creates redundant styling and contradicts shadcn guidance.

---

## UsersTable
**File**: `features/admin/users/components/users-table.tsx`
**Status**: ⚠️
**Deviations**: 2

### Deviations Found
1. **Desktop Table Wrapper**
   - Current: `<div className="hidden md:block border rounded-lg">` wrapping a cardless table (`features/admin/users/components/users-table.tsx:60`)
   - Should be: table placed inside a shadcn `Card` or `ScrollArea` container instead of a custom border wrapper
2. **Role Badges Typography Overrides**
   - Current: `<Badge ... className="text-xs">` for each role chip (`features/admin/users/components/users-table.tsx:114`, `features/admin/users/components/users-table.tsx:199`)
   - Should be: rely on badge defaults with icon spacing handled within the content

### Details
Mixing custom wrappers and badge overrides reduces consistency with other card/table compositions in the stack.

---

## HealthOverview
**File**: `features/admin/database-health/components/health-overview.tsx`
**Status**: ⚠️
**Deviations**: 1

### Deviations Found
1. **Metric Badge Width Override**
   - Current: `<Badge variant={metric.variant} className="w-fit">` (`features/admin/database-health/components/health-overview.tsx:80`)
   - Should be: default badge width; if layout needs alignment, wrap the badge in a flex container instead

### Details
Applying `w-fit` changes intrinsic badge sizing, conflicting with the documented inline-flex usage.

---

## ChainComplianceTable
**File**: `features/admin/chains/components/chain-compliance.tsx`
**Status**: ⚠️
**Deviations**: 2

### Deviations Found
1. **Custom Table Container**
   - Current: `<div className="rounded-md border">` inside card content (`features/admin/chains/components/chain-compliance.tsx:31`)
   - Should be: use card content padding or shadcn `Table` scroll container without duplicating border styling
2. **Issue Badge Typography Override**
   - Current: `<Badge ... className="text-xs">` (`features/admin/chains/components/chain-compliance.tsx:81`)
   - Should be: default badge typography with icon spacing handled inline

### Details
Duplicating card styling and shrinking badge text deviates from the documented components and introduces inconsistent density.

---

## SalonChainsClient
**File**: `features/admin/chains/components/salon-chains-client.tsx`
**Status**: ⚠️
**Deviations**: 2

### Deviations Found
1. **Custom Table Container**
   - Current: `<div className="rounded-md border">` around the table (`features/admin/chains/components/salon-chains-client.tsx:36`)
   - Should be: leverage card structure or `ScrollArea` for overflow without duplicating borders
2. **Subscription Badge Text Transform**
   - Current: `<Badge variant="outline" className="capitalize">` (`features/admin/chains/components/salon-chains-client.tsx:64`)
   - Should be: default badge with formatted string handled before rendering or via `<span className="capitalize">` inside content

### Details
Border wrappers and direct badge text manipulation reduce parity with other admin tables and complicate future refactors.

---
