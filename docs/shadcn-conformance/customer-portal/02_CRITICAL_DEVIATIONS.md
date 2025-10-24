# Critical Deviations

All customer portal critical deviations identified during the initial audit have been resolved as of 2025-10-22. The corrected implementations below confirm that each component now matches the official shadcn/ui patterns.

## Resolved: VIPStatusCard Header Composition
**File**: `features/customer/dashboard/components/vip-status-card.tsx`
**Status**: ✅ Resolved – Header/footer slots are untouched; layout is handled via inline spans.

### Final Structure
```tsx
<CardHeader>
  <CardTitle>
    <span className="flex items-center gap-2">
      <Crown className="h-5 w-5" />
      VIP status
    </span>
  </CardTitle>
  <CardDescription>Exclusive benefits and rewards</CardDescription>
</CardHeader>
```

---

## Resolved: CustomerDashboard VIP Duplication
**File**: `features/customer/dashboard/components/customer-dashboard.tsx`
**Status**: ✅ Resolved – Dashboard now delegates to `<VIPStatusCard />`, eliminating the divergent structure.

### Final Structure
```tsx
{vipStatus && vipStatus.isVIP ? <VIPStatusCard vipStatus={vipStatus} /> : null}
```

---

## Resolved: CustomerMetrics Slot Misuse
**File**: `features/customer/dashboard/components/customer-metrics.tsx`
**Status**: ✅ Resolved – Free-floating `CardDescription` removed; cards keep default padding with layout handled in child wrappers.

### Final Structure
```tsx
<CardHeader>
  <CardTitle>{label}</CardTitle>
  <CardDescription>{description}</CardDescription>
</CardHeader>
<CardContent>
  <div className="flex items-center justify-between">
    <p className="text-2xl font-semibold text-foreground">{value}</p>
    <Icon className="h-5 w-5" aria-hidden="true" />
  </div>
  …
</CardContent>
```

---

## Resolved: SalonResultsGrid Listing Layout
**File**: `features/customer/salon-search/components/salon-results-grid.tsx`
**Status**: ✅ Resolved – Header slots receive direct text; icons and badges live in neutral spans.

### Final Structure
```tsx
<CardHeader>
  <CardTitle>
    <span className="flex items-start justify-between gap-2">
      <span>{salon.name}</span>
      <span className="flex gap-1">
        …
      </span>
    </span>
  </CardTitle>
  <CardDescription>
    <span className="flex items-center gap-1">
      <MapPin className="h-3 w-3 text-muted-foreground" />
      {formatAddress(salon.address)}
    </span>
  </CardDescription>
</CardHeader>
```

---
