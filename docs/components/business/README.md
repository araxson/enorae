# Business Component Library

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: 2025-10-10

---

## Overview

A comprehensive library of reusable React components designed specifically for business portal dashboards and analytics. These components provide a consistent, accessible, and performant way to display business metrics, revenue data, and performance statistics.

### Key Features

- 🎨 **Consistent Design** - Unified visual language across all business features
- ♿ **Accessible** - ARIA labels, semantic HTML, keyboard navigation
- 📱 **Responsive** - Mobile-first design that scales to desktop
- 🎯 **Type-Safe** - Full TypeScript support with detailed prop types
- 🔧 **Flexible** - Multiple variants and customization options
- 🚀 **Performant** - Optimized for large datasets and real-time updates

---

## Components

### 1. MetricCard

A versatile card component for displaying business metrics with multiple variants.

#### Variants

- **default**: Simple metric with value and optional icon
- **progress**: Metric with progress bar (0-100%)
- **trend**: Metric with growth/decline indicator
- **highlight**: Metric with custom highlight content

#### Usage

```tsx
import { MetricCard } from '@/features/business/business-common/components'
import { DollarSign, CheckCircle, Users } from 'lucide-react'

// Default variant
<MetricCard
  title="Total Revenue"
  value="$45,231"
  icon={DollarSign}
  subtitle="All-time earnings"
  accent="border-l-primary"
/>

// Progress variant
<MetricCard
  variant="progress"
  title="Confirmed Appointments"
  value={85}
  progress={85}
  icon={CheckCircle}
  subtitle="85% of total bookings"
  accent="border-l-green-500"
/>

// Trend variant
<MetricCard
  variant="trend"
  title="New Customers"
  value={127}
  trend={12.5}
  icon={Users}
  subtitle="This month"
/>

// Highlight variant
<MetricCard
  variant="highlight"
  title="Monthly Revenue"
  value="$38,500"
  highlight={
    <Badge variant="default">
      <TrendingUp className="h-3 w-3 mr-1" />
      +15.3%
    </Badge>
  }
  subtitle="Last 30 days"
  accent="border-l-blue-500"
/>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✅ | Card title |
| `value` | `string \| number` | ✅ | Primary value to display |
| `variant` | `'default' \| 'progress' \| 'trend' \| 'highlight'` | ❌ | Card variant (default: 'default') |
| `icon` | `ReactNode \| ComponentType` | ❌ | Optional icon |
| `subtitle` | `string` | ❌ | Optional description |
| `accent` | `string` | ❌ | Border color class (e.g., 'border-l-blue-500') |
| `progress` | `number` | ❌ | Progress value 0-100 (progress variant only) |
| `trend` | `number` | ❌ | Growth percentage (trend variant only) |
| `highlight` | `ReactNode` | ❌ | Custom content (highlight variant only) |

---

### 2. RevenueCard

Specialized card for displaying revenue metrics with growth indicators and breakdowns.

#### Usage

```tsx
import { RevenueCard } from '@/features/business/business-common/components'
import { DollarSign } from 'lucide-react'

// Basic revenue card
<RevenueCard
  title="Monthly Revenue"
  amount={45231}
  icon={DollarSign}
  subtitle="Last 30 days"
  accent="border-l-green-500"
/>

// With growth calculation
<RevenueCard
  title="Monthly Revenue"
  amount={45231}
  previousAmount={38500}
  icon={DollarSign}
  subtitle="Last 30 days"
  accent="border-l-green-500"
/>

// With revenue breakdown
<RevenueCard
  title="Total Revenue"
  amount={45231}
  previousAmount={38500}
  breakdown={[
    { label: 'Services', amount: 32000 },
    { label: 'Products', amount: 13231 },
  ]}
  icon={DollarSign}
  accent="border-l-primary"
/>

// Compact variant
<RevenueCard
  title="Today's Revenue"
  amount={1850}
  compact
