'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function toggleFavorite(salonId: string) {
  try {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'You must be logged in to save favorites' }
    }

    // Validate salonId
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    // Check if already favorited
    const { data: existing, error: queryError } = await supabase
      .from('customer_favorites')
      .select('id')
      .eq('customer_id', user.id)
      .eq('salon_id', salonId)
      .maybeSingle()

    if (queryError && queryError.code !== 'PGRST116') {
      throw queryError
    }

    type FavoriteRecord = { id: string }
    const typedExisting = existing as FavoriteRecord | null

    if (typedExisting?.id) {
      // Remove favorite
      const { error } = await supabase
        .schema('engagement')
        .from('customer_favorites')
        .delete()
        .eq('id', typedExisting.id)

      if (error) throw error

      revalidatePath('/profile/favorites')
      revalidatePath('/salons')
      return { success: true, favorited: false }
    } else {
      // Add favorite
      const { error } = await supabase
        .schema('engagement')
        .from('customer_favorites')
        .insert({
          customer_id: user.id,
          salon_id: salonId,
        })

      if (error) throw error

      revalidatePath('/profile/favorites')
      revalidatePath('/salons')
      return { success: true, favorited: true }
    }
  } catch (error) {
    console.error('Toggle favorite error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
