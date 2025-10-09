import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { CustomerFavoriteView } from '@/lib/types/app.types'

const FAVORITES_LIMIT = 10

type FavoriteRecord = {
  id: string
  salon_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  customer_id: string
  service_id: string | null
  staff_id: string | null
}

type FavoriteSalon = {
  id: string | null
  name: string | null
  business_name: string | null
  category_name: string | null
  currency_code: string | null
  status: string | null
}

export async function getFavorites(): Promise<CustomerFavoriteView[]> {
  const session = await requireAuth()
  const supabase = await createClient()
  const engagement = supabase.schema('engagement')

  const { data, error } = await engagement
    .from('customer_favorites')
    .select('id, salon_id, notes, created_at, updated_at, customer_id, service_id, staff_id')
    .eq('customer_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(FAVORITES_LIMIT)

  if (error) throw error

  const favorites = (data || []) as FavoriteRecord[]
  const salonIds = Array.from(
    new Set(favorites.map((favorite) => favorite.salon_id).filter((id): id is string => Boolean(id)))
  )

  let salonMap = new Map<string, FavoriteSalon>()

  if (salonIds.length > 0) {
    const { data: salonRows, error: salonError } = await supabase
      .from('admin_salons_overview')
      .select('id, name, business_name, category_name, currency_code, status')
      .in('id', salonIds)

    if (salonError) throw salonError

    const typedSalons = (salonRows || []) as FavoriteSalon[]
    salonMap = new Map(typedSalons.map((salon) => [salon.id ?? '', salon]))
  }

  return favorites.map((favorite) => {
    const salon = favorite.salon_id ? salonMap.get(favorite.salon_id) : undefined

    return {
      ...favorite,
      business_name: salon?.business_name ?? null,
      category_name: salon?.category_name ?? null,
      currency_code: salon?.currency_code ?? null,
      customer_email: null,
      customer_name: null,
      salon_name: salon?.name ?? null,
      service_name: null,
      staff_name: null,
      staff_title: null,
    } satisfies CustomerFavoriteView
  })
}