/>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✅ | Card title |
| `amount` | `number` | ✅ | Revenue amount |
| `previousAmount` | `number` | ❌ | Previous period amount (for auto growth calculation) |
| `growth` | `number` | ❌ | Manual growth rate override |
| `icon` | `ReactNode \| ComponentType` | ❌ | Optional icon |
| `subtitle` | `string` | ❌ | Optional time period or description |
| `breakdown` | `Array<{label: string, amount: number}>` | ❌ | Revenue source breakdown |
| `accent` | `string` | ❌ | Border color class |
| `currency` | `string` | ❌ | Currency code (default: 'USD') |
| `compact` | `boolean` | ❌ | Compact display mode |

---

### 3. RankingList

Display ranked lists of top performers (services, staff, customers, etc.).

#### Usage

```tsx
import { RankingList } from '@/features/business/business-common/components'
import { Star, Award } from 'lucide-react'

// Top services
<RankingList
  title="Top Services"
  icon={Star}
  iconColor="text-yellow-500"
  items={[
    {
      id: '1',
      name: 'Premium Haircut',
      subtitle: '45 bookings',
      value: 3750,
      metric: 'revenue'
    },
    {
      id: '2',
      name: 'Hair Color',
      subtitle: '32 bookings',
      value: 2880,
      metric: 'revenue'
    },
  ]}
  valueFormat="currency"
  limit={5}
/>

// Top staff performers
<RankingList
  title="Top Performers"
  icon={Award}
  iconColor="text-blue-500"
  items={staffPerformers}
  valueFormat="currency"
  emptyMessage="No performance data yet"
/>

// Top customers by visits
<RankingList
  title="Most Loyal Customers"
  items={topCustomers}
  valueFormat="number"
  limit={10}
/>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✅ | List title |
| `items` | `RankingItem[]` | ✅ | Array of ranking items |
| `icon` | `ReactNode \| ComponentType` | ❌ | Optional icon |
| `iconColor` | `string` | ❌ | Icon color class |
| `valueFormat` | `'currency' \| 'number'` | ❌ | How to format values (default: 'currency') |
| `limit` | `number` | ❌ | Max items to display |
| `emptyMessage` | `string` | ❌ | Message when no items |

#### RankingItem Type

```tsx
type RankingItem = {
  id: string          // Unique identifier
  name: string        // Primary label
  subtitle?: string   // Secondary label (e.g., role, category)
  value: number       // Primary metric value
  metric?: string     // Optional metric label
}
```

---

### 4. StatBadge

Inline statistics badge with trend indicators.

#### Usage

```tsx
import { StatBadge, ComparisonBadge } from '@/features/business/business-common/components'

// Basic stat badge
<StatBadge value={12.5} format="percentage" />

// With trend indicator
<StatBadge value={12.5} format="percentage" showTrend />
<StatBadge value={-5.2} format="percentage" showTrend />

// Number format
<StatBadge value={142} format="number" size="lg" />

// Comparison badge
<ComparisonBadge
  current={125}
  previous={100}
  format="number"
/>

// With values shown
<ComparisonBadge
  current={85.5}
  previous={92.3}
  format="percentage"
  showValues
/>
```

#### StatBadge Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `number` | ✅ | The statistic value |
| `format` | `'percentage' \| 'number'` | ❌ | Value format (default: 'percentage') |
| `showTrend` | `boolean` | ❌ | Show up/down arrow |
| `size` | `'sm' \| 'md' \| 'lg'` | ❌ | Badge size |

#### ComparisonBadge Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `current` | `number` | ✅ | Current value |
| `previous` | `number` | ✅ | Previous value |
| `format` | `'percentage' \| 'number'` | ❌ | Value format |
| `showValues` | `boolean` | ❌ | Show actual values or just change |
| `size` | `'sm' \| 'md' \| 'lg'` | ❌ | Badge size |

---

## Utility Functions

### Formatting Utilities

```tsx
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDuration,
  calculateGrowthRate,
  formatAnalyticsDate,
} from '@/features/business/business-common/utils/formatters'

