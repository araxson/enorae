import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { ServicePricing } from '@/features/business/services'

export type ServicePricingWithService = ServicePricing & {
  service: {
    id: string
    name: string
    description: string | null
    salon_id: string | null
  } | null
}

/**
 * Get all service pricing for the user's salon
 */
export async function getServicePricing(): Promise<ServicePricingWithService[]> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('service_pricing_view')
    .select(`
      *,
      service:services!fk_service_pricing_service(
        id,
        name,
        description
      )
    `)
    .eq('services.salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as ServicePricingWithService[]
}

/**
 * Get pricing for a specific service
 */
export async function getServicePricingByServiceId(
  serviceId: string
): Promise<ServicePricingWithService | null> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('service_pricing_view')
    .select(`
      *,
      service:services!fk_service_pricing_service(
        id,
        name,
        description,
        salon_id
      )
    `)
    .eq('service_id', serviceId)
    .is('deleted_at', null)
    .single<ServicePricingWithService>()

  if (error) throw error

  if (data?.service?.salon_id !== staffProfile.salon_id) {
    throw new Error('Unauthorized: Service not found for your salon')
  }

  return data as ServicePricingWithService
}

/**
 * Get single pricing by ID
 */
export async function getServicePricingById(
  id: string
): Promise<ServicePricingWithService | null> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('service_pricing_view')
    .select(`
      *,
      service:services!fk_service_pricing_service(
        id,
        name,
        description,
        salon_id
      )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single<ServicePricingWithService>()

  if (error) throw error

  if (data?.service?.salon_id !== staffProfile.salon_id) {
    throw new Error('Unauthorized: Pricing not found for your salon')
  }

  return data as ServicePricingWithService
}
