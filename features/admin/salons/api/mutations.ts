'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const updateSalonSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  businessName: z.string().max(200).optional(),
  businessType: z.string().optional(),
})

const updateSettingsSchema = z.object({
  subscriptionTier: z.string().optional(),
  isAcceptingBookings: z.boolean().optional(),
  maxStaff: z.number().int().min(1).optional(),
  maxServices: z.number().int().min(1).optional(),
})

/**
 * Update salon basic info
 * SECURITY: Platform admin only
 */
export async function updateSalon(formData: FormData) {
  try {
    const salonId = formData.get('salonId')?.toString()
    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }

    const result = updateSalonSchema.safeParse({
      name: formData.get('name')?.toString(),
      businessName: formData.get('businessName')?.toString(),
      businessType: formData.get('businessType')?.toString(),
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {
      updated_by_id: session.user.id,
    }

    if (result.data.name) updateData.name = result.data.name
    if (result.data.businessName) updateData.business_name = result.data.businessName
    if (result.data.businessType) updateData.business_type = result.data.businessType

    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update(updateData)
      .eq('id', salonId)

    if (error) return { error: error.message }

    revalidatePath('/admin/salons')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update salon',
    }
  }
}

/**
 * Update salon settings
 * SECURITY: Platform admin only
 */
export async function updateSalonSettings(formData: FormData) {
  try {
    const salonId = formData.get('salonId')?.toString()
    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }

    const result = updateSettingsSchema.safeParse({
      subscriptionTier: formData.get('subscriptionTier')?.toString(),
      isAcceptingBookings: formData.get('isAcceptingBookings') === 'true',
      maxStaff: formData.get('maxStaff')
        ? parseInt(formData.get('maxStaff') as string)
        : undefined,
      maxServices: formData.get('maxServices')
        ? parseInt(formData.get('maxServices') as string)
        : undefined,
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    // SECURITY: Require platform admin
    await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {}

    if (result.data.subscriptionTier)
      updateData.subscription_tier = result.data.subscriptionTier
    if (result.data.isAcceptingBookings !== undefined)
      updateData.is_accepting_bookings = result.data.isAcceptingBookings
    if (result.data.maxStaff) updateData.max_staff = result.data.maxStaff
    if (result.data.maxServices) updateData.max_services = result.data.maxServices

    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update(updateData)
      .eq('salon_id', salonId)

    if (error) return { error: error.message }

    revalidatePath('/admin/salons')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update settings',
    }
  }
}

/**
 * Suspend salon (soft delete)
 * SECURITY: Platform admin only
 */
export async function suspendSalon(formData: FormData) {
  try {
    const salonId = formData.get('salonId')?.toString()
    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    // Soft delete salon
    const { error: salonError } = await supabase
      .schema('organization')
      .from('salons')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', salonId)

    if (salonError) return { error: salonError.message }

    // Stop accepting bookings
    await supabase
      .schema('organization')
      .from('salon_settings')
      .update({ is_accepting_bookings: false })
      .eq('salon_id', salonId)

    revalidatePath('/admin/salons')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to suspend salon',
    }
  }
}

/**
 * Reactivate suspended salon
 * SECURITY: Platform admin only
 */
export async function reactivateSalon(formData: FormData) {
  try {
    const salonId = formData.get('salonId')?.toString()
    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update({
        deleted_at: null,
        updated_by_id: session.user.id,
      })
      .eq('id', salonId)

    if (error) return { error: error.message }

    revalidatePath('/admin/salons')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to reactivate salon',
    }
  }
}

/**
 * Transfer salon ownership
 * SECURITY: Platform admin only
 */
export async function transferSalonOwnership(formData: FormData) {
  try {
    const salonId = formData.get('salonId')?.toString()
    const newOwnerId = formData.get('newOwnerId')?.toString()

    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }
    if (!newOwnerId || !UUID_REGEX.test(newOwnerId)) {
      return { error: 'Invalid new owner ID' }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update({
        owner_id: newOwnerId,
        updated_by_id: session.user.id,
      })
      .eq('id', salonId)

    if (error) return { error: error.message }

    revalidatePath('/admin/salons')
    return { success: true }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'Failed to transfer ownership',
    }
  }
}
