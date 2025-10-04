import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type ProductUsage = Database['inventory']['Tables']['product_usage']['Row']

export type ProductUsageWithDetails = ProductUsage & {
  product?: {
    id: string
    name: string
    sku: string | null
  } | null
  appointment?: {
    id: string
    scheduled_at: string
  } | null
  staff?: {
    id: string
    full_name: string | null
  } | null
}

/**
 * Get product usage records for the user's salon
 */
export async function getProductUsage(limit = 100): Promise<ProductUsageWithDetails[]> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('product_usage')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .order('used_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  // Get related data for each usage record
  const usageWithDetails = await Promise.all(
    (data || []).map(async (usage: ProductUsage) => {
      // Get product
      const { data: product } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('id', usage.product_id!)
        .single()

      // Get appointment if exists
      let appointment = null
      if (usage.appointment_id) {
        const { data: apt } = await supabase
          .from('appointments')
          .select('id, scheduled_at')
          .eq('id', usage.appointment_id)
          .single()
        appointment = apt
      }

      // Get staff if exists
      let staff = null
      if (usage.performed_by_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', usage.performed_by_id)
          .single()
        staff = profile
      }

      return {
        ...usage,
        product,
        appointment,
        staff,
      }
    })
  )

  return usageWithDetails
}

/**
 * Get product usage for a specific product
 */
export async function getProductUsageByProduct(
  productId: string,
  limit = 50
): Promise<ProductUsageWithDetails[]> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('product_usage')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .eq('product_id', productId)
    .order('used_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  const usageWithDetails = await Promise.all(
    (data || []).map(async (usage: ProductUsage) => {
      const { data: product } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('id', usage.product_id!)
        .single()

      let appointment = null
      if (usage.appointment_id) {
        const { data: apt } = await supabase
          .from('appointments')
          .select('id, scheduled_at')
          .eq('id', usage.appointment_id)
          .single()
        appointment = apt
      }

      let staff = null
      if (usage.performed_by_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', usage.performed_by_id)
          .single()
        staff = profile
      }

      return {
        ...usage,
        product,
        appointment,
        staff,
      }
    })
  )

  return usageWithDetails
}
