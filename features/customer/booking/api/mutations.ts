'use server'

import { randomInt } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { bookingSchema } from '@/lib/validations/booking'
import type { Database } from '@/lib/types/database.types'

// NOTE: Using Table types for Insert because Views include computed/joined fields
// Views are for SELECT (queries), schema tables for mutations (insert/update/delete)
type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert']
type AppointmentServiceInsert = Database['scheduling']['Tables']['appointment_services']['Insert']

// UUID validation regex

/**
 * Generate a unique confirmation code in format ABC-1234
 */
function generateConfirmationCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // Exclude I, O to avoid confusion with 1, 0
  const numbers = '0123456789'

  let code = ''
  for (let i = 0; i < 3; i++) {
    code += letters[randomInt(0, letters.length)]
  }
  code += '-'
  for (let i = 0; i < 4; i++) {
    code += numbers[randomInt(0, numbers.length)]
  }

  return code
}

export async function createBooking(formData: FormData) {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Validate input
    const rawData = {
      serviceId: formData.get('serviceId') as string,
      staffId: formData.get('staffId') as string,
      appointmentDate: formData.get('date') as string,
      appointmentTime: formData.get('time') as string,
      notes: formData.get('notes') as string | undefined,
    }

    const validation = bookingSchema.safeParse(rawData)
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      const firstError = errors.serviceId?.[0] || errors.staffId?.[0] || errors.appointmentDate?.[0] || errors.appointmentTime?.[0] || 'Validation failed'
      return { error: firstError }
    }

    const salonId = formData.get('salonId') as string

    // Validate salonId with Zod
    const salonIdValidation = bookingSchema.shape.serviceId.safeParse(salonId)
    if (!salonIdValidation.success || !salonId) {
      return { error: 'Invalid or missing salon ID' }
    }

    // SECURITY: Verify salon exists and is active
    const { data: salon, error: salonError } = await supabase
      .from('salons_view')
      .select('id, is_active')
      .eq('id', salonId)
      .limit(1)
      .maybeSingle()

    if (salonError || !salon) {
      return { error: 'Salon not found' }
    }

    const typedSalon = salon as { id: string | null; is_active: boolean | null } | null
    if (typedSalon?.is_active === false) {
      return { error: 'This salon is not currently accepting bookings' }
    }

    // Fetch service details to get duration and pricing
    const { data: service, error: serviceError } = await supabase
      .from('services_view')
      .select('duration_minutes, price')
      .eq('id', validation.data.serviceId)
      .limit(1)
      .maybeSingle()

    if (serviceError || !service) {
      return { error: 'Service not found' }
    }

    // Type cast for safety (public view has these fields)
    type ServiceData = { duration_minutes: number | null; price: number | null }
    const typedService = service as ServiceData

    // Combine date and time
    const startTime = new Date(`${validation.data.appointmentDate}T${validation.data.appointmentTime}`)

    // Business logic validation: Appointment must be in the future
    const now = new Date()
    if (startTime <= now) {
      return { error: 'Appointment time must be in the future' }
    }

    // Validate appointment is not too far in the future (e.g., max 90 days)
    const maxFutureDate = new Date()
    maxFutureDate.setDate(maxFutureDate.getDate() + 90)
    if (startTime > maxFutureDate) {
      return { error: 'Appointments can only be booked up to 90 days in advance' }
    }

    // Calculate end time based on service duration (default to 60 minutes if not set)
    const durationMinutes = typedService.duration_minutes || 60
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000)

    // Check if staff member is available at this time
    // SECURITY: Proper overlap detection - existing.start < new.end AND existing.end > new.start
    const { data: conflictingAppointments, error: conflictError } = await supabase
      .from('appointments_view')
      .select('id')
      .eq('staff_id', validation.data.staffId)
      .eq('status', 'confirmed')
      .lt('start_time', endTime.toISOString())
      .gt('end_time', startTime.toISOString())

    if (conflictError) {
      return { error: 'Error checking staff availability' }
    }

    if (conflictingAppointments && conflictingAppointments.length > 0) {
      return { error: 'This staff member is not available at the selected time' }
    }

    // Step 1: Create appointment with confirmation code
    const confirmationCode = generateConfirmationCode()

    const appointmentData: AppointmentInsert = {
      salon_id: salonId,
      customer_id: session.user.id,
      staff_id: validation.data.staffId,
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
      return { error: appointmentError.message }
    }

    // Step 2: Create appointment_services record (service relationship)
    const appointmentServiceData: AppointmentServiceInsert = {
      appointment_id: appointment.id,
      service_id: validation.data.serviceId,
      staff_id: validation.data.staffId,
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
      // ROLLBACK: Delete the appointment if service attachment fails
      await supabase
        .schema('scheduling')
        .from('appointments')
        .delete()
        .eq('id', appointment.id)

      return { error: 'Failed to attach service to appointment. Please try again.' }
    }

    revalidatePath('/customer/profile')
    redirect('/customer/profile')
  } catch (error) {
    console.error('Booking error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
