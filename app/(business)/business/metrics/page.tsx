import { SalonMetrics } from '@/features/business/metrics'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Salon Metrics',
  description: 'Track salon performance and operational metrics',
  noIndex: true,
})

export default async function SalonMetricsPage() {
  return <SalonMetrics />
}
