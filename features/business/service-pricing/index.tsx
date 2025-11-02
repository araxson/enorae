import { getServicePricing } from './api/queries'
import { getServices, getUserSalon } from '@/features/business/services/api/queries'
import { ServicePricingClient } from './components'

export async function ServicePricing() {
  const salon = await getUserSalon()
  if (!salon) {
    throw new Error('No salon found for user')
  }
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
export * from './types'
