import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

export function getCustomerSalonMeta() {
  return {
    defaultSpecialties: ['color', 'styling', 'bridal'],
    socialLinks: ['instagram', 'facebook', 'tiktok'],
  }
}

export interface FavoriteShortcut {
  name: string
  url: string
  salonId?: string
}

export async function getCustomerFavoritesSummary(userId: string): Promise<FavoriteShortcut[]> {
  // SECURITY: Verify the authenticated user matches the requested userId
  const session = await requireAuth()
  if (session.user.id !== userId) {
    throw new Error('Unauthorized: Cannot access favorites for another user')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customer_favorites_view')
    .select('salon_id, salon_name, salon_slug')
    .eq('customer_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error

  type FavoriteEntry = {
    salon_id: string | null
    salon_name: string | null
    salon_slug: string | null
  }

  const entries = (data ?? []) as FavoriteEntry[]
  const shortcuts: FavoriteShortcut[] = []

  for (const entry of entries) {
    if (!entry.salon_id) continue

    const slugOrId = entry.salon_slug ?? entry.salon_id
    const url = `/customer/salons/${slugOrId}`

    shortcuts.push({
      name: entry.salon_name ?? 'Favorite Salon',
      url,
      salonId: entry.salon_id,
    })
  }

  return shortcuts
}
