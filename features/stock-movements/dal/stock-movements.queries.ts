import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: stock_movements doesn't have public view yet

type StockMovement = Database['public']['Views']['stock_movements']['Row']

export type StockMovementWithDetails = StockMovement & {
  product?: {
    id: string
    name: string
    sku: string | null
  } | null
  from_location?: {
    id: string
    name: string
  } | null
  to_location?: {
    id: string
    name: string
  } | null
  performed_by?: {
    id: string
    full_name: string | null
  } | null
}

/**
 * Get all stock movements for the user's salon
 */
export async function getStockMovements(limit = 100): Promise<StockMovementWithDetails[]> {
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
    .from('stock_movements')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  // Get related data for each movement
  const movementsWithDetails = await Promise.all(
    (data || []).map(async (movement) => {
      // Get product
      const { data: product } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('id', movement.product_id)
        .single()

      // Get from location
      let fromLocation = null
      if (movement.from_location_id) {
        const { data: loc } = await supabase
          .from('stock_locations')
          .select('id, name')
          .eq('id', movement.from_location_id)
          .single()
        fromLocation = loc
      }

      // Get to location
      let toLocation = null
      if (movement.to_location_id) {
        const { data: loc } = await supabase
          .from('stock_locations')
          .select('id, name')
          .eq('id', movement.to_location_id)
          .single()
        toLocation = loc
      }

      // Get performed by user
      let performedBy = null
      if (movement.performed_by_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', movement.performed_by_id)
          .single()
        performedBy = profile
      }

      return {
        ...movement,
        product,
        from_location: fromLocation,
        to_location: toLocation,
        performed_by: performedBy,
      }
    })
  )

  return movementsWithDetails
}

/**
 * Get stock movements for a specific product
 */
export async function getStockMovementsByProduct(
  productId: string,
  limit = 50
): Promise<StockMovementWithDetails[]> {
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
    .from('stock_movements')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  // Get related data
  const movementsWithDetails = await Promise.all(
    (data || []).map(async (movement) => {
      const { data: product } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('id', movement.product_id)
        .single()

      let fromLocation = null
      if (movement.from_location_id) {
        const { data: loc } = await supabase
          .from('stock_locations')
          .select('id, name')
          .eq('id', movement.from_location_id)
          .single()
        fromLocation = loc
      }

      let toLocation = null
      if (movement.to_location_id) {
        const { data: loc } = await supabase
          .from('stock_locations')
          .select('id, name')
          .eq('id', movement.to_location_id)
          .single()
        toLocation = loc
      }

      let performedBy = null
      if (movement.performed_by_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', movement.performed_by_id)
          .single()
        performedBy = profile
      }

      return {
        ...movement,
        product,
        from_location: fromLocation,
        to_location: toLocation,
        performed_by: performedBy,
      }
    })
  )

  return movementsWithDetails
}
