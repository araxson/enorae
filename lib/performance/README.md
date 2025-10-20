# Performance Optimization Guide

## Query Caching Strategy

### Query Keys
Use centralized query keys from `lib/cache/query-keys.ts`:

```typescript
import { queryKeys, CACHE_TIME, STALE_TIME } from '@/lib/cache/query-keys'

// Example: Appointments query
const { data } = useQuery({
  queryKey: queryKeys.appointments.list('all'),
  queryFn: getAppointments,
  staleTime: STALE_TIME.MEDIUM,
  cacheTime: CACHE_TIME.LONG,
})
```

### Cache Time Guidelines

| Data Type | Stale Time | Cache Time | Rationale |
|-----------|-----------|------------|-----------|
| Real-time data (notifications) | INSTANT | SHORT | Always fetch latest |
| Frequently changing (appointments) | SHORT | MEDIUM | Balance freshness & performance |
| Moderately stable (customers) | MEDIUM | LONG | Reduce unnecessary fetches |
| Stable data (services, settings) | LONG | VERY_LONG | Cache aggressively |

### Invalidation Patterns

```typescript
// After mutation, invalidate related queries
const mutation = useMutation({
  mutationFn: createAppointment,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
  },
})
```

## React Optimizations

### 1. Memoization

#### useMemo for expensive computations
```typescript
import { useMemoizedSort, useMemoizedFilter } from '@/lib/performance'

// Sort appointments
const sortedAppointments = useMemoizedSort(
  appointments,
  (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
  [appointments]
)

// Filter active customers
const activeCustomers = useMemoizedFilter(
  customers,
  (c) => c.status === 'active',
  [customers]
)
```

#### useCallback for event handlers
```typescript
const handleClick = useCallback((id: string) => {
  // Handler logic
}, [/* dependencies */])
```

### 2. Component Memoization

```typescript
import { withMemoization } from '@/lib/performance'

const ExpensiveComponent = withMemoization(
  function ExpensiveComponent({ data }) {
    // Expensive rendering logic
    return <div>{/* ... */}</div>
  },
  (prevProps, nextProps) => prevProps.data.id === nextProps.data.id
)
```

### 3. List Rendering

```typescript
import { MemoizedList } from '@/lib/performance'
import { AppointmentCard } from '@/features/shared/appointments'

<MemoizedList
  items={appointments}
  renderItem={(appointment) => <AppointmentCard {...appointment} />}
  keyExtractor={(appointment) => appointment.id}
/>
```

### 4. Virtualization for Large Lists

```typescript
import { useVirtualization } from '@/lib/performance'

const { virtualItems, totalHeight } = useVirtualization({
  items: largeDataSet,
  containerHeight: 600,
  itemHeight: 80,
  scrollTop: scrollPosition,
})

return (
  <div style={{ height: totalHeight, position: 'relative' }}>
    {virtualItems.map(({ item, style }) => (
      <div key={item.id} style={style}>
        <ItemComponent {...item} />
      </div>
    ))}
  </div>
)
```

### 5. Debouncing

```typescript
import { useDebouncedCallback } from '@/lib/performance'

const debouncedSearch = useDebouncedCallback((query: string) => {
  searchCustomers(query)
}, 300)
```

## Bundle Size Optimization

### Code Splitting
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
})
```

### Lazy Loading
```typescript
import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('./components/LazyComponent'))

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

## Image Optimization

### Next.js Image Component
```typescript
import Image from 'next/image'

<Image
  src={imageUrl}
  alt="Description"
  width={500}
  height={300}
  priority={false}
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
/>
```

## Performance Monitoring

### Development Mode
```typescript
import { PerformanceMonitor } from '@/lib/performance'

<PerformanceMonitor name="AppointmentsList">
  <AppointmentsList appointments={appointments} />
</PerformanceMonitor>
```

### Production Monitoring
- Use Next.js Analytics
- Monitor Core Web Vitals (LCP, FID, CLS)
- Track API response times
- Monitor database query performance

## Best Practices

1. **Always use query keys factory** - Prevents cache key typos
2. **Set appropriate stale/cache times** - Balance freshness and performance
3. **Invalidate queries after mutations** - Keep UI in sync
4. **Memoize expensive computations** - useMemo for filtering, sorting, mapping
5. **Memoize callbacks** - useCallback for event handlers
6. **Use React.memo for expensive components** - Prevent unnecessary re-renders
7. **Virtualize large lists** - Render only visible items
8. **Debounce user inputs** - Reduce API calls on search/filter
9. **Code split heavy components** - Reduce initial bundle size
10. **Optimize images** - Use Next.js Image component

## Performance Checklist

- [ ] Query keys use factory pattern
- [ ] Stale/cache times configured appropriately
- [ ] Mutations invalidate related queries
- [ ] Expensive computations are memoized
- [ ] Event handlers use useCallback
- [ ] Large lists use virtualization
- [ ] Search inputs are debounced
- [ ] Heavy components are code-split
- [ ] Images use Next.js Image component
- [ ] Performance monitoring enabled in dev
