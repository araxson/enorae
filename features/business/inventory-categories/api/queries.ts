import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// COMPLIANCE: Use public view types for SELECTs
type ProductCategory = Database['public']['Views']['product_categories']['Row']

export type ProductCategoryWithCounts = ProductCategory & {
  product_count?: number
}

/**
 * Get all product categories for the user's salon
 */
export async function getProductCategories(): Promise<ProductCategoryWithCounts[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('salon_id', salonId)
    .order('name', { ascending: true })

  if (error) throw error

  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    (data || []).map(async (category: ProductCategory) => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id!)

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
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('id', id)
    .eq('salon_id', salonId)
    .single()

  if (error) throw error
  return data
}