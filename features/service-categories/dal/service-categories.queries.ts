import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: service_categories doesn't have public view yet

type ServiceCategory = Database['public']['Views']['service_categories']['Row']

export type ServiceCategoryWithCounts = ServiceCategory & {
  service_count?: number
}

/**
 * Get all service categories for the user's salon
 */
export async function getServiceCategories(): Promise<ServiceCategoryWithCounts[]> {
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
    .from('service_categories')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error

  // Get service counts for each category
  const categoriesWithCounts = await Promise.all(
    (data || []).map(async (category) => {
      const { count } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .is('deleted_at', null)

      return {
        ...category,
        service_count: count || 0,
      }
    })
  )

  return categoriesWithCounts
}

/**
 * Get single service category by ID
 */
export async function getServiceCategoryById(
  id: string
): Promise<ServiceCategory | null> {
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
    .from('service_categories')
    .select('*')
    .eq('id', id)
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}
