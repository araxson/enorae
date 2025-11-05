'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  isPrimary: z.boolean().optional(),
})

type LocationFormState = {
  success?: boolean
  error?: string
  errors?: Record<string, string[]>
}

// useActionState signature: (prevState, formData) => Promise<state>
export async function createSalonLocation(
  prevState: LocationFormState | null,
  formData: FormData
): Promise<LocationFormState> {
  const logger = createOperationLogger('createSalonLocation', {})
  logger.start()

  try {
    const result = locationSchema.safeParse({
      name: formData.get('name'),
      slug: formData.get('slug') || (formData.get('name') as string)?.toLowerCase().replace(/\s+/g, '-'),
      isPrimary: formData.get('isPrimary') === 'true',
    })

    if (!result.success) {
      return {
        error: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      }
    }

    const data = result.data
    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    // If setting as primary, unset other primaries
    if (data.isPrimary) {
      await supabase
        .schema('organization')
        .from('salon_locations')
        .update({ is_primary: false })
        .eq('salon_id', salonId)
    }

    const { error: insertError } = await supabase
      .schema('organization')
      .from('salon_locations')
      .insert({
        salon_id: salonId,
        name: data.name,
        slug: data.slug,
        is_primary: data.isPrimary || false,
        is_active: true,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })

    if (insertError) return { error: insertError.message }

    revalidatePath('/business/locations', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create location' }
  }
}

// useActionState signature: (prevState, formData) => Promise<state>
export async function updateSalonLocation(
  prevState: LocationFormState | null,
  formData: FormData
): Promise<LocationFormState> {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const result = locationSchema.safeParse({
      name: formData.get('name'),
      slug: formData.get('slug'),
      isPrimary: formData.get('isPrimary') === 'true',
    })

    if (!result.success) {
      return {
        error: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      }
    }

    const data = result.data
    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    // If setting as primary, unset other primaries
    if (data.isPrimary) {
      await supabase
        .schema('organization')
        .from('salon_locations')
        .update({ is_primary: false })
        .eq('salon_id', salonId)
        .neq('id', id)
    }

    const { error: updateError } = await supabase
      .schema('organization')
      .from('salon_locations')
      .update({
        name: data.name,
        slug: data.slug,
        is_primary: data.isPrimary || false,
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .eq('salon_id', salonId)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/locations', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update location' }
  }
}

export async function deleteSalonLocation(formData: FormData): Promise<LocationFormState> {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    // Cannot delete primary location
    const { data: location } = await supabase
      .schema('organization')
      .from('salon_locations')
      .select('is_primary')
      .eq('id', id)
      .eq('salon_id', salonId)
      .single<{ is_primary: boolean | null }>()

    if (location?.is_primary) {
      return { error: 'Cannot delete primary location' }
    }

    const { error: deleteError } = await supabase
      .schema('organization')
      .from('salon_locations')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .eq('salon_id', salonId)

    if (deleteError) return { error: deleteError.message }

    revalidatePath('/business/locations', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete location' }
  }
}
