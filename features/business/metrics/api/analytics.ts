import type { DailyMetricWithTimestamp } from '@/features/business/metrics/api/queries'

type PeriodStats = {
  totalRevenue: number
  totalAppointments: number
  newCustomers: number
  returningCustomers: number
}

type ComparisonMetric = {
  current: number
  previous: number
  change: number
}

export type MetricsComparison = {
  revenue: ComparisonMetric
  appointments: ComparisonMetric
  newCustomers: ComparisonMetric
  retentionRate: ComparisonMetric
}

export type ForecastPoint = {
  date: string
  actual?: number
  forecast: number
  baseline: number
}

export type RevenueForecast = {
  points: ForecastPoint[]
  averageRevenue: number
  projectedGrowth: number
}

const DAYS_IN_COMPARISON = 7
const FORECAST_HORIZON = 7

function sumPeriodStats(metrics: DailyMetricWithTimestamp[]): PeriodStats {
  return metrics.reduce<PeriodStats>(
    (acc, metric) => ({
      totalRevenue: acc['totalRevenue'] + Number(metric['total_revenue'] || 0),
      totalAppointments: acc['totalAppointments'] + Number(metric['total_appointments'] || 0),
      newCustomers: acc['newCustomers'] + Number(metric['new_customers'] || 0),
      returningCustomers: acc['returningCustomers'] + Number(metric['returning_customers'] || 0),
    }),
    {
      totalRevenue: 0,
      totalAppointments: 0,
      newCustomers: 0,
      returningCustomers: 0,
    }
  )
}

function computeChange(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }

  return ((current - previous) / previous) * 100
}

export function buildPeriodComparisons(
  metrics: DailyMetricWithTimestamp[]
): MetricsComparison {
  if (metrics.length === 0) {
    return {
      revenue: { current: 0, previous: 0, change: 0 },
      appointments: { current: 0, previous: 0, change: 0 },
      newCustomers: { current: 0, previous: 0, change: 0 },
      retentionRate: { current: 0, previous: 0, change: 0 },
    }
  }

  const sorted = [...metrics].sort(
    (a, b) => new Date(a['metric_at']).getTime() - new Date(b['metric_at']).getTime()
  )

  const currentPeriod = sorted.slice(-DAYS_IN_COMPARISON)
  const previousPeriod = sorted.slice(-DAYS_IN_COMPARISON * 2, -DAYS_IN_COMPARISON)

  const currentStats = sumPeriodStats(currentPeriod)
  const previousStats = sumPeriodStats(previousPeriod)

  const currentRetentionDenominator =
    currentStats['newCustomers'] + currentStats['returningCustomers']
  const previousRetentionDenominator =
    previousStats['newCustomers'] + previousStats['returningCustomers']

  const currentRetention =
    currentRetentionDenominator === 0
      ? 0
      : (currentStats['returningCustomers'] / currentRetentionDenominator) * 100

  const previousRetention =
    previousRetentionDenominator === 0
      ? 0
      : (previousStats['returningCustomers'] / previousRetentionDenominator) * 100

  return {
    revenue: {
      current: currentStats['totalRevenue'],
      previous: previousStats['totalRevenue'],
      change: computeChange(currentStats['totalRevenue'], previousStats['totalRevenue']),
    },
    appointments: {
      current: currentStats['totalAppointments'],
      previous: previousStats['totalAppointments'],
      change: computeChange(
        currentStats['totalAppointments'],
        previousStats['totalAppointments']
      ),
    },
    newCustomers: {
      current: currentStats['newCustomers'],
      previous: previousStats['newCustomers'],
      change: computeChange(currentStats['newCustomers'], previousStats['newCustomers']),
    },
    retentionRate: {
      current: currentRetention,
      previous: previousRetention,
      change: computeChange(currentRetention, previousRetention),
    },
  }
}

export function buildRevenueForecast(
  metrics: DailyMetricWithTimestamp[],
  horizon: number = FORECAST_HORIZON
): RevenueForecast {
  if (metrics.length === 0) {
    return {
      points: [],
      averageRevenue: 0,
      projectedGrowth: 0,
    }
  }

  const sorted = [...metrics].sort(
    (a, b) => new Date(a['metric_at']).getTime() - new Date(b['metric_at']).getTime()
  )

  const historical = sorted.map((metric, index) => ({
    index,
    date: metric['metric_at'],
    revenue: Number(metric['total_revenue'] || 0),
  }))

  const revenueValues = historical.map((entry) => entry.revenue)
  const averageRevenue =
    revenueValues.reduce((sum, value) => sum + value, 0) / revenueValues.length

  // Simple linear regression for trend line
  const n = historical.length
  const sumX = historical.reduce((sum, entry) => sum + entry.index, 0)
  const sumY = revenueValues.reduce((sum, value) => sum + value, 0)
  const sumX2 = historical.reduce((sum, entry) => sum + entry.index ** 2, 0)
  const sumXY = historical.reduce(
    (sum, entry) => sum + entry.index * entry.revenue,
    0
  )

  const denominator = n * sumX2 - sumX ** 2
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0
  const intercept = (sumY - slope * sumX) / n

  const lastIndex = historical.at(-1)?.index ?? 0
  const lastDate = historical.at(-1)?.date
  const baseline = revenueValues.slice(-DAYS_IN_COMPARISON)
  const baselineAverage =
    baseline.length > 0
      ? baseline.reduce((sum, value) => sum + value, 0) / baseline.length
      : averageRevenue

  const forecastPoints: ForecastPoint[] = historical.map((entry) => ({
    date: entry['date'],
    actual: entry.revenue,
    forecast: entry.revenue,
    baseline: baselineAverage,
  }))

  if (!lastDate) {
    return {
      points: forecastPoints,
      averageRevenue,
      projectedGrowth: 0,
    }
  }

  const lastDateObj = new Date(lastDate)
  const futurePoints: ForecastPoint[] = []

  for (let i = 1; i <= horizon; i += 1) {
    const futureDate = new Date(lastDateObj)
    futureDate.setDate(futureDate.getDate() + i)

    const x = lastIndex + i
    const predicted = Math.max(intercept + slope * x, 0)

    futurePoints.push({
      date: futureDate.toISOString().split('T')[0],
      forecast: predicted,
      baseline: baselineAverage,
    })
  }

  const projectedGrowth =
    averageRevenue === 0
      ? 0
      : ((futurePoints.reduce((sum, entry) => sum + entry.forecast, 0) /
          futurePoints.length -
          averageRevenue) /
          averageRevenue) *
        100

  return {
    points: [...forecastPoints, ...futurePoints],
    averageRevenue,
    projectedGrowth,
  }
}
