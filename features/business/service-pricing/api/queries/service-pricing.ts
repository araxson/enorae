import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { ServicePricing } from '@/features/business/services'
import { createOperationLogger } from '@/lib/observability/logger'

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
  const logger = createOperationLogger('getServicePricing', {})
  logger.start()

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
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!data) return []

  // PERFORMANCE FIX: Batch fetch all services in one query instead of N+1
  const serviceIds = data
    .map((pricing) => pricing.service_id)
    .filter(Boolean) as string[]

  if (serviceIds.length === 0) {
    return data.map((pricing) => ({ ...pricing, service: null }))
  }

  const { data: servicesData, error: servicesError } = await supabase
    .from('services_view')
    .select('id, name, description, salon_id')
    .in('id', serviceIds)

  if (servicesError) throw servicesError

  // Create a map for fast lookup
  const servicesMap = new Map(
    (servicesData ?? []).map((service) => [
      service.id,
      service.id && service.name
        ? {
            id: service.id,
            name: service.name,
            description: service.description,
            salon_id: service.salon_id,
          }
        : null,
    ])
  )

  return data.map((pricing) => ({
    ...pricing,
    service: pricing.service_id ? servicesMap.get(pricing.service_id) ?? null : null,
  }))
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
    .select('*')
    .eq('service_id', serviceId)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  if (!data) return null

  // Fetch service details
  let service = null
  if (data.service_id) {
    const { data: serviceData } = await supabase
      .from('services_view')
      .select('id, name, description, salon_id')
      .eq('id', data.service_id)
      .single()

    service = serviceData || null

    if (service?.salon_id !== staffProfile.salon_id) {
      throw new Error('Unauthorized: Service not found for your salon')
    }
  }

  return {
    ...data,
    service: service || null,
  } as ServicePricingWithService
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
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  if (!data) return null

  // Fetch service details
  let service = null
  if (data.service_id) {
    const { data: serviceData } = await supabase
      .from('services_view')
      .select('id, name, description, salon_id')
      .eq('id', data.service_id)
      .single()

    service = serviceData || null

    if (service?.salon_id !== staffProfile.salon_id) {
      throw new Error('Unauthorized: Pricing not found for your salon')
    }
  }

  return {
    ...data,
    service: service || null,
  } as ServicePricingWithService
}
