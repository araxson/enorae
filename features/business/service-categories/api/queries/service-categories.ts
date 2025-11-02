import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

// FIXED: Use service_categories_view with pre-computed counts
type ServiceCategory = Database['public']['Views']['service_categories_view']['Row']

export type ServiceCategoryWithCounts = ServiceCategory & {
  service_count?: number
  // Note: description, display_order, and icon_name do not exist in the database schema
  // These were removed as they are not present in catalog.service_categories table
}

/**
 * Get all service categories for the user's salon
 * IMPROVED: Uses service_categories_view with pre-computed active_services_count
 */
export async function getServiceCategories(): Promise<ServiceCategoryWithCounts[]> {
  const logger = createOperationLogger('getServiceCategories', {})
  logger.start()

  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', session.user['id'])
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.['salon_id']) throw new Error('User salon not found')

  // ✅ FIXED: Query view with pre-computed counts (eliminates N+1)
  const { data, error } = await supabase
    .from('service_categories_view')
    .select('*')
    .eq('salon_id', staffProfile['salon_id'])
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) throw error

  // ✅ Map view data directly - active_services_count already computed
  const categories = (data || []) as ServiceCategory[]
  return categories.map((category) => ({
    ...category,
    service_count: category['active_services_count'] || 0,
  }))
}

/**
 * Get single service category by ID
 * IMPROVED: Uses service_categories_view with pre-computed counts
 */
export async function getServiceCategoryById(
  id: string
): Promise<ServiceCategory | null> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', session.user['id'])
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.['salon_id']) throw new Error('User salon not found')

  // ✅ FIXED: Query view instead of table
  const { data, error } = await supabase
    .from('service_categories_view')
    .select('*')
    .eq('id', id)
    .eq('salon_id', staffProfile['salon_id'])
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as ServiceCategory
}
