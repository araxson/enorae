import { BusinessDashboard } from '@/features/dashboard'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Business Portal',
  description: 'Manage your salon business and operations',
  noIndex: true,
})

export default async function BusinessPage() {
  return <BusinessDashboard />
}
