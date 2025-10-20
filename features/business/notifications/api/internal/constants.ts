export const defaultPreferences = {
  email: {
    appointment_confirmation: true,
    appointment_reminder: true,
    appointment_cancelled: true,
    review_request: true,
    staff_message: true,
    system_alert: true,
  },
  sms: {
    appointment_confirmation: false,
    appointment_reminder: true,
    appointment_cancelled: true,
    review_request: false,
    staff_message: false,
    system_alert: false,
  },
  in_app: {
    appointment_confirmation: true,
    appointment_reminder: true,
    appointment_cancelled: true,
    review_request: true,
    staff_message: true,
    system_alert: true,
  },
}

export const defaultTemplates = [
  {
    id: 'default-confirmation',
    name: 'Appointment Confirmation',
    channel: 'email' as const,
    event: 'appointment_confirmation' as const,
    subject: 'Your appointment is confirmed!',
    body:
      'Hi {{customer_name}}, your appointment for {{service_name}} on {{appointment_date}} is confirmed. We look forward to seeing you!',
  },
  {
    id: 'default-reminder',
    name: 'Appointment Reminder',
    channel: 'sms' as const,
    event: 'appointment_reminder' as const,
    body:
      'Reminder: {{service_name}} with {{staff_name}} at {{appointment_time}}. Reply YES to confirm or call us to reschedule.',
  },
]
