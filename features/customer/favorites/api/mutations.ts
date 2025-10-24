'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { favoriteSchema } from '@/lib/validations/customer/favorites'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function toggleFavorite(
  salonId: string,
  notes?: string | null
): Promise<ActionResponse<{ favorited: boolean }>> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()
    const engagement = supabase.schema('engagement')

    // Validate input
    const validation = favoriteSchema.safeParse({ salonId, notes })
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message }
    }

    const { salonId: validatedSalonId, notes: validatedNotes } = validation.data

    // Check if already favorited
    const { data: existing, error: queryError } = await supabase
      .from('customer_favorites_view')
      .select('id, notes')
      .eq('customer_id', session.user.id)
      .eq('salon_id', validatedSalonId)
      .maybeSingle()

    if (queryError && queryError.code !== 'PGRST116') {
      throw queryError
    }

    type FavoriteRecord = { id: string; notes: string | null }
    const typedExisting = existing as FavoriteRecord | null

    if (typedExisting?.id) {
      // If notes provided, update the favorite instead of removing
      if (validatedNotes !== undefined) {
        const { error } = await engagement
          .from('customer_favorites')
          .update({
            notes: validatedNotes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', typedExisting.id)
          .eq('customer_id', session.user.id)

        if (error) throw error

        revalidatePath('/customer/favorites')
        revalidatePath('/customer/salons')
        return { success: true, data: { favorited: true } }
      }

      // Remove favorite - SECURITY: Verify ownership
      const { error } = await engagement
        .from('customer_favorites')
        .delete()
        .eq('id', typedExisting.id)
        .eq('customer_id', session.user.id)

      if (error) throw error

      revalidatePath('/customer/favorites')
      revalidatePath('/customer/salons')
      return { success: true, data: { favorited: false } }
    }

    // Add favorite
    const { error } = await engagement
      .from('customer_favorites')
      .insert({
        customer_id: session.user.id,
        salon_id: validatedSalonId,
        notes: validatedNotes || null,
      })

    if (error) throw error

    revalidatePath('/customer/favorites')
    revalidatePath('/customer/salons')
    return { success: true, data: { favorited: true } }
  } catch (error) {
    console.error('Toggle favorite error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Add a salon to favorites
 * Enforces single favorite per salon per customer
 */
export async function addToFavorites(salonId: string): Promise<ActionResponse> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { success: false, error: 'Invalid salon ID format' }
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('customer_favorites_view')
      .select('id')
      .eq('customer_id', session.user.id)
      .eq('salon_id', salonId)
      .maybeSingle()

    if (existing) {
      return { success: false, error: 'Salon is already in your favorites' }
    }

    // Add to favorites
    const { error } = await supabase
      .schema('engagement')
      .from('customer_favorites')
      .insert({
        customer_id: session.user.id,
        salon_id: salonId,
        created_at: new Date().toISOString(),
        created_by_id: session.user.id,
      })

    if (error) throw error

    revalidatePath('/customer/favorites')
    revalidatePath('/customer/salons')
    revalidatePath(`/customer/salons/${salonId}`)

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add to favorites',
    }
  }
}

/**
 * Remove a salon from favorites
 * Verifies ownership before deletion
 */
export async function removeFromFavorites(favoriteId: string): Promise<ActionResponse> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Verify ownership
    type Favorite = { customer_id: string; salon_id: string | null }
    const { data: favorite, error: fetchError } = await supabase
      .from('customer_favorites_view')
      .select('customer_id, salon_id')
      .eq('id', favoriteId)
      .returns<Favorite[]>()
      .single()

    if (fetchError) throw fetchError

    if (!favorite) {
      return { success: false, error: 'Favorite not found' }
    }

    if (favorite.customer_id !== session.user.id) {
      return { success: false, error: 'Not authorized to remove this favorite' }
    }

    // Remove from favorites
    const { error } = await supabase
      .schema('engagement')
      .from('customer_favorites')
      .delete()
      .eq('id', favoriteId)
      .eq('customer_id', session.user.id) // Security check

    if (error) throw error

    revalidatePath('/customer/favorites')
    revalidatePath('/customer/salons')
    if (favorite.salon_id) {
      revalidatePath(`/customer/salons/${favorite.salon_id}`)
    }

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove from favorites',
    }
  }
}
