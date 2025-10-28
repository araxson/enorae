'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'
import type { WebhookDeliveryLog } from '@/features/business/webhooks/api/queries'

type DeliveryLogsSectionProps = {
  deliveryLogs: WebhookDeliveryLog[]
}

function getStatusColor(status: string) {
  switch (status) {
    case 'delivered':
      return 'text-primary'
    case 'failed':
      return 'text-destructive'
    case 'pending':
      return 'text-accent'
    default:
      return 'text-muted-foreground'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'delivered':
      return <CheckCircle className="size-4" />
    case 'failed':
      return <AlertCircle className="size-4" />
    case 'pending':
      return <Clock className="size-4" />
    default:
      return <Activity className="size-4" />
  }
}

export function DeliveryLogsSection({ deliveryLogs }: DeliveryLogsSectionProps) {
  if (deliveryLogs.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Delivery Logs</CardTitle>
        <CardDescription>Webhook delivery attempt history</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="space-y-3">
          {deliveryLogs.map((log) => (
            <Card key={log.id}>
              <CardContent className="py-3">
                <ItemGroup>
                  <Item className="items-start gap-4">
                    <ItemContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={getStatusColor(log.status)}>{getStatusIcon(log.status)}</span>
                        <Badge variant={log.status === 'delivered' ? 'default' : 'destructive'}>
                          <span className="text-xs">{log.status}</span>
                        </Badge>
                        {log.response_code ? (
                          <span className="text-sm text-muted-foreground">HTTP {log.response_code}</span>
                        ) : null}
                      </div>
                      {log.error_message ? <p className="text-sm text-destructive">{log.error_message}</p> : null}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}</span>
                        {log.delivery_time_ms ? <span>{log.delivery_time_ms}ms</span> : null}
                      </div>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </CardContent>
            </Card>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
