import { ServicePricing } from '@/features/business/service-pricing'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Service Pricing',
  description: 'Manage pricing and adjustments for salon services',
  noIndex: true,
})

export default async function ServicePricingPage() {
  return <ServicePricing />
}
