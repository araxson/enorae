import 'server-only'

import { createClient } from '@/lib/supabase/server'

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
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customer_favorites')
    .select(
      `
        salon_id,
        salons:salon_id (
          id,
          name,
          slug
        )
      `,
    )
    .eq('customer_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error

  return (data ?? [])
    .map((entry) => {
      const salon = entry.salons
      if (!salon?.id) return null

      const slugOrId = salon.slug ?? salon.id
      const url = `/customer/salons/${slugOrId}`

      return {
        name: salon.name ?? 'Favorite Salon',
        url,
        salonId: salon.id ?? undefined,
      } satisfies FavoriteShortcut
    })
    .filter((shortcut): shortcut is FavoriteShortcut => Boolean(shortcut))
}
