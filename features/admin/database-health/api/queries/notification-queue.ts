import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database, Json } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'
import { QUERY_LIMITS } from '@/lib/config/constants'

type NotificationQueue = Database['public']['Views']['communication_notification_queue_view']['Row']

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
  limit = QUERY_LIMITS.MEDIUM_LIST
): Promise<NotificationQueueSnapshot> {
  const logger = createOperationLogger('getNotificationQueue', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('communication_notification_queue_view')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw error

  const queueItems = (data ?? []) as NotificationQueue[]

  const notificationsByType: Record<string, number> = {}
  const channelDistribution: Record<string, number> = {}

  const getChannels = (payload: Json | null): string[] => {
    if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
      return []
    }

    const rawChannels = (payload as Record<string, unknown>)['channels']
    if (!Array.isArray(rawChannels)) {
      return []
    }

    return rawChannels.filter((channel): channel is string => typeof channel === 'string')
  }

  queueItems.forEach((item) => {
    const type = item['notification_type'] ?? 'unknown'
    notificationsByType[type] = (notificationsByType[type] ?? 0) + 1

    const channels = getChannels(item.payload ?? null)
    channels.forEach((channel) => {
      channelDistribution[channel] = (channelDistribution[channel] ?? 0) + 1
    })
  })

  const oldestPending = queueItems.length > 0 ? queueItems[0]?.created_at ?? null : null

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
