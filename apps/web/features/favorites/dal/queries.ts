import { createClient } from '@/lib/supabase/client'

export async function getFavorites() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      salons!inner(
        id,
        name,
        slug,
        logo_url,
        rating
      )
    `)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function isFavorited(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('customer_id', user.id)
    .eq('salon_id', salonId)
    .single()

  return !!data
}