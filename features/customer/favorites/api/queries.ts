import 'server-only';
'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type FavoriteRow = Database['engagement']['Tables']['customer_favorites']['Row']
type AdminSalon = Database['public']['Views']['admin_salons_overview']['Row']

export type FavoriteWithSalon = FavoriteRow & {
  salon: Pick<AdminSalon, 'id' | 'name' | 'slug' | 'business_name' | 'business_type' | 'is_accepting_bookings'> | null
}

export async function getUserFavorites() {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()
  const engagement = supabase.schema('engagement')

  const { data, error } = await engagement
    .from('customer_favorites')
    .select('id, salon_id, notes, created_at, updated_at, customer_id, service_id, staff_id')
    .eq('customer_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  const favorites = (data || []) as FavoriteRow[]

  const salonIds = Array.from(
    new Set(favorites.map((favorite) => favorite.salon_id).filter((id): id is string => Boolean(id)))
  )

  let salonMap = new Map<string, FavoriteWithSalon['salon']>()

  if (salonIds.length > 0) {
    const { data: salonRows, error: salonError } = await supabase
      .from('admin_salons_overview')
      .select('id, name, slug, business_name, business_type, is_accepting_bookings')
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
  if (!session.user) return false

  // OPTIMIZED: Use head: true to check existence without fetching data
  const engagement = supabase.schema('engagement')

  const { count } = await engagement
    .from('customer_favorites')
    .select('id', { count: 'exact', head: true })
    .eq('customer_id', session.user.id)
    .eq('salon_id', salonId)

  return (count ?? 0) > 0
}
