'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  isDefault: z.boolean().optional(),
})

export async function createStockLocation(formData: FormData) {
  try {
    const result = locationSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      isDefault: formData.get('isDefault') === 'true',
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await supabase
        .schema('inventory')
        .from('stock_locations')
        .update({ is_default: false })
        .eq('salon_id', salonId)
    }

    const { error: insertError } = await supabase
      .schema('inventory')
      .from('stock_locations')
      .insert({
        salon_id: salonId,
        name: data.name,
        description: data.description || null,
        is_default: data.isDefault || false,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })

    if (insertError) return { error: insertError.message }

    revalidatePath('/business/inventory/locations')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create location' }
  }
}

export async function updateStockLocation(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const result = locationSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      isDefault: formData.get('isDefault') === 'true',
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await supabase
        .schema('inventory')
        .from('stock_locations')
        .update({ is_default: false })
        .eq('salon_id', salonId)
        .neq('id', id)
    }

    const { error: updateError } = await supabase
      .schema('inventory')
      .from('stock_locations')
      .update({
        name: data.name,
        description: data.description || null,
        is_default: data.isDefault || false,
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .eq('salon_id', salonId)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/inventory/locations')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update location' }
  }
}

export async function deleteStockLocation(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    // Check if location has stock
    const { count } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .select('*', { count: 'exact', head: true })
      .eq('location_id', id)

    if (count && count > 0) {
      return { error: `Cannot delete location with ${count} stock record(s)` }
    }

    const { error: deleteError } = await supabase
      .schema('inventory')
      .from('stock_locations')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .eq('salon_id', salonId)

    if (deleteError) return { error: deleteError.message }

    revalidatePath('/business/inventory/locations')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete location' }
  }
}
