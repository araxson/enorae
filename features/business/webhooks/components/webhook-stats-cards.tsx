'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'
import type { WebhookStats } from '@/features/business/webhooks/api/queries'

type WebhookStatsCardsProps = {
  stats: WebhookStats
}

export function WebhookStatsCards({ stats }: WebhookStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Total Webhooks</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <Activity className="h-4 w-4 text-muted-foreground" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <CardTitle>{stats.total_webhooks}</CardTitle>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Success Rate</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <CheckCircle className="h-4 w-4 text-primary" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <CardTitle>{stats.success_rate.toFixed(1)}%</CardTitle>
          <p className="text-xs text-muted-foreground">{stats.successful_deliveries} successful</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Failed Deliveries</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <CardTitle>{stats.failed_deliveries}</CardTitle>
          <p className="text-xs text-muted-foreground">Require attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Avg Delivery Time</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <CardTitle>{Math.round(stats.avg_delivery_time)}ms</CardTitle>
          <p className="text-xs text-muted-foreground">{stats.pending_deliveries} pending</p>
        </CardContent>
      </Card>
    </div>
  )
}
