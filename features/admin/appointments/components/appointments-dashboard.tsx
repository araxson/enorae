'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw } from 'lucide-react'
import { Stack } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AppointmentSnapshot } from '../api/types'
import { MetricsSummary } from './metrics-summary'
import { TrendTable } from './trend-table'
import { CancellationPatternsCard } from './cancellation-patterns-card'
import { NoShowPanel } from './no-show-panel'
import { FraudAlertsPanel } from './fraud-alerts-panel'
import { DisputesPanel } from './disputes-panel'
import { SalonPerformanceTable } from './salon-performance-table'
import { RecentAppointmentsTable } from './recent-appointments-table'

interface AppointmentsDashboardProps {
  snapshot: AppointmentSnapshot
}

const REFRESH_INTERVAL_MS = 30_000

export function AppointmentsDashboard({ snapshot }: AppointmentsDashboardProps) {
  const [data, setData] = useState(snapshot)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lastUpdatedLabel = useMemo(() => {
    return formatDistanceToNow(new Date(data.timeframe.end), { addSuffix: true })
  }, [data.timeframe.end])

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/appointments/oversight', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      const payload = await response.json()
      if (!payload?.data) throw new Error('Snapshot payload missing data property')
      setData(payload.data as AppointmentSnapshot)
    } catch (err) {
      console.error('[AppointmentsDashboard] refresh failed', err)
      setError('Unable to refresh right now. Showing cached data.')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(refresh, REFRESH_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [refresh])

  return (
    <Stack gap="xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-1">Platform Appointment Oversight</h2>
          <p className="block text-sm text-muted-foreground">
            Aggregated metrics across all salons. Last updated {lastUpdatedLabel}.
          </p>
          {error && (
            <p className="leading-7 mt-2 text-sm text-destructive">{error}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground text-xs uppercase tracking-wide text-muted-foreground">
            Auto-refresh 30s
          </p>
          <Button variant="outline" size="sm" onClick={refresh} disabled={isRefreshing}>
            <RefreshCw className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      <MetricsSummary totals={data.totals} performance={data.performance} />

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <TrendTable trend={data.trend} />
        <CancellationPatternsCard patterns={data.cancellations} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <NoShowPanel noShows={data.noShows} />
        <FraudAlertsPanel alerts={data.fraudAlerts} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DisputesPanel disputes={data.disputes} />
        <SalonPerformanceTable salons={data.salonPerformance} />
      </div>

      <RecentAppointmentsTable appointments={data.recentAppointments} />
    </Stack>
  )
}
