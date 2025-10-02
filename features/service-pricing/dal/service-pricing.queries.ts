import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type ServicePricing = Database['public']['Views']['service_pricing']['Row']
type Service = Database['public']['Views']['services']['Row']

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
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('service_pricing')
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
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('service_pricing')
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
    .single()

  if (error) throw error

  if (data.service?.salon_id !== staffProfile.salon_id) {
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
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('service_pricing')
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
    .single()

  if (error) throw error

  if (data.service?.salon_id !== staffProfile.salon_id) {
    throw new Error('Unauthorized: Pricing not found for your salon')
  }

  return data as ServicePricingWithService
}
