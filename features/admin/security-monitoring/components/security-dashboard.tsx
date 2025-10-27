'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import type { SecurityMonitoringSnapshot } from '@/features/admin/security-monitoring/types'
import { OverviewCards } from './overview-cards'
import { SecurityEventsPanel } from './security-events-panel'
import { SuspiciousActivityPanel } from './suspicious-activity-panel'
import { FailedLoginsPanel } from './failed-logins-panel'
import { RateLimitPanel } from './rate-limit-panel'
import { IpAccessPanel } from './ip-access-panel'
import { IncidentResponsePanel } from './incident-response-panel'

interface SecurityDashboardProps {
  snapshot: SecurityMonitoringSnapshot
}

const REFRESH_INTERVAL_MS = 15_000

export function SecurityDashboard({ snapshot }: SecurityDashboardProps) {
  const [data, setData] = useState<SecurityMonitoringSnapshot>(snapshot)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lastUpdatedLabel = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(data.timeframe.end), { addSuffix: true })
    } catch (err) {
      console.error('[SecurityDashboard] Failed to format timestamp', err)
      return 'just now'
    }
  }, [data.timeframe.end])

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/security/monitoring?windowHours=24', {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const payload = await response.json()
      if (!payload?.data) {
        throw new Error('Snapshot payload missing data property')
      }

      setData(payload.data as SecurityMonitoringSnapshot)
    } catch (err) {
      console.error('[SecurityDashboard] Failed to refresh snapshot', err)
      setError('Unable to refresh. Showing cached data.')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(refresh, REFRESH_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [refresh])

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold">Real-Time Security Overview</h2>
          <p className="text-sm text-muted-foreground">
            Streaming telemetry from Supabase security logs. Last updated {lastUpdatedLabel}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">
            Auto-refresh 15s
          </p>
          <Button variant="outline" size="sm" onClick={refresh} disabled={isRefreshing}>
            <RefreshCw className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to refresh security data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <OverviewCards snapshot={data} />

      <div className="grid gap-4 lg:grid-cols-2">
        <SecurityEventsPanel events={data.recentEvents} />
        <SuspiciousActivityPanel sessions={data.suspiciousSessions} blockedSessions={data.overview.blockedSessions} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FailedLoginsPanel summary={data.failedLoginSummary} />
        <RateLimitPanel violations={data.rateLimitViolations} rules={data.rateLimitRules} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <IpAccessPanel events={data.ipAccess} />
        <IncidentResponsePanel incidents={data.incidents} />
      </div>
    </div>
  )
}
