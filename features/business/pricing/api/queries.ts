import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

export * from './queries/dynamic-pricing'

export type PricingServiceOption = {
  id: string
  name: string
  price: number
}

export async function getPricingServices(
  salonId: string,
): Promise<PricingServiceOption[]> {
  // SECURITY: Require authentication and verify salon access
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const hasAccess = await canAccessSalon(salonId)
  if (!hasAccess) {
    throw new Error('Unauthorized: Cannot access this salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('id, name, price')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error

  const services = (data ?? []) as Array<{
    id: string | null
    name: string | null
    price: number | null
  }>

  return services
    .filter((service): service is { id: string; name: string; price: number | null } =>
      Boolean(service.id && service.name),
    )
    .map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price ?? 0,
    }))
}
