import { H2, Muted } from '@/components/ui/typography'
import { getLatestSalonMetrics } from './api/queries'
import { MetricsOverview } from './components/metrics-overview'

export async function SalonMetrics() {
  const latestMetrics = await getLatestSalonMetrics()

  return (
    <div className="space-y-6">
      <div>
        <H2>Salon Metrics</H2>
        <Muted className="mt-1">
          Track your salon&apos;s performance and key metrics
        </Muted>
      </div>

      <MetricsOverview metrics={latestMetrics} />
    </div>
  )
}
