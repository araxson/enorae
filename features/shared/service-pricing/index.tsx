import { getServicePricing } from './api/queries'
import { getServices, getUserSalon } from '@/features/business/services/api/queries'
import { ServicePricingClient } from './components/service-pricing-client'

export async function ServicePricing() {
  const salon = await getUserSalon()
  const [pricing, services] = await Promise.all([
    getServicePricing(),
    getServices(salon.id!),
  ])

  const simpleServices = services.map(s => ({
    id: s.id!,
    name: s.name || 'Unknown Service'
  }))

  return <ServicePricingClient pricing={pricing} services={simpleServices} />
}
