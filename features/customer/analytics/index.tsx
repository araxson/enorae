import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { getCustomerMetrics } from './api/queries'
import { MetricsDashboard } from './components/metrics-dashboard'

export const customerAnalyticsMetadata = genMeta({
  title: 'Analytics | Enorae',
  description: 'View your personal analytics and insights',
})

export async function CustomerAnalytics() {
  const metrics = await getCustomerMetrics()
  return <MetricsDashboard metrics={metrics} />
}

export function CustomerAnalyticsPage() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">My Analytics</h1>
          <p className="leading-7 text-muted-foreground">
            Track your appointments, spending, and favorite services
          </p>
        </div>

        <CustomerAnalytics />
      </div>
    </section>
  )
}

export function CustomerAnalyticsFeature() {
  return (
    <Suspense fallback={<PageLoading />}>
      <CustomerAnalyticsPage />
    </Suspense>
  )
}

export { getCustomerMetrics, getAppointmentFrequency } from './api/queries'
export type { CustomerMetrics } from './api/queries'
