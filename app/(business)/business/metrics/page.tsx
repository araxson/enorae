import { SalonMetrics } from '@/features/business/metrics'

export const metadata = {
  title: 'Salon Metrics',
  description: 'Track salon performance and key metrics',
}

export default async function SalonMetricsPage() {
  return <SalonMetrics />
}
