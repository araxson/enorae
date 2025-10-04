'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']
type Staff = Database['public']['Views']['staff']['Row']
type Service = Database['public']['Views']['services']['Row']

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const assignServiceSchema = z.object({
  staffId: z.string().regex(UUID_REGEX),
  serviceId: z.string().regex(UUID_REGEX),
  proficiencyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  priceOverride: z.number().nonnegative().optional(),
  durationOverride: z.number().positive().optional(),
  notes: z.string().max(500).optional().or(z.literal('')),
})

export async function assignServiceToStaff(formData: FormData) {
  try {
    const result = assignServiceSchema.safeParse({
      staffId: formData.get('staffId'),
      serviceId: formData.get('serviceId'),
      proficiencyLevel: formData.get('proficiencyLevel') || undefined,
      priceOverride: formData.get('priceOverride') ? parseFloat(formData.get('priceOverride') as string) : undefined,
      durationOverride: formData.get('durationOverride') ? parseInt(formData.get('durationOverride') as string) : undefined,
      notes: formData.get('notes'),
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    // SECURITY: Require business role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Verify staff belongs to user's salon
    const { data: salon } = await supabase
      .from('salons')
      .select('*')
      .eq('owner_id', session.user.id)
      .single()

    if (!salon) return { error: 'Salon not found' }

    const { data: staff } = await supabase
      .from('staff')
      .select('*')
      .eq('id', data.staffId)
      .single()

    if (!staff || (staff as Staff).salon_id !== (salon as Salon).id) {
      return { error: 'Unauthorized' }
    }

    // Verify service belongs to salon
    const { data: service } = await supabase
      .from('services')
      .select('*')
      .eq('id', data.serviceId)
      .single()

    if (!service || (service as Service).salon_id !== (salon as Salon).id) {
      return { error: 'Service not found' }
    }

    // Check if assignment already exists
    const { data: existing } = await supabase
      .schema('catalog')
      .from('staff_services')
      .select('id, deleted_at')
      .eq('staff_id', data.staffId)
      .eq('service_id', data.serviceId)
      .single()

    if (existing) {
      if (existing.deleted_at) {
        // Restore soft-deleted assignment
        const { error: updateError } = await supabase
          .schema('catalog')
          .from('staff_services')
          .update({
            deleted_at: null,
            proficiency_level: data.proficiencyLevel || null,
            price_override: data.priceOverride || null,
            duration_override: data.durationOverride || null,
            notes: data.notes || null,
            is_available: true,
            updated_by_id: session.user.id,
          })
          .eq('id', existing.id)

        if (updateError) return { error: updateError.message }
      } else {
        return { error: 'Service already assigned to this staff member' }
      }
    } else {
      // Create new assignment
      const { error: insertError } = await supabase
        .schema('catalog')
        .from('staff_services')
        .insert({
          staff_id: data.staffId,
          service_id: data.serviceId,
          proficiency_level: data.proficiencyLevel || null,
          price_override: data.priceOverride || null,
          duration_override: data.durationOverride || null,
          notes: data.notes || null,
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
    const staffId = formData.get('staffId')?.toString()
    const serviceId = formData.get('serviceId')?.toString()

    if (!staffId || !UUID_REGEX.test(staffId)) return { error: 'Invalid staff ID' }
    if (!serviceId || !UUID_REGEX.test(serviceId)) return { error: 'Invalid service ID' }

    const supabase = await createClient()
    // SECURITY: Require business role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Verify staff belongs to user's salon
    const { data: salon } = await supabase
      .from('salons')
      .select('*')
      .eq('owner_id', session.user.id)
      .single()

    if (!salon) return { error: 'Salon not found' }

    const { data: staff } = await supabase
      .from('staff')
      .select('*')
      .eq('id', staffId)
      .single()

    if (!staff || (staff as Staff).salon_id !== (salon as Salon).id) {
      return { error: 'Unauthorized' }
    }

    // Soft delete the assignment
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

    const supabase = await createClient()
    // SECURITY: Require business role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Verify staff belongs to user's salon
    const { data: salon } = await supabase
      .from('salons')
      .select('*')
      .eq('owner_id', session.user.id)
      .single()

    if (!salon) return { error: 'Salon not found' }

    const { data: staff } = await supabase
      .from('staff')
      .select('*')
      .eq('id', staffId)
      .single()

    if (!staff || (staff as Staff).salon_id !== (salon as Salon).id) {
      return { error: 'Unauthorized' }
    }

    // Verify all services belong to salon
    const salonData = salon as Salon
    if (!salonData.id) return { error: 'Invalid salon' }

    const { data: services } = await supabase
      .from('services')
      .select('*')
      .in('id', serviceIds)
      .eq('salon_id', salonData.id)

    if (!services || services.length !== serviceIds.length) {
      return { error: 'Some services do not belong to your salon' }
    }

    // Get existing assignments
    const { data: existing } = await supabase
      .schema('catalog')
      .from('staff_services')
      .select('id, service_id, deleted_at')
      .eq('staff_id', staffId)
      .in('service_id', serviceIds)

    const existingMap = new Map(existing?.map((e) => [e.service_id, e]) || [])

    // Prepare bulk operations
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
        // Skip if already assigned and not deleted
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

    // Execute bulk insert
    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .schema('catalog')
        .from('staff_services')
        .insert(toInsert)

      if (insertError) return { error: insertError.message }
    }

    // Restore soft-deleted assignments
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
