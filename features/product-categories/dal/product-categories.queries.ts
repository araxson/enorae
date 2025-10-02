import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: product_categories doesn't have public view yet

type ProductCategory = Database['public']['Views']['product_categories']['Row']

export type ProductCategoryWithCounts = ProductCategory & {
  product_count?: number
}

/**
 * Get all product categories for the user's salon
 */
export async function getProductCategories(): Promise<ProductCategoryWithCounts[]> {
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
    .from('product_categories')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) throw error

  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    (data || []).map(async (category) => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .is('deleted_at', null)

      return {
        ...category,
        product_count: count || 0,
      }
    })
  )

  return categoriesWithCounts
}

/**
 * Get single product category by ID
 */
export async function getProductCategoryById(
  id: string
): Promise<ProductCategory | null> {
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
    .from('product_categories')
    .select('*')
    .eq('id', id)
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}
