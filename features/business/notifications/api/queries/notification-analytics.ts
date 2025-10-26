import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { getNotificationHistory } from './notification-list'
import type { Database } from '@/lib/types/database.types'

type NotificationStatus = Database['public']['Enums']['notification_status']
type NotificationChannel = Database['public']['Enums']['notification_channel']

export async function getNotificationStatistics() {
  const history = await getNotificationHistory(200)

  const totals = history.reduce<
    Record<NotificationStatus, { count: number; last?: string }>
  >((acc, entry) => {
    const status = (entry['status'] || 'queued') as NotificationStatus
    if (!acc[status]) {
      acc[status] = { count: 0, last: entry['created_at'] || undefined }
    }
    acc[status].count += 1
    if (entry['created_at']) {
      acc[status].last =
        !acc[status].last || entry['created_at'] > acc[status].last ? entry['created_at'] : acc[status].last
    }
    return acc
  }, {} as Record<NotificationStatus, { count: number; last?: string }>)

  const failureCount = history.filter((entry) => entry['status'] === 'failed' || entry['status'] === 'bounced').length

  const channels = history.reduce<Record<NotificationChannel, number>>((acc, entry) => {
    const entryChannels = (entry['channels'] || []) as NotificationChannel[]
    entryChannels.forEach((channel) => {
      acc[channel] = (acc[channel] || 0) + 1
    })
    return acc
  }, {} as Record<NotificationChannel, number>)

  return {
    totals,
    failureRate: history.length ? (failureCount / history.length) * 100 : 0,
    channels,
  }
}
