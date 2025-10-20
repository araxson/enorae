# Code Examples by Domain

All code patterns in one place for quick reference.

## ✅ Correct Patterns

### UI: Using shadcn slots for typography
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function RevenueSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <CardDescription>Track bookings, upsells, and retail sales.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <Badge variant="outline">+18%</Badge>
        <span className="text-muted-foreground">vs previous period</span>
      </CardContent>
    </Card>
  )
}
```

## ❌ Wrong Patterns

### UI: Leftover typography primitives
```tsx
// ❌ WRONG - typography import
import { H1, P } from '@/components/ui/typography'

<H1>Team availability</H1>
<P>Control who can be booked.</P>

// ✅ CORRECT - shadcn Card slots
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Team availability</CardTitle>
    <CardDescription>Control who can be booked.</CardDescription>
  </CardHeader>
</Card>

// ✅ CORRECT - semantic markup + design tokens (when no primitive exists)
<div className="space-y-2">
  <h2 className="text-2xl font-semibold tracking-tight">Team availability</h2>
  <p className="text-muted-foreground">Control who can be booked.</p>
</div>
```
