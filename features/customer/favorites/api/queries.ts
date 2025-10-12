import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type FavoriteRow = Database['public']['Views']['customer_favorites']['Row']

type SalonView = Database['public']['Views']['salons']['Row']

export type FavoriteWithSalon = FavoriteRow & {
  salon: Pick<SalonView, 'id' | 'name' | 'slug' | 'rating' | 'review_count' | 'full_address' | 'logo_url' | 'is_accepting_bookings'> | null
}

export async function getUserFavorites() {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customer_favorites')
    .select('*')
    .eq('customer_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  const favorites: FavoriteRow[] = data ?? []

  const salonIds = Array.from(
    new Set(favorites.map((favorite) => favorite.salon_id).filter((id): id is string => Boolean(id)))
  )

  let salonMap = new Map<string, FavoriteWithSalon['salon']>()

  if (salonIds.length > 0) {
    const { data: salonRows, error: salonError } = await supabase
      .from('salons')
      .select('id, name, slug, rating, review_count, full_address, logo_url, is_accepting_bookings')
      .in('id', salonIds)

    if (salonError) throw salonError

    const typedSalons = (salonRows || []) as FavoriteWithSalon['salon'][]
    salonMap = new Map(
      typedSalons
        .filter((salon): salon is FavoriteWithSalon['salon'] => Boolean(salon?.id))
        .map((salon) => [salon!.id!, salon])
    )
  }

  const enrichedFavorites = favorites.map((favorite) => ({
    ...favorite,
    salon: favorite.salon_id ? salonMap.get(favorite.salon_id) ?? null : null,
  })) as FavoriteWithSalon[]

  return enrichedFavorites
}

export async function checkIsFavorite(salonId: string) {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()
  // OPTIMIZED: Use head: true to check existence without fetching data
  const { count, error } = await supabase
    .from('customer_favorites')
    .select('id', { count: 'exact', head: true })
    .eq('customer_id', session.user.id)
    .eq('salon_id', salonId)

  if (error) throw error
  return (count ?? 0) > 0
}