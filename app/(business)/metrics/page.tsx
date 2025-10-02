import { SalonMetrics } from '@/features/salon-metrics'
import { getLatestSalonMetrics } from '@/features/salon-metrics/dal/salon-metrics.queries'

export const metadata = {
  title: 'Salon Metrics',
  description: 'Track salon performance and key metrics',
}

export default async function SalonMetricsPage() {
  const latestMetrics = await getLatestSalonMetrics()
  return <SalonMetrics latestMetrics={latestMetrics} />
}
