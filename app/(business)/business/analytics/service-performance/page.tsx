import { ServicePerformance } from '@/features/business/analytics/service-performance'

export const metadata = {
  title: 'Service Performance Analytics',
  description: 'Track revenue, popularity, and performance metrics for your services',
}

export default async function ServicePerformancePage() {
  return <ServicePerformance />
}
