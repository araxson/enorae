import { CustomerAnalytics } from '@/features/business/customer-analytics'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Customer Analytics',
  description: 'Review customer engagement trends and retention metrics',
  noIndex: true,
})

export default async function CustomersAnalyticsPage() {
  return <CustomerAnalytics />
}
