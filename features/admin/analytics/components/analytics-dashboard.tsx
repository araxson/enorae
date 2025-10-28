'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { PlatformAnalyticsSnapshot } from '@/features/admin/analytics/api/types'
import { MetricSummaryCards } from './metric-summary-cards'
import { GrowthTrendPanel } from './growth-trend-panel'
import { AcquisitionPanel } from './acquisition-panel'
import { RetentionPanel } from './retention-panel'
import { FeatureUsagePanel } from './feature-usage-panel'
import { PerformanceBenchmarksTable } from './performance-benchmarks-table'
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

interface PlatformAnalyticsDashboardProps {
  snapshot: PlatformAnalyticsSnapshot
}

const REFRESH_INTERVAL_MS = 60_000

export function PlatformAnalyticsDashboard({ snapshot }: PlatformAnalyticsDashboardProps) {
  const [data, setData] = useState(snapshot)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lastUpdatedLabel = useMemo(() => {
    if (!data.latestSnapshotDate) return 'N/A'
    return formatDistanceToNow(new Date(data.latestSnapshotDate), { addSuffix: true })
  }, [data.latestSnapshotDate])

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/analytics/overview', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const payload = await response.json()
      if (!payload?.data) {
        throw new Error('Snapshot payload missing data property')
      }

      setData(payload.data as PlatformAnalyticsSnapshot)
    } catch (err: unknown) {
      console.error('[PlatformAnalyticsDashboard] refresh failed', err)
      setError('Unable to refresh analytics right now. Showing cached data.')
    } finally {
      setIsRefreshing(false)
    }
  }, []) // No dependencies - refresh function is stable

  useEffect(() => {
    const timer = setInterval(() => {
      void refresh()
    }, REFRESH_INTERVAL_MS)

    return () => {
      clearInterval(timer)
    }
  }, [refresh]) // Includes refresh in dependencies as required

  return (
    <div className="flex flex-col gap-10">
      <ItemGroup className="flex-wrap gap-3">
        <Item className="flex-col items-start gap-1">
          <ItemContent>
            <ItemTitle>Platform Analytics Overview</ItemTitle>
            <ItemDescription>
              Aggregated growth and retention metrics across the platform. Last updated {lastUpdatedLabel}.
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item className="items-center gap-3" variant="muted" size="sm">
          <ItemContent>
            <ItemDescription>Auto-refresh 60s</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ButtonGroup>
              <Button variant="outline" size="sm" onClick={refresh} disabled={isRefreshing}>
                {isRefreshing ? <Spinner className="mr-2" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Refresh
              </Button>
            </ButtonGroup>
          </ItemActions>
        </Item>
      </ItemGroup>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to refresh analytics</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <MetricSummaryCards
        growth={data.growth.summary}
        acquisition={data.acquisition}
        retention={data.retention}
      />

      <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <GrowthTrendPanel series={data.growth.series} timeframe={data.timeframe} />
        <AcquisitionPanel acquisition={data.acquisition} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <RetentionPanel retention={data.retention} />
        <FeatureUsagePanel featureUsage={data.featureUsage} />
      </div>

      <PerformanceBenchmarksTable performance={data.performance} />
    </div>
  )
}
