'use server'

import { revalidatePath } from 'next/cache'

import { UUID_REGEX } from './constants'
import { getAuthorizedContext } from './helpers'

export async function bulkAssignServices(formData: FormData) {
  try {
    const staffId = formData.get('staffId')?.toString()
    const serviceIdsJson = formData.get('serviceIds')?.toString()

    if (!staffId || !UUID_REGEX.test(staffId)) return { error: 'Invalid staff ID' }
    if (!serviceIdsJson) return { error: 'No services provided' }

    const serviceIds = JSON.parse(serviceIdsJson) as string[]
    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return { error: 'Invalid service IDs' }
    }

    if (!serviceIds.every((id) => UUID_REGEX.test(id))) {
      return { error: 'Invalid service ID format' }
    }

    const context = await getAuthorizedContext(staffId)
    if ('error' in context) {
      return context
    }

    const { supabase, session, salon } = context

    if (!salon.id) {
      return { error: 'Invalid salon' }
    }

    const { data: services } = await supabase
      .from('services')
      .select('*')
      .in('id', serviceIds)
      .eq('salon_id', salon.id)

    if (!services || services.length !== serviceIds.length) {
      return { error: 'Some services do not belong to your salon' }
    }

    const { data: existing } = await supabase
      .schema('catalog')
      .from('staff_services')
      .select('id, service_id, deleted_at')
      .eq('staff_id', staffId)
      .in('service_id', serviceIds)

    const existingMap = new Map(existing?.map((assignment) => [assignment.service_id, assignment]) || [])

    const toInsert: Array<{
      staff_id: string
      service_id: string
      is_available: boolean
      created_by_id: string
      updated_by_id: string
    }> = []

    const toRestore: string[] = []

    for (const serviceId of serviceIds) {
      const existingAssignment = existingMap.get(serviceId)

      if (existingAssignment) {
        if (existingAssignment.deleted_at) {
          toRestore.push(existingAssignment.id)
        }
      } else {
        toInsert.push({
          staff_id: staffId,
          service_id: serviceId,
          is_available: true,
          created_by_id: session.user.id,
          updated_by_id: session.user.id,
        })
      }
    }

    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .schema('catalog')
        .from('staff_services')
        .insert(toInsert)

      if (insertError) return { error: insertError.message }
    }

    if (toRestore.length > 0) {
      const { error: restoreError } = await supabase
        .schema('catalog')
        .from('staff_services')
        .update({
          deleted_at: null,
          is_available: true,
          updated_by_id: session.user.id,
        })
        .in('id', toRestore)

      if (restoreError) return { error: restoreError.message }
    }

    revalidatePath('/business/staff')
    return { success: true, assigned: toInsert.length + toRestore.length }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to assign services' }
  }
}
