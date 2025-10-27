'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { AppointmentSnapshot } from '@/features/admin/appointments/types'
import { MetricsSummary } from './metrics-summary'
import { TrendTable } from './trend-table'
import { CancellationPatternsCard } from './cancellation-patterns-card'
import { NoShowPanel } from './no-show-panel'
import { FraudAlertsPanel } from './fraud-alerts-panel'
import { DisputesPanel } from './disputes-panel'
import { SalonPerformanceTable } from './salon-performance-table'
import { RecentAppointmentsTable } from './recent-appointments-table'
import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

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
    <div className="flex flex-col gap-10">
      <ItemGroup className="flex-wrap gap-3">
        <Item className="flex-col items-start gap-1">
          <ItemContent>
            <ItemTitle>Platform Appointment Oversight</ItemTitle>
            <ItemDescription>
              Aggregated metrics across all salons. Last updated {lastUpdatedLabel}.
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item className="items-center gap-3" variant="muted" size="sm">
          <ItemContent>
            <ItemDescription>Auto-refresh 30s</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ButtonGroup>
              <Button variant="outline" size="sm" onClick={refresh} disabled={isRefreshing}>
                {isRefreshing ? <Spinner className="mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Refresh
              </Button>
            </ButtonGroup>
          </ItemActions>
        </Item>
      </ItemGroup>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to refresh data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
    </div>
  )
}
