import { MarketingServicesDirectoryPage } from '@/features/marketing/services-directory'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Browse Services',
  description: 'Explore all available beauty and wellness services. Find the perfect treatment for your needs and book appointments at top salons.',
  keywords: ['beauty services', 'salon services', 'hair services', 'nail services', 'spa services', 'wellness', 'beauty treatments'],
})

export default async function ServicesPage() {
  return <MarketingServicesDirectoryPage />
}
