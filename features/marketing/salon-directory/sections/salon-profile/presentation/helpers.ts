import type { Salon, Service, ServicesByCategory } from './types'

export function buildSalonLocation(salon: Salon): string {
  return [salon['street_address'], salon['city'], salon['state_province'], salon['postal_code']]
    .filter(Boolean)
    .join(', ')
}

export function groupServicesByCategory(services: Service[]): ServicesByCategory {
  return services.reduce<ServicesByCategory>((acc, service) => {
    const category = service['category_name'] || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(service)
    return acc
  }, {})
}
