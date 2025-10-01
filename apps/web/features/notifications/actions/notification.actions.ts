'use server'

import { sendEmail } from '../lib/email-client'
import { AppointmentConfirmationEmail } from '../templates/appointment-confirmation'
import { AppointmentReminderEmail } from '../templates/appointment-reminder'
import { AppointmentCancelledEmail } from '../templates/appointment-cancelled'
import { createClient } from '@/lib/supabase/client'

interface AppointmentDetails {
  id: string
  customerEmail: string
  customerName: string
  salonName: string
  serviceName: string
  staffName: string
  appointmentDate: string
  appointmentTime: string
  duration: number
  price: number
  salonAddress?: string
  salonPhone?: string
}

export async function sendAppointmentConfirmation(details: AppointmentDetails) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const cancellationUrl = `${process.env.NEXT_PUBLIC_CUSTOMER_WEB_URL}/profile?tab=appointments&action=cancel&id=${details.id}`

  const emailElement = AppointmentConfirmationEmail({
    customerName: details.customerName,
    salonName: details.salonName,
    serviceName: details.serviceName,
    staffName: details.staffName,
    appointmentDate: details.appointmentDate,
    appointmentTime: details.appointmentTime,
    duration: details.duration,
    price: details.price,
    salonAddress: details.salonAddress,
    salonPhone: details.salonPhone,
    cancellationUrl,
  })

  const result = await sendEmail({
    to: details.customerEmail,
    subject: `Appointment Confirmed - ${details.salonName}`,
    react: emailElement,
  })

  // Log email sent event
  if (result.success) {
    await (supabase as any).from('communication_logs').insert({
      recipient_id: user.id,
      type: 'appointment_confirmation',
      channel: 'email',
      status: 'sent',
      metadata: { appointment_id: details.id },
    })
  }

  return result
}

export async function sendAppointmentReminder(details: AppointmentDetails) {
  const supabase = await createClient()

  const manageUrl = `${process.env.NEXT_PUBLIC_CUSTOMER_WEB_URL}/profile?tab=appointments`

  const emailElement = AppointmentReminderEmail({
    customerName: details.customerName,
    salonName: details.salonName,
    serviceName: details.serviceName,
    staffName: details.staffName,
    appointmentDate: details.appointmentDate,
    appointmentTime: details.appointmentTime,
    salonAddress: details.salonAddress,
    salonPhone: details.salonPhone,
    manageUrl,
  })

  const result = await sendEmail({
    to: details.customerEmail,
    subject: `Reminder: Appointment Tomorrow at ${details.salonName}`,
    react: emailElement,
  })

  // Log email sent event
  if (result.success) {
    await (supabase as any).from('communication_logs').insert({
      type: 'appointment_reminder',
      channel: 'email',
      status: 'sent',
      metadata: { appointment_id: details.id },
    })
  }

  return result
}

export async function sendAppointmentCancellation(
  details: AppointmentDetails & { cancellationReason?: string }
) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const rebookUrl = `${process.env.NEXT_PUBLIC_CUSTOMER_WEB_URL}/book/${details.salonName.toLowerCase().replace(/\s+/g, '-')}`

  const emailElement = AppointmentCancelledEmail({
    customerName: details.customerName,
    salonName: details.salonName,
    serviceName: details.serviceName,
    staffName: details.staffName,
    appointmentDate: details.appointmentDate,
    appointmentTime: details.appointmentTime,
    cancellationReason: details.cancellationReason,
    rebookUrl,
  })

  const result = await sendEmail({
    to: details.customerEmail,
    subject: `Appointment Cancelled - ${details.salonName}`,
    react: emailElement,
  })

  // Log email sent event
  if (result.success) {
    await (supabase as any).from('communication_logs').insert({
      recipient_id: user.id,
      type: 'appointment_cancellation',
      channel: 'email',
      status: 'sent',
      metadata: { appointment_id: details.id },
    })
  }

  return result
}

// Bulk notification functions
export async function sendDailyReminders() {
  const supabase = await createClient()

  // Get tomorrow's date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  // Fetch all appointments for tomorrow
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      id,
      appointment_date,
      appointment_time,
      customers:customer_id (
        id,
        email,
        full_name
      ),
      salons:salon_id (
        name,
        address,
        phone
      ),
      services:service_id (
        name,
        duration,
        price
      ),
      staff:staff_id (
        full_name
      )
    `)
    .eq('appointment_date', tomorrowStr)
    .eq('status', 'confirmed')

  if (error || !appointments) {
    console.error('Error fetching appointments for reminders:', error)
    return { success: false, error }
  }

  const results = []

  for (const appointment of (appointments as any[])) {
    const appt = appointment as any
    try {
      const result = await sendAppointmentReminder({
        id: appt.id,
        customerEmail: appt.customers.email,
        customerName: appt.customers.full_name,
        salonName: appt.salons.name,
        serviceName: appt.services.name,
        staffName: appt.staff.full_name,
        appointmentDate: appt.appointment_date,
        appointmentTime: appt.appointment_time,
        duration: appt.services.duration,
        price: appt.services.price,
        salonAddress: appt.salons.address,
        salonPhone: appt.salons.phone,
      })

      results.push({ appointmentId: appt.id, ...result })
    } catch (error) {
      console.error(`Failed to send reminder for appointment ${appt.id}:`, error)
      results.push({ appointmentId: appt.id, success: false, error })
    }
  }

  return {
    success: true,
    totalSent: results.filter(r => r.success).length,
    totalFailed: results.filter(r => !r.success).length,
    results,
  }
}