'use server'

import { revalidatePath } from 'next/cache'

import type { Database } from '@/lib/types/database.types'

import { assignServiceSchema } from './constants'
import { getAuthorizedContext, parseUuid } from './helpers'

export async function assignServiceToStaff(formData: FormData) {
  try {
    const result = assignServiceSchema.safeParse({
      staffId: formData.get('staffId'),
      serviceId: formData.get('serviceId'),
      proficiencyLevel: formData.get('proficiencyLevel') || undefined,
      priceOverride: formData.get('priceOverride') ? Number(formData.get('priceOverride')) : undefined,
      durationOverride: formData.get('durationOverride') ? Number(formData.get('durationOverride')) : undefined,
      notes: formData.get('notes'),
    })

    if (!result.success) {
      return { error: result.error.errors[0]?.message ?? 'Invalid form data' }
    }

    const { staffId, serviceId, proficiencyLevel, priceOverride, durationOverride, notes } = result.data

    const context = await getAuthorizedContext(staffId)
    if ('error' in context) {
      return context
    }

    const { supabase, session, salon } = context

    const { data: service } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single()

    if (!service || (service as Database['public']['Views']['services']['Row']).salon_id !== salon.id) {
      return { error: 'Service not found' }
    }

    const { data: existing } = await supabase
      .schema('catalog')
      .from('staff_services')
      .select('id, deleted_at')
      .eq('staff_id', staffId)
      .eq('service_id', serviceId)
      .single()

    if (existing) {
      if (existing.deleted_at) {
        const { error: updateError } = await supabase
          .schema('catalog')
          .from('staff_services')
          .update({
            deleted_at: null,
            proficiency_level: proficiencyLevel || null,
            price_override: priceOverride || null,
            duration_override: durationOverride || null,
            notes: notes || null,
            is_available: true,
            updated_by_id: session.user.id,
          })
          .eq('id', existing.id)

        if (updateError) return { error: updateError.message }
      } else {
        return { error: 'Service already assigned to this staff member' }
      }
    } else {
      const { error: insertError } = await supabase
        .schema('catalog')
        .from('staff_services')
        .insert({
          staff_id: staffId,
          service_id: serviceId,
          proficiency_level: proficiencyLevel || null,
          price_override: priceOverride || null,
          duration_override: durationOverride || null,
          notes: notes || null,
          is_available: true,
          created_by_id: session.user.id,
          updated_by_id: session.user.id,
        })

      if (insertError) return { error: insertError.message }
    }

    revalidatePath('/business/staff')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to assign service' }
  }
}

export async function unassignServiceFromStaff(formData: FormData) {
  try {
    const staffIdResult = await parseUuid(formData.get('staffId'))
    if ('error' in staffIdResult) return { error: 'Invalid staff ID' }

    const serviceIdResult = await parseUuid(formData.get('serviceId'))
    if ('error' in serviceIdResult) return { error: 'Invalid service ID' }

    const { value: staffId } = staffIdResult
    const { value: serviceId } = serviceIdResult

    const context = await getAuthorizedContext(staffId)
    if ('error' in context) {
      return context
    }

    const { supabase, session } = context

    const { error: deleteError } = await supabase
      .schema('catalog')
      .from('staff_services')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('staff_id', staffId)
      .eq('service_id', serviceId)

    if (deleteError) return { error: deleteError.message }

    revalidatePath('/business/staff')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to unassign service' }
  }
}
