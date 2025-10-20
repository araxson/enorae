import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type NotificationQueue = Database['public']['Views']['communication_notification_queue']['Row']

export interface NotificationQueueSnapshot {
  queueItems: NotificationQueue[]
  summary: {
    totalPending: number
    oldestPending: string | null
    notificationsByType: Record<string, number>
    channelDistribution: Record<string, number>
  }
}

export async function getNotificationQueue(
  limit = 100
): Promise<NotificationQueueSnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('communication_notification_queue')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw error

  const queueItems = (data ?? []) as NotificationQueue[]

  const notificationsByType: Record<string, number> = {}
  const channelDistribution: Record<string, number> = {}

  queueItems.forEach((item) => {
    const type = item.notification_type ?? 'unknown'
    notificationsByType[type] = (notificationsByType[type] ?? 0) + 1

    const channels = item.channels ?? []
    channels.forEach((channel) => {
      channelDistribution[channel] = (channelDistribution[channel] ?? 0) + 1
    })
  })

  const oldestPending =
    queueItems.length > 0 ? queueItems[0].created_at : null

  return {
    queueItems,
    summary: {
      totalPending: queueItems.length,
      oldestPending,
      notificationsByType,
      channelDistribution,
    },
  }
}
