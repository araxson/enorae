import { Section, Stack, Box } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { getCustomerMetrics } from './api/queries'
import { MetricsDashboard } from './components/metrics-dashboard'

export async function CustomerAnalytics() {
  const metrics = await getCustomerMetrics()
  return <MetricsDashboard metrics={metrics} />
}

export function CustomerAnalyticsPage() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>My Analytics</H1>
          <P className="text-muted-foreground">
            Track your appointments, spending, and favorite services
          </P>
        </Box>

        <CustomerAnalytics />
      </Stack>
    </Section>
  )
}

export { getCustomerMetrics, getAppointmentFrequency } from './api/queries'
export type { CustomerMetrics } from './api/queries'
