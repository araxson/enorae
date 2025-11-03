'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { generateConfirmationCode } from './utilities'
import { logInfo, logError } from '@/lib/observability'
import {
  validateBookingData,
  validateSalon,
  validateService,
  validateAppointmentTime,
} from './validate'

// NOTE: Using Table types for Insert because Views include computed/joined fields
// Views are for SELECT (queries), schema tables for mutations (insert/update/delete)
type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert']
type AppointmentServiceInsert = Database['scheduling']['Tables']['appointment_services']['Insert']

export async function createBooking(formData: FormData) {
  const salonId = formData.get('salonId') as string
  const serviceId = formData.get('serviceId') as string
  const staffId = formData.get('staffId') as string

  logInfo('Starting booking creation', {
    operationName: 'createBooking',
    salonId,
    serviceId,
    staffId
  })

  try {
    const session = await requireAuth()
    const supabase = await createClient()

    logInfo('Booking creation - user authenticated', {
      operationName: 'createBooking',
      userId: session.user.id,
      salonId,
      serviceId
    })

    // Step 1: Validate input data
    const dataValidation = await validateBookingData(formData, session.user.id, salonId)
    if ('error' in dataValidation) return dataValidation
    const validatedData = dataValidation.data!

    // Step 2: Validate salon
    const salonValidation = await validateSalon(salonId, session.user.id)
    if ('error' in salonValidation) return salonValidation

    // Step 3: Fetch and validate service details
    const serviceValidation = await validateService(validatedData.serviceId, session.user.id, salonId)
    if ('error' in serviceValidation) return serviceValidation
    const typedService = serviceValidation.data!

    // Step 4: Calculate appointment times
    const startTime = new Date(`${validatedData.appointmentDate}T${validatedData.appointmentTime}`)
    const durationMinutes = typedService.duration_minutes || 60
    const bufferMinutes = typedService.buffer_minutes || 0
    const totalMinutes = durationMinutes + bufferMinutes
    const endTime = new Date(startTime.getTime() + totalMinutes * 60 * 1000)

    // Step 5: Validate appointment time and availability
    const timeValidation = await validateAppointmentTime(
      startTime,
      endTime,
      validatedData.staffId,
      session.user.id,
      salonId,
      serviceId
    )
    if ('error' in timeValidation) return timeValidation

    // Step 6: Create appointment with confirmation code
    const confirmationCode = generateConfirmationCode()

    const appointmentData: AppointmentInsert = {
      salon_id: salonId,
      customer_id: session.user.id,
      staff_id: validatedData.staffId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'pending',
      duration_minutes: durationMinutes,
      confirmation_code: confirmationCode,
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
    }

    const { data: appointment, error: appointmentError } = await supabase
      .schema('scheduling')
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single()

    if (appointmentError) {
      logError('Booking appointment creation failed', {
        operationName: 'createBooking',
        userId: session.user.id,
        salonId,
        serviceId,
        staffId: validatedData.staffId,
        error: appointmentError.message,
        errorCategory: 'database'
      })
      return { error: appointmentError.message }
    }

    logInfo('Booking appointment created', {
      operationName: 'createBooking',
      userId: session.user.id,
      appointmentId: appointment.id,
      confirmationCode,
      salonId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    })

    // Step 7: Create appointment_services record (service relationship)
    const appointmentServiceData: AppointmentServiceInsert = {
      appointment_id: appointment.id,
      service_id: validatedData.serviceId,
      staff_id: validatedData.staffId,
      duration_minutes: durationMinutes,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
    }

    const { error: serviceInsertError } = await supabase
      .schema('scheduling')
      .from('appointment_services')
      .insert(appointmentServiceData)

    if (serviceInsertError) {
      logError('Booking service attachment failed - rolling back', {
        operationName: 'createBooking',
        userId: session.user.id,
        appointmentId: appointment.id,
        serviceId: validatedData.serviceId,
        error: serviceInsertError.message,
        errorCategory: 'database'
      })

      // ROLLBACK: Delete the appointment if service attachment fails
      await supabase
        .schema('scheduling')
        .from('appointments')
        .delete()
        .eq('id', appointment.id)

      logInfo('Booking rollback completed', {
        operationName: 'createBooking',
        userId: session.user.id,
        appointmentId: appointment.id
      })

      return { error: 'Failed to attach service to appointment. Please try again.' }
    }

    logInfo('Booking completed successfully', {
      operationName: 'createBooking',
      userId: session.user.id,
      appointmentId: appointment.id,
      confirmationCode,
      salonId,
      serviceId: validatedData.serviceId,
      staffId: validatedData.staffId,
      startTime: startTime.toISOString(),
      totalDuration: totalMinutes
    })

    revalidatePath('/customer/profile', 'page')
    redirect('/customer/profile')
  } catch (error) {
    logError('Booking unexpected error', {
      operationName: 'createBooking',
      salonId,
      serviceId,
      staffId,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCategory: 'system'
    })
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
