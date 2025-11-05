import { Suspense } from 'react'
import type { JSX } from 'react'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { getCustomerMetrics } from './api/queries'
import { AnalyticsSkeleton, MetricsDashboard } from './components'

export const customerAnalyticsMetadata = genMeta({
  title: 'Analytics | Enorae',
  description: 'View your personal analytics and insights',
})

async function CustomerAnalytics() {
  const metrics = await getCustomerMetrics()
  return <MetricsDashboard metrics={metrics} />
}

function CustomerAnalyticsPage() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <ItemGroup className="gap-2">
          <Item variant="muted" size="sm">
            <ItemContent>
              <ItemTitle>My Analytics</ItemTitle>
              <ItemDescription>
                Track your appointments, spending, and favorite services
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        <CustomerAnalytics />
      </div>
    </section>
  )
}

export function CustomerAnalyticsFeature(): JSX.Element {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <CustomerAnalyticsPage />
    </Suspense>
  )
}

export { getCustomerMetrics, getAppointmentFrequency } from './api/queries'
export type { CustomerMetrics } from './api/queries'
export type * from './api/types'