// Currency formatting
formatCurrency(45231)  // "$45,231"
formatCurrency(45231.50, { minimumFractionDigits: 2 })  // "$45,231.50"
formatCurrency(1234.56, { currency: 'EUR' })  // "€1,235"

// Percentage formatting
formatPercentage(12.5)  // "12.5%"
formatPercentage(12.5, { decimals: 0 })  // "13%"
formatPercentage(12.5, { includeSign: true })  // "+12.5%"

// Number abbreviation
formatNumber(1234)  // "1.2K"
formatNumber(1234567)  // "1.2M"
formatNumber(123)  // "123"

// Duration formatting
formatDuration(45)  // "45m"
formatDuration(90)  // "1h 30m"
formatDuration(120)  // "2h"

// Growth rate calculation
calculateGrowthRate(125, 100)  // 25
calculateGrowthRate(75, 100)   // -25

// Date formatting
formatAnalyticsDate('2024-01-15')  // "Jan 15, 2024"
formatAnalyticsDate(new Date())    // "Oct 10, 2025"
```

---

## Migration Guide

### Replacing Existing Components

#### Before (Dashboard MetricCard)

```tsx
// features/business/dashboard/components/metric-card.tsx
import { AppointmentMetricCard } from '../components/metric-card'

<AppointmentMetricCard
  title="Confirmed"
  icon={<CheckCircle className="h-4 w-4 text-green-600" />}
  value={metrics.confirmedAppointments}
  progress={confirmationRate}
  description="85% of total"
  accent="border-l-green-500"
  progressClass="[&>div]:bg-green-600"
/>
```

#### After (Business Library)

```tsx
import { MetricCard } from '@/features/business/business-common/components'
import { CheckCircle } from 'lucide-react'

<MetricCard
  variant="progress"
  title="Confirmed"
  icon={CheckCircle}
  value={metrics.confirmedAppointments}
  progress={confirmationRate}
  subtitle="85% of total"
  accent="border-l-green-500"
/>
```

#### Before (Analytics TopPerformers)

```tsx
// Manual implementation in features/business/analytics/components/top-performers.tsx
<Card>
  <CardHeader>
    <CardTitle>Top Services</CardTitle>
  </CardHeader>
  <CardContent>
    {services.map((service, index) => (
      <div key={service.name}>
        <Badge>#{index + 1}</Badge>
        <div>{service.name}</div>
        <div>{formatCurrency(service.revenue)}</div>
      </div>
    ))}
  </CardContent>
</Card>
```

#### After (Business Library)

```tsx
import { RankingList } from '@/features/business/business-common/components'
import { Star } from 'lucide-react'

<RankingList
  title="Top Services"
  icon={Star}
  iconColor="text-yellow-500"
  items={services.map(s => ({
    id: s.id,
    name: s.name,
    subtitle: `${s.count} bookings`,
    value: s.revenue,
  }))}
  valueFormat="currency"
/>
```

---

## Best Practices

### 1. Consistent Metric Display

Use `MetricCard` for all metric displays to maintain visual consistency:

```tsx
// ✅ Good - Consistent
<Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
  <MetricCard title="Revenue" value="$45K" icon={DollarSign} />
  <MetricCard title="Bookings" value={127} icon={Calendar} />
  <MetricCard variant="trend" title="Customers" value={85} trend={12.5} />
</Grid>

// ❌ Bad - Inconsistent custom cards
<div>
  <CustomRevenueCard amount={45000} />
  <DifferentBookingCard count={127} />
  <YetAnotherCustomerCard value={85} growth={12.5} />
</div>
```

### 2. Revenue Displays

Always use `RevenueCard` for revenue metrics to show growth automatically:

```tsx
// ✅ Good - With growth calculation
<RevenueCard
  title="Monthly Revenue"
  amount={currentRevenue}
  previousAmount={previousRevenue}
/>

