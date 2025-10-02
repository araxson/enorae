import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Favorite = Database['public']['Views']['customer_favorites']['Row']
type Salon = Database['public']['Views']['salons']['Row']

export type FavoriteWithSalon = Favorite & {
  salon: Salon | null
}

export async function getUserFavorites() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('customer_favorites')
    .select(`
      *,
      salon:salon_id(*)
    `)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as FavoriteWithSalon[]
}

export async function checkIsFavorite(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('customer_favorites')
    .select('id')
    .eq('customer_id', user.id)
    .eq('salon_id', salonId)
    .single()

  if (error) return false
  return !!data
}
