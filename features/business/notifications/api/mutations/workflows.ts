import 'server-only'

import { sendNotification } from './send'

export async function sendAppointmentConfirmation(
  customerId: string,
  details: {
    id: string
    startTime: string
    serviceName: string
    staffName: string
  },
) {
  return sendNotification({
    userId: customerId,
    title: 'Appointment Confirmed',
    message: `Your appointment for ${details.serviceName} with ${details.staffName} is confirmed for ${new Date(details.startTime).toLocaleString()}.`,
    type: 'appointment_confirmation',
    channels: ['email', 'sms', 'in_app'],
    data: details,
  })
}

export async function sendAppointmentReminder(
  customerId: string,
  details: {
    id: string
    startTime: string
    serviceName: string
    staffName: string
  },
) {
  return sendNotification({
    userId: customerId,
    title: 'Appointment Reminder',
    message: `Reminder: You have an appointment for ${details.serviceName} with ${details.staffName} tomorrow at ${new Date(details.startTime).toLocaleString()}.`,
    type: 'appointment_reminder',
    channels: ['email', 'sms', 'in_app', 'push'],
    data: details,
  })
}

export async function sendReviewRequest(
  customerId: string,
  details: {
    id: string
    serviceName: string
    salonName: string
  },
) {
  return sendNotification({
    userId: customerId,
    title: 'How was your experience?',
    message: `We'd love to hear about your experience with ${details.serviceName} at ${details.salonName}!`,
    type: 'review_request',
    channels: ['email', 'in_app'],
    data: details,
  })
}

export async function sendTestNotification(templateId: string) {
  const { sendNotificationForTemplate } = await import('./test')
  return sendNotificationForTemplate(templateId)
}
