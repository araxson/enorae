import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { ServiceProductUsage } from '@/lib/types/app.types'

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
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  // PERFORMANCE: Use join syntax to eliminate N+1 queries
  const { data, error } = await supabase
    .from('service_product_usage')
    .select(`
      *,
      service:service_id(id, name),
      product:product_id(id, name, sku)
    `)
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []) as ServiceProductUsageWithDetails[]
}

/**
 * Get service-product usage for a specific service
 */
export async function getServiceProductUsageByService(
  serviceId: string
): Promise<ServiceProductUsageWithDetails[]> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  // PERFORMANCE: Use join syntax to eliminate N+1 queries
  const { data, error } = await supabase
    .from('service_product_usage')
    .select(`
      *,
      service:service_id(id, name),
      product:product_id(id, name, sku)
    `)
    .eq('salon_id', staffProfile.salon_id)
    .eq('service_id', serviceId)
    .is('deleted_at', null)

  if (error) throw error

  return (data || []) as ServiceProductUsageWithDetails[]
}
