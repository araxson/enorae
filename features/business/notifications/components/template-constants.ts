import type { NotificationTemplate } from '../api/queries'

export const eventOptions: NotificationTemplate['event'][] = [
  'appointment_confirmation',
  'appointment_reminder',
  'appointment_cancelled',
  'appointment_rescheduled',
  'promotion',
  'review_request',
  'loyalty_update',
  'staff_message',
  'system_alert',
  'welcome',
  'birthday',
  'other',
]

export const channelOptions: NotificationTemplate['channel'][] = ['email', 'sms', 'push', 'in_app', 'whatsapp']
