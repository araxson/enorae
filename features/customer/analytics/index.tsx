import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { Section, Stack, Box } from '@/components/layout'
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
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">My Analytics</h1>
          <p className="leading-7 text-muted-foreground">
            Track your appointments, spending, and favorite services
          </p>
        </Box>

        <CustomerAnalytics />
      </Stack>
    </Section>
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
