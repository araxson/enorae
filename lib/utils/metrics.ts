import { ANALYTICS_CONFIG } from '@/lib/config/constants'
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

const PERCENTAGE_FULL_INCREASE = 100

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

/**
 * Calculate percentage change between current and previous period values
 * @param current - Current period value
 * @param previous - Previous period value
 * @returns Percentage change (positive for increase, negative for decrease)
 */
function computeChange(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : PERCENTAGE_FULL_INCREASE
  }

  return ((current - previous) / previous) * PERCENTAGE_FULL_INCREASE
}

/**
 * Build period-over-period comparison metrics
 * Compares current period against previous period for revenue, appointments, and customer metrics
 */
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

  const sortedMetrics = [...metrics].sort(
    (a, b) => new Date(a['metric_at']).getTime() - new Date(b['metric_at']).getTime()
  )

  const comparisonDays = ANALYTICS_CONFIG.PERIOD_COMPARISON_DAYS
  const currentPeriod = sortedMetrics.slice(-comparisonDays)
  const previousPeriod = sortedMetrics.slice(-comparisonDays * 2, -comparisonDays)

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

/**
 * Build revenue forecast using linear regression
 * Generates historical + future forecast points based on trend analysis
 * @param metrics - Historical daily metrics
 * @param horizon - Number of days to forecast into the future
 */
export function buildRevenueForecast(
  metrics: DailyMetricWithTimestamp[],
  horizon: number = ANALYTICS_CONFIG.REVENUE_FORECAST_HORIZON_DAYS
): RevenueForecast {
  if (metrics.length === 0) {
    return {
      points: [],
      averageRevenue: 0,
      projectedGrowth: 0,
    }
  }

  const sortedMetrics = [...metrics].sort(
    (metricA, metricB) => new Date(metricA['metric_at']).getTime() - new Date(metricB['metric_at']).getTime()
  )

  const historicalData = sortedMetrics.map((metric, index) => ({
    index,
    date: metric['metric_at'],
    revenue: Number(metric['total_revenue'] || 0),
  }))

  const revenueValues = historicalData.map((entry) => entry.revenue)
  const averageRevenue =
    revenueValues.reduce((sum, value) => sum + value, 0) / revenueValues.length

  // Simple linear regression for trend line: y = mx + b
  const dataPointCount = historicalData.length
  const sumOfIndices = historicalData.reduce((sum, entry) => sum + entry.index, 0)
  const sumOfRevenues = revenueValues.reduce((sum, value) => sum + value, 0)
  const sumOfSquaredIndices = historicalData.reduce((sum, entry) => sum + entry.index ** 2, 0)
  const sumOfProductIndexRevenue = historicalData.reduce(
    (sum, entry) => sum + entry.index * entry.revenue,
    0
  )

  const regressionDenominator = dataPointCount * sumOfSquaredIndices - sumOfIndices ** 2
  const trendSlope = regressionDenominator !== 0
    ? (dataPointCount * sumOfProductIndexRevenue - sumOfIndices * sumOfRevenues) / regressionDenominator
    : 0
  const trendIntercept = (sumOfRevenues - trendSlope * sumOfIndices) / dataPointCount

  const lastDataIndex = historicalData.at(-1)?.index ?? 0
  const lastDataDate = historicalData.at(-1)?.date
  const recentBaselinePeriod = revenueValues.slice(-ANALYTICS_CONFIG.PERIOD_COMPARISON_DAYS)
  const baselineAverage =
    recentBaselinePeriod.length > 0
      ? recentBaselinePeriod.reduce((sum, value) => sum + value, 0) / recentBaselinePeriod.length
      : averageRevenue

  const historicalForecastPoints: ForecastPoint[] = historicalData.map((entry) => ({
    date: entry['date'],
    actual: entry.revenue,
    forecast: entry.revenue,
    baseline: baselineAverage,
  }))

  if (!lastDataDate) {
    return {
      points: historicalForecastPoints,
      averageRevenue,
      projectedGrowth: 0,
    }
  }

  const lastDate = new Date(lastDataDate)
  const futureForecastPoints: ForecastPoint[] = []

  for (let dayOffset = 1; dayOffset <= horizon; dayOffset += 1) {
    const futureDate = new Date(lastDate)
    futureDate.setDate(futureDate.getDate() + dayOffset)

    const forecastIndex = lastDataIndex + dayOffset
    const predictedRevenue = Math.max(trendIntercept + trendSlope * forecastIndex, 0)

    const futureDateString = futureDate.toISOString().split('T')[0] ?? ''
    futureForecastPoints.push({
      date: futureDateString,
      forecast: predictedRevenue,
      baseline: baselineAverage,
    })
  }

  const averageForecastRevenue = futureForecastPoints.reduce((sum, entry) => sum + entry.forecast, 0) / futureForecastPoints.length
  const projectedGrowth =
    averageRevenue === 0
      ? 0
      : ((averageForecastRevenue - averageRevenue) / averageRevenue) * PERCENTAGE_FULL_INCREASE

  return {
    points: [...historicalForecastPoints, ...futureForecastPoints],
    averageRevenue,
    projectedGrowth,
  }
}
