import 'server-only'

import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { CustomerFavoriteView } from '@/features/customer/favorites'

const FAVORITES_LIMIT = 10

export async function getFavorites(): Promise<CustomerFavoriteView[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customer_favorites')
    .select('*')
    .eq('customer_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(FAVORITES_LIMIT)

  if (error) throw error

  return (data ?? []) as CustomerFavoriteView[]
}
