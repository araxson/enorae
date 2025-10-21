'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PlatformAnalyticsSnapshot } from '../api/admin-analytics-types'
import { MetricSummaryCards } from './metric-summary-cards'
import { GrowthTrendPanel } from './growth-trend-panel'
import { AcquisitionPanel } from './acquisition-panel'
import { RetentionPanel } from './retention-panel'
import { FeatureUsagePanel } from './feature-usage-panel'
import { PerformanceBenchmarksTable } from './performance-benchmarks-table'

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
    } catch (err) {
      console.error('[PlatformAnalyticsDashboard] refresh failed', err)
      setError('Unable to refresh analytics right now. Showing cached data.')
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
          <h2 className="scroll-m-20 text-3xl font-semibold mb-1">Platform Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">
            Aggregated growth and retention metrics across the platform. Last updated {lastUpdatedLabel}.
          </p>
          {error && (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Auto-refresh 60s
          </p>
          <Button variant="outline" size="sm" onClick={refresh} disabled={isRefreshing}>
            <RefreshCw className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

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
