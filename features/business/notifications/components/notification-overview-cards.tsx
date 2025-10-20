'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Grid } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Bell, Wifi, AlertTriangle, Inbox } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type NotificationStatus = Database['public']['Enums']['notification_status']
type NotificationChannel = Database['public']['Enums']['notification_channel']

type NotificationOverviewCardsProps = {
  totals: Record<NotificationStatus, { count: number; last?: string }>
  failureRate: number
  channels: Record<NotificationChannel, number>
}

const statusPriority: NotificationStatus[] = [
  'sent',
  'delivered',
  'opened',
  'clicked',
  'queued',
  'sending',
  'failed',
  'bounced',
  'unsubscribed',
]

export function NotificationOverviewCards({ totals, failureRate, channels }: NotificationOverviewCardsProps) {
  const totalSent = statusPriority.reduce((sum, status) => sum + (totals[status]?.count || 0), 0)
  const recentFailures = totals.failed?.count || 0
  const topChannel = Object.entries(channels).sort(([, a], [, b]) => b - a)[0]

  return (
    <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Notifications Processed</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSent}</div>
          <CardDescription className="text-xs">
            Across all channels in the last 200 events
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Failure Rate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${failureRate > 5 ? 'text-rose-600' : ''}`}>
            {failureRate.toFixed(1)}%
          </div>
          <CardDescription className="text-xs">
            {recentFailures} failures detected in recent queue
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Top Channel</CardTitle>
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {topChannel ? (
            <>
              <div className="text-2xl font-bold capitalize">{topChannel[0].replace('_', ' ')}</div>
              <CardDescription className="text-xs">
                {topChannel[1]} notifications sent
              </CardDescription>
            </>
          ) : (
            <CardDescription>No channel activity yet</CardDescription>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Status Breakdown</CardTitle>
          <Inbox className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {statusPriority.map((status) => {
            const count = totals[status]?.count || 0
            if (!count) return null
            const tone =
              status === 'failed' || status === 'bounced'
                ? 'destructive'
                : status === 'delivered' || status === 'sent'
                ? 'default'
                : 'secondary'

            return (
              <Badge key={status} variant={tone}>
                {status} · {count}
              </Badge>
            )
          })}
        </CardContent>
      </Card>
    </Grid>
  )
}
