export type NotificationPayload = Record<string, unknown>

export type NotificationEntry = {
  id: string
  user_id: string
  channels: string[]
  status: string | null
  created_at: string | null
  scheduled_for: string | null
  sent_at: string | null
  notification_type: string | null
  payload: NotificationPayload | null
  title?: string | null
  message?: string | null
  error?: string | null
  event_type?: string | null
  data?: NotificationPayload | null
}
