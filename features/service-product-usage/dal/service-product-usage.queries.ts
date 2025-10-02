import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: service_product_usage doesn't have public view yet

type ServiceProductUsage = Database['public']['Views']['service_product_usage']['Row']

export type ServiceProductUsageWithDetails = ServiceProductUsage & {
  service?: {
    id: string
    name: string
  } | null
  product?: {
    id: string
    name: string
    sku: string | null
  } | null
}

/**
 * Get all service-product usage mappings for the user's salon
 */
export async function getServiceProductUsage(): Promise<ServiceProductUsageWithDetails[]> {
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
    .from('service_product_usage')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Get related data
  const usageWithDetails = await Promise.all(
    (data || []).map(async (usage) => {
      // Get service
      const { data: service } = await supabase
        .from('services')
        .select('id, name')
        .eq('id', usage.service_id)
        .single()

      // Get product
      const { data: product } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('id', usage.product_id)
        .single()

      return {
        ...usage,
        service,
        product,
      }
    })
  )

  return usageWithDetails
}

/**
 * Get service-product usage for a specific service
 */
export async function getServiceProductUsageByService(
  serviceId: string
): Promise<ServiceProductUsageWithDetails[]> {
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
    .from('service_product_usage')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .eq('service_id', serviceId)
    .is('deleted_at', null)

  if (error) throw error

  const usageWithDetails = await Promise.all(
    (data || []).map(async (usage) => {
      const { data: service } = await supabase
        .from('services')
        .select('id, name')
        .eq('id', usage.service_id)
        .single()

      const { data: product } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('id', usage.product_id)
        .single()

      return {
        ...usage,
        service,
        product,
      }
    })
  )

  return usageWithDetails
}
