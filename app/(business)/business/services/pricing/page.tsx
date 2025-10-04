import { ServicePricing } from '@/features/shared/service-pricing'

export const metadata = {
  title: 'Service Pricing',
  description: 'Manage pricing for salon services',
}

export default async function ServicePricingPage() {
  return <ServicePricing />
}