// ❌ Bad - Manual calculation
<Card>
  <div>${currentRevenue}</div>
  <div>{((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)}%</div>
</Card>
```

### 3. Top Performers

Use `RankingList` for all ranked data:

```tsx
// ✅ Good - Reusable component
<RankingList
  title="Top Services"
  items={services}
  valueFormat="currency"
/>

// ❌ Bad - Custom implementation
{services.map((service, i) => (
  <div key={service.id}>
    <span>#{i + 1}</span>
    <span>{service.name}</span>
    <span>${service.revenue}</span>
  </div>
))}
```

### 4. Formatting

Always use utility functions for consistent formatting:

```tsx
// ✅ Good - Consistent formatting
import { formatCurrency, formatPercentage } from '@/features/business/business-common/utils/formatters'

const revenue = formatCurrency(45231)
const growth = formatPercentage(12.5, { includeSign: true })

// ❌ Bad - Manual formatting
const revenue = `$${Math.round(45231).toLocaleString()}`
const growth = `+${(12.5).toFixed(1)}%`
```

---

## Examples

### Complete Dashboard

```tsx
import {
  MetricCard,
  RevenueCard,
  RankingList,
  StatBadge,
} from '@/features/business/business-common/components'
import { Grid, Stack } from '@/components/layout'
import { DollarSign, Calendar, Users, Star, Award } from 'lucide-react'

export function BusinessDashboard({ metrics, topServices, topStaff }) {
  return (
    <Stack gap="lg">
      {/* Revenue Cards */}
      <Grid cols={{ base: 1, md: 2 }} gap="md">
        <RevenueCard
          title="Total Revenue"
          amount={metrics.totalRevenue}
          previousAmount={metrics.previousRevenue}
          icon={DollarSign}
          breakdown={[
            { label: 'Services', amount: metrics.serviceRevenue },
            { label: 'Products', amount: metrics.productRevenue },
          ]}
          accent="border-l-primary"
        />
        <RevenueCard
          title="Last 30 Days"
          amount={metrics.last30Days}
          icon={TrendingUp}
          subtitle="Recent performance"
          accent="border-l-green-500"
        />
      </Grid>

      {/* Metric Cards */}
      <Grid cols={{ base: 1, sm: 3 }} gap="md">
        <MetricCard
          variant="trend"
          title="Appointments"
          value={metrics.appointments}
          trend={metrics.appointmentGrowth}
          icon={Calendar}
        />
        <MetricCard
          variant="trend"
          title="New Customers"
          value={metrics.newCustomers}
          trend={metrics.customerGrowth}
          icon={Users}
        />
        <MetricCard
          variant="progress"
          title="Occupancy"
          value={`${metrics.occupancy}%`}
          progress={metrics.occupancy}
          subtitle="Today's schedule"
        />
      </Grid>

      {/* Top Performers */}
      <Grid cols={{ base: 1, lg: 2 }} gap="md">
        <RankingList
          title="Top Services"
          icon={Star}
          iconColor="text-yellow-500"
          items={topServices}
          valueFormat="currency"
          limit={5}
        />
        <RankingList
          title="Top Performers"
          icon={Award}
          iconColor="text-blue-500"
          items={topStaff}
          valueFormat="currency"
          limit={5}
        />
      </Grid>
    </Stack>
  )
}
```

---

## TypeScript Support

All components are fully typed with TypeScript. Import types as needed:

```tsx
import type { MetricCardProps, RankingItem } from '@/features/business/business-common/components'

// Use in your own components
type DashboardProps = {
  metrics: {
    revenue: number
    appointments: number
  }
  rankings: RankingItem[]
}
```

---

## Accessibility

All components follow WCAG 2.1 AA standards:

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Color contrast compliance
- ✅ Focus indicators

---

## Performance

Components are optimized for performance:

- ✅ Client components only where needed
- ✅ Memoized calculations
- ✅ Optimized re-renders
- ✅ Efficient list rendering
- ✅ No unnecessary API calls

---

## Support

For questions or issues with the business component library:

1. Check this documentation first
2. Review the component source code
3. Look at existing usage in `features/business/`
4. Create an issue in the project repository

---

**Last Updated**: October 10, 2025
**Maintained By**: Enorae Development Team
