import { OperationalMetrics } from '@/features/business/metrics-operational'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Operational Metrics',
  description: 'Operational KPIs and performance metrics',
  noIndex: true,
})

export default async function OperationalMetricsPage() {
  return <OperationalMetrics />
}
