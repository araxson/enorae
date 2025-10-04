import { ServicesManagement } from '@/features/business/services'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Services',
  description: 'Manage your salon services and pricing',
  noIndex: true,
})

export default async function ServicesPage() {
  return <ServicesManagement />
}
