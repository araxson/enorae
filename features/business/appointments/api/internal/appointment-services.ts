'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getUserSalonIds, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type MutationResult = { success: true } | { error: string; info?: string }
type AppointmentServiceUpdateRow = Database['scheduling']['Tables']['appointment_services']['Update']

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const addServiceSchema = z.object({
  appointmentId: z.string().regex(UUID_REGEX),
  serviceId: z.string().regex(UUID_REGEX),
  staffId: z.string().regex(UUID_REGEX).optional().nullable(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  durationMinutes: z.number().positive().optional(),
})

const updateServiceSchema = z.object({
  appointmentServiceId: z.string().regex(UUID_REGEX),
  staffId: z.string().regex(UUID_REGEX).optional().nullable(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  durationMinutes: z.number().positive().optional(),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).optional(),
})

const removeServiceSchema = z.object({
  appointmentServiceId: z.string().regex(UUID_REGEX),
})

const updateServiceStatusSchema = z.object({
  appointmentServiceId: z.string().regex(UUID_REGEX),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
})

/**
 * Add a service to an existing appointment
 */
export async function addServiceToAppointment(formData: FormData): Promise<MutationResult> {
  try {
    const parsed = addServiceSchema.safeParse({
      appointmentId: formData.get('appointmentId'),
      serviceId: formData.get('serviceId'),
      staffId: formData.get('staffId') || null,
      startTime: formData.get('startTime') || undefined,
      endTime: formData.get('endTime') || undefined,
      durationMinutes: formData.get('durationMinutes')
        ? parseInt(formData.get('durationMinutes') as string, 10)
        : undefined,
    })

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message }
    }

    const data = parsed.data
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()
    const accessibleSalonIds = await getUserSalonIds()

    const { data: appointment, error: apptError } = await supabase
      .from('appointments')
      .select('id, salon_id')
      .eq('id', data.appointmentId)
      .in('salon_id', accessibleSalonIds)
      .single()

    if (apptError || !appointment) {
      return { error: 'Appointment not found or unauthorized' }
    }

    const { error: insertError } = await supabase
      .schema('scheduling')
      .from('appointment_services')
      .insert({
        appointment_id: data.appointmentId,
        service_id: data.serviceId,
        staff_id: data.staffId ?? null,
        start_time: data.startTime ?? null,
        end_time: data.endTime ?? null,
        duration_minutes: data.durationMinutes ?? null,
        status: 'pending',
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })

    if (insertError) {
      return { error: insertError.message }
    }

    revalidatePath('/business/appointments')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to add service to appointment',
    }
  }
}

/**
 * Update an appointment service
 */
export async function updateAppointmentService(formData: FormData): Promise<MutationResult> {
  try {
    const parsed = updateServiceSchema.safeParse({
      appointmentServiceId: formData.get('appointmentServiceId'),
      staffId: formData.get('staffId') || null,
      startTime: formData.get('startTime') || undefined,
      endTime: formData.get('endTime') || undefined,
      durationMinutes: formData.get('durationMinutes')
        ? parseInt(formData.get('durationMinutes') as string, 10)
        : undefined,
      status: formData.get('status') || undefined,
    })

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message }
    }

    const data = parsed.data
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()
    const accessibleSalonIds = await getUserSalonIds()

    const { data: appointmentService, error: fetchError } = await supabase
      .from('appointment_services')
      .select('salon_id')
      .eq('id', data.appointmentServiceId)
      .in('salon_id', accessibleSalonIds)
      .single()

    if (fetchError || !appointmentService) {
      return { error: 'Appointment service not found or unauthorized' }
    }

    const updates: AppointmentServiceUpdateRow = {
      updated_by_id: session.user.id,
    }

    if (data.staffId !== undefined) {
      updates.staff_id = data.staffId ?? null
    }

    if (data.startTime) {
      updates.start_time = data.startTime
    }

    if (data.endTime) {
      updates.end_time = data.endTime
    }

    if (typeof data.durationMinutes === 'number') {
      updates.duration_minutes = data.durationMinutes
    }

    if (data.status) {
      updates.status = data.status
    }

    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('appointment_services')
      .update(updates)
      .eq('id', data.appointmentServiceId)
      .eq('salon_id', appointmentService.salon_id)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/business/appointments')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update appointment service',
    }
  }
}

