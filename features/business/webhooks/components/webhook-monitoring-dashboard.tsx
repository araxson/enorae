'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RefreshCw, AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react'
import type { WebhookStats, WebhookDeliveryLog } from '@/features/business/webhooks/api/queries'

interface WebhookMonitoringDashboardProps {
  stats: WebhookStats
  failedWebhooks: FailedWebhook[]
  deliveryLogs?: WebhookDeliveryLog[]
}

interface FailedWebhook {
  id: string
  url: string
  event_type: string
  error_message: string | null
  created_at: string
}

export function WebhookMonitoringDashboard({
  stats,
  failedWebhooks,
  deliveryLogs = []
}: WebhookMonitoringDashboardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'failed':
        return <AlertCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Webhooks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_webhooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.success_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.successful_deliveries} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Failed Deliveries</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed_deliveries}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.avg_delivery_time)}ms</div>
            <p className="text-xs text-muted-foreground">
              {stats.pending_deliveries} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Failed Webhooks */}
      {failedWebhooks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Failed Webhooks</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          {failedWebhooks.map((webhook) => (
            <Alert key={webhook.id} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span>{webhook.url}</span>
                <Button variant="outline" size="sm">
                  Retry
                </Button>
              </AlertTitle>
              <AlertDescription className="space-y-1">
                <p className="text-sm">
                  Event: {webhook.event_type}
                </p>
                {webhook.error_message && (
                  <p className="text-sm">
                    Error: {webhook.error_message}
                  </p>
                )}
                <p className="text-xs opacity-70">
                  {new Date(webhook.created_at).toLocaleString()}
                </p>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Delivery Logs */}
      {deliveryLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Delivery Logs</CardTitle>
            <CardDescription>Webhook delivery attempt history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deliveryLogs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="flex items-start justify-between gap-4 py-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={getStatusColor(log.status)}>
                          {getStatusIcon(log.status)}
                        </span>
                        <Badge variant={log.status === 'delivered' ? 'default' : 'destructive'}>
                          <span className="text-xs">{log.status}</span>
                        </Badge>
                        {log.response_code ? (
                          <span className="text-sm text-muted-foreground">
                            HTTP {log.response_code}
                          </span>
                        ) : null}
                      </div>
                      {log.error_message ? (
                        <p className="text-sm text-destructive">
                          {log.error_message}
                        </p>
                      ) : null}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}</span>
                        {log.delivery_time_ms ? <span>{log.delivery_time_ms}ms</span> : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
