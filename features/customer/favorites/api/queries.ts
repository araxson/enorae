import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Favorite = Database['public']['Views']['customer_favorites']['Row']
type Salon = Database['public']['Views']['salons']['Row']

export type FavoriteWithSalon = Favorite & {
  salon: Salon | null
}

export const getUserFavorites = cache(async () => {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customer_favorites')
    .select(`
      *,
      salon:salon_id(*)
    `)
    .eq('customer_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as FavoriteWithSalon[]
})

export async function checkIsFavorite(salonId: string) {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()
  if (!session.user) return false

  // OPTIMIZED: Use head: true to check existence without fetching data
  const { count } = await supabase
    .from('customer_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', session.user.id)
    .eq('salon_id', salonId)

  return (count ?? 0) > 0
}
