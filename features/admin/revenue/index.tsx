import { Section, Stack, Box } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import {
  getRevenueSummary,
  getSalonRevenue,
  getServiceRevenue,
  getRevenueTimeseries,
} from './api/queries'
import { RevenueDashboard } from './components/revenue-dashboard'

export async function AdminRevenue() {
  // Default to last 30 days
  const dateTo = new Date().toISOString()
  const dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [summary, salonRevenue, serviceRevenue, timeseries] = await Promise.all([
    getRevenueSummary(dateFrom, dateTo),
    getSalonRevenue(dateFrom, dateTo, 20),
    getServiceRevenue(dateFrom, dateTo, 20),
    getRevenueTimeseries(dateFrom, dateTo),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Revenue Dashboard</H1>
          <Lead>Platform-wide revenue analytics and insights</Lead>
        </Box>

        <RevenueDashboard
          summary={summary}
          salonRevenue={salonRevenue}
          serviceRevenue={serviceRevenue}
          timeseries={timeseries}
        />
      </Stack>
    </Section>
  )
}
