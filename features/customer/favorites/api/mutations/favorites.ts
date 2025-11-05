'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { favoriteSchema } from '@/features/customer/favorites/api/validation'
import { UUID_REGEX } from '@/lib/validations/shared'
import { createOperationLogger, logError } from '@/lib/observability'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function toggleFavorite(
  salonId: string,
  notes?: string | null
): Promise<ActionResponse<{ favorited: boolean }>> {
  const logger = createOperationLogger('toggleFavorite', { salonId })

  try {
    const session = await requireAuth()
    const supabase = await createClient()
    const engagement = supabase.schema('engagement')

    logger.start({ salonId, userId: session.user.id, hasNotes: Boolean(notes) })

    // Validate input
    const validation = favoriteSchema.safeParse({ salonId, notes })
    if (!validation.success) {
      logger.error('Validation failed', 'validation', { salonId, userId: session.user.id })
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors
      }
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
      logger.error(queryError, 'database', { salonId: validatedSalonId, userId: session.user.id })
      throw queryError
    }

    type FavoriteRecord = { id: string; notes: string | null }
    const typedExisting = existing as unknown as FavoriteRecord | null

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

        if (error) {
          logger.error(error, 'database', { favoriteId: typedExisting.id, salonId: validatedSalonId, userId: session.user.id })
          throw error
        }

        revalidatePath('/customer/favorites', 'page')
        revalidatePath('/customer/salons', 'page')

        logger.success({ favoriteId: typedExisting.id, salonId: validatedSalonId, userId: session.user.id, action: 'updated' })
        return { success: true, data: { favorited: true } }
      }

      // Remove favorite - SECURITY: Verify ownership
      const { error } = await engagement
        .from('customer_favorites')
        .delete()
        .eq('id', typedExisting.id)
        .eq('customer_id', session.user.id)

      if (error) {
        logger.error(error, 'database', { favoriteId: typedExisting.id, salonId: validatedSalonId, userId: session.user.id })
        throw error
      }

      revalidatePath('/customer/favorites', 'page')
      revalidatePath('/customer/salons', 'page')

      logger.success({ favoriteId: typedExisting.id, salonId: validatedSalonId, userId: session.user.id, action: 'removed' })
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

    if (error) {
      logger.error(error, 'database', { salonId: validatedSalonId, userId: session.user.id })
      throw error
    }

    revalidatePath('/customer/favorites', 'page')
    revalidatePath('/customer/salons', 'page')

    logger.success({ salonId: validatedSalonId, userId: session.user.id, action: 'added' })
    return { success: true, data: { favorited: true } }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { salonId })
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
  const logger = createOperationLogger('addToFavorites', { salonId })

  try {
    const session = await requireAuth()
    const supabase = await createClient()

    logger.start({ salonId, userId: session.user.id })

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      logger.error('Invalid salon ID format', 'validation', { salonId, userId: session.user.id })
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
      logger.warn('Salon already in favorites', { salonId, userId: session.user.id })
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

    if (error) {
      logger.error(error, 'database', { salonId, userId: session.user.id })
      throw error
    }

    revalidatePath('/customer/favorites', 'page')
    revalidatePath('/customer/salons', 'page')
    revalidatePath(`/customer/salons/${salonId}`, 'page')

    logger.success({ salonId, userId: session.user.id })
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { salonId })
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
  const logger = createOperationLogger('removeFromFavorites', { favoriteId })

  try {
    const session = await requireAuth()
    const supabase = await createClient()

    logger.start({ favoriteId, userId: session.user.id })

    // Verify ownership
    type Favorite = { customer_id: string; salon_id: string | null }
    const { data: favorite, error: fetchError } = await supabase
      .from('customer_favorites_view')
      .select('customer_id, salon_id')
      .eq('id', favoriteId)
      .returns<Favorite[]>()
      .single()

    if (fetchError) {
      logger.error(fetchError, 'database', { favoriteId, userId: session.user.id })
      throw fetchError
    }

    if (!favorite) {
      logger.error('Favorite not found', 'not_found', { favoriteId, userId: session.user.id })
      return { success: false, error: 'Favorite not found' }
    }

    if (favorite.customer_id !== session.user.id) {
      logger.error('Unauthorized removal attempt', 'permission', { favoriteId, userId: session.user.id, ownerId: favorite.customer_id })
      return { success: false, error: 'Not authorized to remove this favorite' }
    }

    // Remove from favorites
    const { error } = await supabase
      .schema('engagement')
      .from('customer_favorites')
      .delete()
      .eq('id', favoriteId)
      .eq('customer_id', session.user.id) // Security check

    if (error) {
      logger.error(error, 'database', { favoriteId, salonId: favorite.salon_id ?? undefined, userId: session.user.id })
      throw error
    }

    revalidatePath('/customer/favorites', 'page')
    revalidatePath('/customer/salons', 'page')
    if (favorite.salon_id) {
      revalidatePath(`/customer/salons/${favorite.salon_id}`, 'page')
    }

    logger.success({ favoriteId, salonId: favorite.salon_id, userId: session.user.id })
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { favoriteId })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove from favorites',
    }
  }
}
