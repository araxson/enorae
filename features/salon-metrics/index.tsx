import { MetricsOverview } from './components/metrics-overview'
import type { SalonMetricsData } from './dal/salon-metrics.queries'

type SalonMetricsProps = {
  latestMetrics: SalonMetricsData | null
}

export function SalonMetrics({ latestMetrics }: SalonMetricsProps) {
  return (
    <div className="space-y-6">
      <div>
        <H2>Salon Metrics</H2>
        <Muted className="mt-1">
          Track your salon's performance and key metrics
        </Muted>
      </div>

      <MetricsOverview metrics={latestMetrics} />
    </div>
  )
}
