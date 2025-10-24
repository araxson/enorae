import { ServicePerformance } from '@/features/business/service-performance-analytics'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Service Performance Analytics',
  description: 'Review revenue, popularity, and performance metrics for services',
  noIndex: true,
})

export default async function ServicePerformancePage() {
  return <ServicePerformance />
}
