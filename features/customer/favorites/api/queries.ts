import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type FavoriteRow = Database['public']['Views']['customer_favorites_view']['Row']
type SalonView = Database['public']['Views']['salons_view']['Row']

export type FavoriteWithSalon = FavoriteRow & {
  salon: Pick<SalonView, 'id' | 'name' | 'slug' | 'rating_average' | 'rating_count' | 'formatted_address' | 'is_accepting_bookings'> | null
}

export async function getUserFavorites() {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customer_favorites_view')
    .select(`
      *,
      salon:salon_id (
        id,
        name,
        slug,
        rating_average,
        rating_count,
        formatted_address,
        is_accepting_bookings
      )
    `)
    .eq('customer_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []) as FavoriteWithSalon[]
}

export async function checkIsFavorite(salonId: string) {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()
  // OPTIMIZED: Use head: true to check existence without fetching data
  const { count, error } = await supabase
    .from('customer_favorites_view')
    .select('id', { count: 'exact', head: true })
    .eq('customer_id', session.user.id)
    .eq('salon_id', salonId)

  if (error) throw error
  return (count ?? 0) > 0
}
