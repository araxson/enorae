'use server'

import { createClient } from '@/lib/supabase/server'
import { bookingSchema } from '@/features/customer/booking/api/schema'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'
import { z } from 'zod'

export async function validateBookingData(formData: FormData, userId: string, salonId: string) {
  const logger = createOperationLogger('validateBookingData', {})
  logger.start()

  const serviceId = formData.get('serviceId') as string
  const staffId = formData.get('staffId') as string

  // Validate input with full schema including salonId
  const rawData = {
    salonId,
    serviceId,
    staffId,
    appointmentDate: formData.get('date') as string,
    appointmentTime: formData.get('time') as string,
    notes: formData.get('notes') as string | undefined,
  }

  const validation = bookingSchema.safeParse(rawData)
  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors
    const firstError =
      errors.salonId?.[0] ||
      errors.serviceId?.[0] ||
      errors.staffId?.[0] ||
      errors.appointmentDate?.[0] ||
      errors.appointmentTime?.[0] ||
      'Validation failed'
    logger.error(firstError, 'validation', {
      userId,
      salonId,
      serviceId,
      staffId,
    })
    return { error: firstError }
  }

  return { data: validation.data }
}

export async function validateSalon(salonId: string, userId: string) {
  const supabase = await createClient()

  const { data: salon, error: salonError } = await supabase
    .from('salons_view')
    .select('id, is_active')
    .eq('id', salonId)
    .limit(1)
    .maybeSingle()

  if (salonError || !salon) {
    logError('Booking salon lookup failed', {
      operationName: 'validateSalon',
      userId,
      salonId,
      error: salonError?.message || 'Salon not found',
      errorCategory: 'not_found',
    })
    return { error: 'Salon not found' }
  }

  const typedSalon = salon as { id: string | null; is_active: boolean | null } | null
  if (typedSalon?.is_active === false) {
    logError('Booking attempted on inactive salon', {
      operationName: 'validateSalon',
      userId,
      salonId,
      error: 'Salon is inactive',
      errorCategory: 'validation',
    })
    return { error: 'This salon is not currently accepting bookings' }
  }

  return { data: salon }
}

export async function validateService(serviceId: string, userId: string, salonId: string) {
  const supabase = await createClient()

  const { data: service, error: serviceError } = await supabase
    .from('services_view')
    .select('duration_minutes, buffer_minutes, price')
    .eq('id', serviceId)
    .limit(1)
    .maybeSingle()

  if (serviceError || !service) {
    logError('Booking service lookup failed', {
      operationName: 'validateService',
      userId,
      salonId,
      serviceId,
      error: serviceError?.message || 'Service not found',
      errorCategory: 'not_found',
    })
    return { error: 'Service not found' }
  }

  type ServiceData = { duration_minutes: number | null; buffer_minutes: number | null; price: number | null }
  const typedService = service as ServiceData

  return { data: typedService }
}

export async function validateAppointmentTime(
  startTime: Date,
  endTime: Date,
  staffId: string,
  userId: string,
  salonId: string,
  serviceId: string
) {
  // Business logic validation: Appointment must be in the future
  const now = new Date()
  if (startTime <= now) {
    logError('Booking past time attempted', {
      operationName: 'validateAppointmentTime',
      userId,
      salonId,
      serviceId,
      error: 'Appointment time must be in the future',
      errorCategory: 'validation',
      requestedTime: startTime.toISOString(),
    })
    return { error: 'Appointment time must be in the future' }
  }

  // Validate appointment is not too far in the future (e.g., max 90 days)
  const maxFutureDate = new Date()
  maxFutureDate.setDate(maxFutureDate.getDate() + 90)
  if (startTime > maxFutureDate) {
    logError('Booking too far in future attempted', {
      operationName: 'validateAppointmentTime',
      userId,
      salonId,
      serviceId,
      error: 'Appointment too far in future',
      errorCategory: 'validation',
      requestedTime: startTime.toISOString(),
    })
    return { error: 'Appointments can only be booked up to 90 days in advance' }
  }

  // Check if staff member is available at this time
  const supabase = await createClient()
  const { data: conflictingAppointments, error: conflictError } = await supabase
    .from('appointments_view')
    .select('id')
    .eq('staff_id', staffId)
    .eq('status', 'confirmed')
    .lt('start_time', endTime.toISOString())
    .gt('end_time', startTime.toISOString())

  if (conflictError) {
    logError('Booking availability check failed', {
      operationName: 'validateAppointmentTime',
      userId,
      salonId,
      staffId,
      error: conflictError.message,
      errorCategory: 'database',
    })
    return { error: 'Error checking staff availability' }
  }

  if (conflictingAppointments && conflictingAppointments.length > 0) {
    logError('Booking conflict detected', {
      operationName: 'validateAppointmentTime',
      userId,
      salonId,
      staffId,
      error: 'Staff member is not available at the selected time',
      errorCategory: 'validation',
      conflictCount: conflictingAppointments.length,
    })
    return { error: 'This staff member is not available at the selected time' }
  }

  return { data: true }
}