/**
 * Remove a service from an appointment
 */
export async function removeServiceFromAppointment(formData: FormData): Promise<MutationResult> {
  try {
    const parsed = removeServiceSchema.safeParse({
      appointmentServiceId: formData.get('appointmentServiceId'),
    })

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message }
    }

    const data = parsed.data
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()
    const accessibleSalonIds = await getUserSalonIds()

    const { data: appointmentService, error: fetchError } = await supabase
      .from('appointment_services')
      .select('salon_id, appointment_id')
      .eq('id', data.appointmentServiceId)
      .in('salon_id', accessibleSalonIds)
      .single()

    if (fetchError || !appointmentService) {
      return { error: 'Appointment service not found or unauthorized' }
    }

    const { data: services, error: countError } = await supabase
      .from('appointment_services')
      .select('id')
      .eq('appointment_id', appointmentService.appointment_id)

    if (countError) {
      return { error: countError.message }
    }

    if (services && services.length <= 1) {
      return { error: 'Cannot remove the last service from an appointment' }
    }

    const { error: deleteError } = await supabase
      .schema('scheduling')
      .from('appointment_services')
      .delete()
      .eq('id', data.appointmentServiceId)
      .eq('salon_id', appointmentService.salon_id)

    if (deleteError) {
      return { error: deleteError.message }
    }

    revalidatePath('/business/appointments')
    return { success: true }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'Failed to remove service from appointment',
    }
  }
}

/**
 * Update service status (for tracking completion)
 */
export async function updateServiceStatus(formData: FormData): Promise<MutationResult> {
  try {
    const parsed = updateServiceStatusSchema.safeParse({
      appointmentServiceId: formData.get('appointmentServiceId'),
      status: formData.get('status'),
    })

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message }
    }

    const data = parsed.data
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()
    const accessibleSalonIds = await getUserSalonIds()

    const { data: appointmentService, error: fetchError } = await supabase
      .from('appointment_services')
      .select('salon_id')
      .eq('id', data.appointmentServiceId)
      .in('salon_id', accessibleSalonIds)
      .single()

    if (fetchError || !appointmentService) {
      return { error: 'Appointment service not found or unauthorized' }
    }

    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('appointment_services')
      .update({
        status: data.status,
        updated_by_id: session.user.id,
      })
      .eq('id', data.appointmentServiceId)
      .eq('salon_id', appointmentService.salon_id)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/business/appointments')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update service status',
    }
  }
}

/**
 * Adjust service pricing (create a price override)
 */
export async function adjustServicePricing(formData: FormData): Promise<MutationResult> {
  try {
    const appointmentServiceId = formData.get('appointmentServiceId') as string
    const newPrice = formData.get('newPrice') as string

    if (!UUID_REGEX.test(appointmentServiceId)) {
      return { error: 'Invalid appointment service ID' }
    }

    const parsedPrice = Number(newPrice)
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return { error: 'Invalid price' }
    }

    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()
    const accessibleSalonIds = await getUserSalonIds()

    const { data: appointmentService, error: fetchError } = await supabase
      .from('appointment_services')
      .select('salon_id, service_id')
      .eq('id', appointmentServiceId)
      .in('salon_id', accessibleSalonIds)
      .single()

    if (fetchError || !appointmentService) {
      return { error: 'Appointment service not found or unauthorized' }
    }

    return {
      error: 'Price adjustment feature requires service_pricing implementation',
      info: 'This feature needs integration with the dynamic pricing system',
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to adjust service pricing',
    }
  }
}
