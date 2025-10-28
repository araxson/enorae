'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/types/database.types'
import { AlertTriangle, Bell, Inbox, Wifi } from 'lucide-react'

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
  const recentFailures = totals['failed']?.count || 0
  const topChannel = Object.entries(channels).sort(([, a], [, b]) => b - a)[0]

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Alert className="flex items-start gap-3">
        <Bell className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <AlertTitle>Notifications Processed</AlertTitle>
          <CardTitle>{totalSent}</CardTitle>
          <AlertDescription>Across all channels in the last 200 events</AlertDescription>
        </div>
      </Alert>

      <Alert variant={failureRate > 5 ? 'destructive' : 'default'} className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <AlertTitle>Failure Rate</AlertTitle>
          <CardTitle>{failureRate.toFixed(1)}%</CardTitle>
          <AlertDescription>
            {recentFailures} failures detected in recent queue
          </AlertDescription>
        </div>
      </Alert>

      <Alert className="flex items-start gap-3">
        <Wifi className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <AlertTitle>Top Channel</AlertTitle>
          {topChannel ? (
            <>
              <CardTitle><span className="capitalize">{topChannel[0].replace('_', ' ')}</span></CardTitle>
              <AlertDescription>
                {topChannel[1]} notifications sent
              </AlertDescription>
            </>
          ) : (
            <AlertDescription>No channel activity yet</AlertDescription>
          )}
        </div>
      </Alert>

      <Alert className="flex items-start gap-3">
        <Inbox className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <AlertTitle>Status Breakdown</AlertTitle>
          <AlertDescription>Current notification statuses</AlertDescription>
          <div className="mt-2 flex flex-wrap gap-2">
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
          </div>
        </div>
      </Alert>
    </div>
  )
}
