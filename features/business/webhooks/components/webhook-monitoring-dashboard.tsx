'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/layout'
import { RefreshCw, AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react'
import type { WebhookStats, WebhookDeliveryLog } from '../api/queries/monitoring'

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
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      case 'pending':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
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
    <Stack gap="lg">
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
            <CheckCircle className="h-4 w-4 text-green-600" />
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
            <AlertCircle className="h-4 w-4 text-red-600" />
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Failed Webhooks</CardTitle>
                <CardDescription>Recent webhook delivery failures</CardDescription>
              </div>
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
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {failedWebhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{webhook.url}</span>
                      <Badge variant="destructive" className="text-xs">
                        Failed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Event: {webhook.event_type}
                    </p>
                    {webhook.error_message && (
                      <p className="text-sm text-red-600">
                        Error: {webhook.error_message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(webhook.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Retry
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
                <div
                  key={log.id}
                  className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={getStatusColor(log.status)}>
                        {getStatusIcon(log.status)}
                      </span>
                      <Badge
                        variant={log.status === 'delivered' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {log.status}
                      </Badge>
                      {log.response_code && (
                        <span className="text-sm text-muted-foreground">
                          HTTP {log.response_code}
                        </span>
                      )}
                    </div>
                    {log.error_message && (
                      <p className="text-sm text-red-600">
                        {log.error_message}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}</span>
                      {log.delivery_time_ms && (
                        <span>{log.delivery_time_ms}ms</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}
