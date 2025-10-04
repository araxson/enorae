'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const favoriteSchema = z.object({
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID format'),
  notes: z.string().max(500).optional().nullable(),
})

export async function toggleFavorite(salonId: string, notes?: string | null) {
  try {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'You must be logged in to save favorites' }
    }

    // Validate input
    const validation = favoriteSchema.safeParse({ salonId, notes })
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    // Check if already favorited
    const { data: existing, error: queryError } = await supabase
      .from('customer_favorites')
      .select('id, notes')
      .eq('customer_id', user.id)
      .eq('salon_id', salonId)
      .maybeSingle()

    if (queryError && queryError.code !== 'PGRST116') {
      throw queryError
    }

    type FavoriteRecord = { id: string; notes: string | null }
    const typedExisting = existing as FavoriteRecord | null

    if (typedExisting?.id) {
      // If notes provided, update the favorite instead of removing
      if (notes !== undefined) {
        const { error } = await supabase
          .schema('engagement')
          .from('customer_favorites')
          .update({
            notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', typedExisting.id)
          .eq('customer_id', user.id)

        if (error) throw error

        revalidatePath('/customer/favorites')
        revalidatePath('/customer/salons')
        return { success: true, favorited: true }
      } else {
        // Remove favorite - SECURITY: Verify ownership
        const { error } = await supabase
          .schema('engagement')
          .from('customer_favorites')
          .delete()
          .eq('id', typedExisting.id)
          .eq('customer_id', user.id)

        if (error) throw error

        revalidatePath('/customer/favorites')
        revalidatePath('/customer/salons')
        return { success: true, favorited: false }
      }
    } else {
      // Add favorite
      const { error } = await supabase
        .schema('engagement')
        .from('customer_favorites')
        .insert({
          customer_id: user.id,
          salon_id: salonId,
          notes: notes || null,
        })

      if (error) throw error

      revalidatePath('/customer/favorites')
      revalidatePath('/customer/salons')
      return { success: true, favorited: true }
    }
  } catch (error) {
    console.error('Toggle favorite error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
