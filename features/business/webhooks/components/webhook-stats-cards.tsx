'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import type { WebhookStats } from '@/features/business/webhooks/api/queries'

type WebhookStatsCardsProps = {
  stats: WebhookStats
}

export function WebhookStatsCards({ stats }: WebhookStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Webhooks</CardTitle>
          <CardDescription>Active endpoints responding</CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className="text-3xl font-semibold tracking-tight">{stats.total_webhooks}</p>
          <Activity className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Success Rate</CardTitle>
          <CardDescription>{stats.successful_deliveries} successful deliveries</CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className="text-3xl font-semibold tracking-tight">
            {stats.success_rate.toFixed(1)}%
          </p>
          <CheckCircle className="size-4 text-primary" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Failed Deliveries</CardTitle>
          <CardDescription>Require follow-up</CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className="text-3xl font-semibold tracking-tight">{stats.failed_deliveries}</p>
          <AlertCircle className="size-4 text-destructive" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avg Delivery Time</CardTitle>
          <CardDescription>{stats.pending_deliveries} currently pending</CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className="text-3xl font-semibold tracking-tight">
            {Math.round(stats.avg_delivery_time)}ms
          </p>
          <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>
    </div>
  )
}
