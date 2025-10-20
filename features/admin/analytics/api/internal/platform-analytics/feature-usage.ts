import type { FeatureUsageItem } from '../../admin-analytics-types'

type DailyMetricsRow = {
  streaming_metrics: Record<string, unknown> | null
}

export function buildFeatureUsageItems(dailyMetrics: DailyMetricsRow[]): FeatureUsageItem[] {
  const featureCounts = new Map<string, number>()

  dailyMetrics.forEach((row) => {
    const metrics = row.streaming_metrics
    if (!metrics || Array.isArray(metrics) || typeof metrics !== 'object') return

    Object.entries(metrics).forEach(([key, value]) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        featureCounts.set(key, (featureCounts.get(key) ?? 0) + value)
      }
    })
  })

  return Array.from(featureCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, count]) => ({ key, count }))
}
