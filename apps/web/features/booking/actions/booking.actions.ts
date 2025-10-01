'use server'

import { createClient } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sendAppointmentConfirmation } from '@/features/notifications/actions/notification.actions'

export async function createBooking(formData: FormData) {
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be logged in to book an appointment')
  }

  const salonId = formData.get('salonId') as string
  const serviceId = formData.get('serviceId') as string
  const staffId = formData.get('staffId') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string

  // Combine date and time
  const startTime = new Date(`${date}T${time}:00`)
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // +1 hour

  // Create appointment
  const { data: appointment, error: appointmentError } = await (supabase as any)
    .from('appointments')
    .insert({
      salon_id: salonId,
      customer_id: user.id,
      staff_id: staffId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'pending',
    })
    .select()
    .single()

  if (appointmentError) throw appointmentError

  // Link service to appointment
  const { error: serviceError } = await (supabase as any)
    .from('appointment_services')
    .insert({
      appointment_id: appointment.id,
      service_id: serviceId,
    })

  if (serviceError) throw serviceError

  // Fetch appointment details for email
  const { data: appointmentDetails } = await supabase
    .from('appointments')
    .select(`
      id,
      start_time,
      salons:salon_id (
        name,
        address,
        phone
      ),
      services:appointment_services!inner(
        services:service_id (
          name,
          duration,
          price
        )
      ),
      staff:staff_id (
        full_name
      ),
      customer:customer_id (
        email,
        full_name
      )
    `)
    .eq('id', appointment.id)
    .single()

  // Send confirmation email (don't block on email sending)
  if (appointmentDetails) {
    try {
      const details = appointmentDetails as any
      const appointmentDate = new Date(details.start_time)
      await sendAppointmentConfirmation({
        id: details.id,
        customerEmail: details.customer.email,
        customerName: details.customer.full_name || 'Customer',
        salonName: details.salons.name,
        serviceName: details.services[0].services.name,
        staffName: details.staff.full_name,
        appointmentDate: appointmentDate.toLocaleDateString(),
        appointmentTime: appointmentDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        duration: details.services[0].services.duration,
        price: details.services[0].services.price,
        salonAddress: details.salons.address,
        salonPhone: details.salons.phone,
      })
    } catch (error) {
      // Log error but don't fail the booking
      console.error('Failed to send confirmation email:', error)
    }
  }

  revalidatePath('/profile/appointments')
  redirect('/profile/appointments')
}