# Critical Deviations

## Issue 1: Admin Dashboard Badges Override Slot Styling
**File**: `features/admin/dashboard/admin-dashboard.tsx`
**Severity**: 🔴 Critical
**Description**: Header badges apply typography, spacing, and color utilities directly to the shadcn badge slot instead of relying on default styling and surrounding layout primitives.

### Current Code
```tsx
<Badge
  variant="outline"
  className="flex w-fit items-center gap-2 rounded-full border-foreground/20 px-3 py-1 text-xs font-semibold text-muted-foreground"
>
  <Activity className="h-3.5 w-3.5" />
  Live feed
</Badge>
...
<Badge variant="secondary" className="gap-1.5 hover:bg-secondary/80">
  <ShieldAlert className="h-3 w-3" />
  {platformMetrics.pendingVerifications} {label}
</Badge>
```

### Reference Pattern
```tsx
import { Badge } from "@/components/ui/badge"
import { ShieldAlert } from "lucide-react"

export function BadgeWithIcon() {
  return (
    <Badge>
      <ShieldAlert className="mr-1 h-3 w-3" />
      Pending
    </Badge>
  )
}
```

### Corrected Code
```tsx
<CardHeader className="space-y-6">
  ...
  <div className="flex justify-end">
    <Badge variant="outline">
      <Activity className="mr-2 h-3.5 w-3.5" />
      Live feed
    </Badge>
  </div>
</CardHeader>
...
<TooltipTrigger asChild>
  <Link href="/admin/users">
    <Badge variant="secondary">
      <ShieldAlert className="mr-1 h-3 w-3" />
      {platformMetrics.pendingVerifications} {label}
    </Badge>
  </Link>
</TooltipTrigger>
```

---

## Issue 2: User Role Stats Badges Apply Custom Typography
**File**: `features/admin/dashboard/components/user-role-stats.tsx`
**Severity**: 🔴 Critical
**Description**: Multiple badges use `className` overrides for gap, font weight, width, and text sizing. These should rely on default badge styling with any spacing handled by surrounding layout containers or icon margins.

### Current Code
```tsx
<Badge variant="outline" className="gap-1 text-xs">
  <Users className="h-3 w-3" />
  {stats.totalUsers.toLocaleString()} users
</Badge>
...
<Badge variant="secondary" className="w-fit text-xs font-semibold">
  Most common: {topRoleLabel}
</Badge>
...
<Badge variant="outline" className="gap-1 text-xs">
  {count.toLocaleString()}
</Badge>
```

### Reference Pattern
```tsx
import { Badge } from "@/components/ui/badge"

export function CountBadge({ label }: { label: string }) {
  return <Badge variant="secondary">{label}</Badge>
}
```

### Corrected Code
```tsx
<CardHeader className="space-y-3">
  <div className="flex items-start justify-between gap-3">
    ...
    <Badge variant="outline">
      <Users className="mr-1 h-3 w-3" />
      {stats.totalUsers.toLocaleString()} users
    </Badge>
  </div>
  {topRoleLabel ? (
    <div className="inline-flex">
      <Badge variant="secondary">
        <span className="font-semibold">Most common:</span>
        <span className="ml-1">{topRoleLabel}</span>
      </Badge>
    </div>
  ) : null}
</CardHeader>
...
<Badge variant="outline">
  {count.toLocaleString()}
</Badge>
```

---
