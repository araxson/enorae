'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { AppointmentSnapshot } from '@/features/admin/appointments/api/types'
import { MetricsSummary } from './metrics-summary'
import { TrendTable } from './trend-table'
import { CancellationPatternsCard } from './cancellation-patterns-card'
import { NoShowPanel } from './no-show-panel'
import { FraudAlertsPanel } from './fraud-alerts-panel'
import { DisputesPanel } from './disputes-panel'
import { SalonPerformanceTable } from './salon-performance-table'
import { RecentAppointmentsTable } from './recent-appointments-table'
import { Spinner } from '@/components/ui/spinner'
import { TIME_MS } from '@/lib/config/constants'
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

// Type guard for AppointmentSnapshot validation
function isValidAppointmentSnapshot(value: unknown): value is AppointmentSnapshot {
  if (!value || typeof value !== 'object') return false

  const snapshot = value as Record<string, unknown>
  return (
    'timeframe' in snapshot &&
    'totals' in snapshot &&
    'performance' in snapshot &&
    'trend' in snapshot &&
    'cancellations' in snapshot &&
    'noShows' in snapshot &&
    'fraudAlerts' in snapshot &&
    'disputes' in snapshot &&
    'salonPerformance' in snapshot &&
    'recentAppointments' in snapshot
  )
}

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

    const controller = new AbortController()
    try {
      const timeoutSignal = AbortSignal.timeout(TIME_MS.API_REQUEST_TIMEOUT)
      const response = await fetch('/api/admin/appointments/oversight', {
        cache: 'no-store',
        signal: AbortSignal.any([controller.signal, timeoutSignal])
      })
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      const payload: unknown = await response.json()

      // Type guard for payload validation
      if (
        !payload ||
        typeof payload !== 'object' ||
        !('data' in payload) ||
        !isValidAppointmentSnapshot(payload.data)
      ) {
        throw new Error('Invalid snapshot payload structure')
      }

      setData(payload.data)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Showing cached data.')
      } else {
        console.error('[AppointmentsDashboard] refresh failed', err)
        setError('Unable to refresh right now. Showing cached data.')
      }
    } finally {
      setIsRefreshing(false)
      controller.abort()
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
                {isRefreshing ? <Spinner className="mr-2 size-4" /> : <RefreshCw className="mr-2 size-4" />}
                Refresh
              </Button>
            </ButtonGroup>
          </ItemActions>
        </Item>
      </ItemGroup>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
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
