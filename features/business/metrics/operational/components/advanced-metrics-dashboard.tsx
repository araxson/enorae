'use client'

import { TrendingUp, AlertTriangle, Activity, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Grid, Stack, Flex } from '@/components/layout'
import { H4, P, Muted } from '@/components/ui/typography'
import type { Database } from '@/lib/types/database.types'

type OperationalMetric = Database['public']['Views']['operational_metrics']['Row']

interface AdvancedMetricsDashboardProps {
  metric: OperationalMetric
}

export function AdvancedMetricsDashboard({ metric }: AdvancedMetricsDashboardProps) {
  // Parse JSON fields safely
  const streamingMetrics = metric.streaming_metrics
    ? (typeof metric.streaming_metrics === 'string'
        ? JSON.parse(metric.streaming_metrics)
        : metric.streaming_metrics)
    : null

  const predictedDemand = metric.predicted_demand
    ? (typeof metric.predicted_demand === 'string'
        ? JSON.parse(metric.predicted_demand)
        : metric.predicted_demand)
    : null

  const trendIndicators = metric.trend_indicators
    ? (typeof metric.trend_indicators === 'string'
        ? JSON.parse(metric.trend_indicators)
        : metric.trend_indicators)
    : null

  const anomalyScore = metric.anomaly_score || 0
  const forecastAccuracy = metric.forecast_accuracy || 0

  // Determine anomaly severity
  const getAnomalySeverity = (score: number) => {
    if (score > 0.7) return { level: 'high', color: 'destructive' as const, label: 'High Risk' }
    if (score > 0.4) return { level: 'medium', color: 'secondary' as const, label: 'Medium Risk' }
    return { level: 'low', color: 'default' as const, label: 'Normal' }
  }

  const anomalySeverity = getAnomalySeverity(anomalyScore)

  return (
    <Stack gap="lg">
      {/* Real-Time Updates */}
      <Card>
        <CardHeader>
          <Flex justify="between" align="center">
            <CardTitle>Real-Time Monitoring</CardTitle>
            <Badge variant="secondary">
              <Activity className="h-3 w-3 mr-1" />
              {metric.real_time_updates_count || 0} updates
            </Badge>
          </Flex>
        </CardHeader>
        <CardContent>
          <Stack gap="sm">
            <Flex justify="between">
              <Muted>Last Update</Muted>
              <P className="text-sm">
                {metric.last_real_time_update
                  ? new Date(metric.last_real_time_update).toLocaleString()
                  : 'No updates yet'}
              </P>
            </Flex>

            {streamingMetrics && (
              <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                <H4 className="text-sm mb-2">Streaming Metrics</H4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(streamingMetrics as Record<string, unknown>).map(([key, value]) => (
                    <div key={key}>
                      <Muted className="text-xs capitalize">
                        {key.replace(/_/g, ' ')}
                      </Muted>
                      <P className="text-sm font-medium">{String(value)}</P>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Anomaly Detection */}
      <Card>
        <CardHeader>
          <Flex justify="between" align="center">
            <CardTitle>Anomaly Detection</CardTitle>
            <Badge variant={anomalySeverity.color}>{anomalySeverity.label}</Badge>
          </Flex>
        </CardHeader>
        <CardContent>
          <Stack gap="md">
            <div>
              <Flex justify="between" align="center" className="mb-2">
                <Muted>Anomaly Score</Muted>
                <P className="font-semibold">{(anomalyScore * 100).toFixed(1)}%</P>
              </Flex>
              <div className="w-full bg-secondary/20 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    anomalyScore > 0.7
                      ? 'bg-destructive'
                      : anomalyScore > 0.4
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${anomalyScore * 100}%` }}
                />
              </div>
            </div>

            {anomalyScore > 0.4 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <P className="text-sm font-medium">Unusual Pattern Detected</P>
                  <Muted className="text-xs">
                    Current metrics show deviation from normal patterns. Review your data for
                    irregularities.
                  </Muted>
                </div>
              </div>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Demand Forecasting */}
      {predictedDemand && (
        <Card>
          <CardHeader>
            <Flex justify="between" align="center">
              <CardTitle>Demand Forecasting</CardTitle>
              <Badge variant="default">
                <Target className="h-3 w-3 mr-1" />
                {(forecastAccuracy * 100).toFixed(0)}% accurate
              </Badge>
            </Flex>
          </CardHeader>
          <CardContent>
            <Grid cols={{ base: 1, md: 2 }} gap="md">
              {Object.entries(predictedDemand as Record<string, unknown>).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 bg-secondary/10 rounded-lg"
                >
                  <Muted className="text-xs capitalize mb-1">
                    {key.replace(/_/g, ' ')}
                  </Muted>
                  <P className="text-lg font-semibold">{String(value)}</P>
                </div>
              ))}
            </Grid>

            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Flex gap="sm" align="start">
                <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <P className="text-sm font-medium">Forecast Accuracy</P>
                  <Muted className="text-xs">
                    Predictions are {(forecastAccuracy * 100).toFixed(0)}% accurate based on
                    historical data
                  </Muted>
                </div>
              </Flex>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trend Indicators */}
      {trendIndicators && (
        <Card>
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
              {Object.entries(trendIndicators as Record<string, unknown>).map(([key, value]) => {
                const numValue = typeof value === 'number' ? value : parseFloat(String(value))
                const isPositive = numValue > 0

                return (
                  <div
                    key={key}
                    className="p-4 bg-secondary/10 rounded-lg"
                  >
                    <Muted className="text-xs capitalize mb-1">
                      {key.replace(/_/g, ' ')}
                    </Muted>
                    <Flex gap="sm" align="center">
                      <P
                        className={`text-lg font-semibold ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {String(value)}
                        {typeof value === 'number' && value < 1 && value > -1 ? '%' : ''}
                      </P>
                      <TrendingUp
                        className={`h-4 w-4 ${
                          isPositive ? 'text-green-600' : 'text-red-600 rotate-180'
                        }`}
                      />
                    </Flex>
                  </div>
                )
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Peak Performance */}
      <Grid cols={{ base: 1, md: 2 }} gap="md">
        <Card>
          <CardContent className="pt-6">
            <Stack gap="sm">
              <Muted className="text-xs">Peak Hour</Muted>
              <P className="text-2xl font-bold">
                {metric.peak_hour !== null && metric.peak_hour !== undefined
                  ? `${metric.peak_hour}:00`
                  : 'N/A'}
              </P>
              <Muted className="text-xs">Most appointments scheduled</Muted>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Stack gap="sm">
              <Muted className="text-xs">Busiest Day</Muted>
              <P className="text-2xl font-bold">
                {metric.busiest_day_of_week !== null
                  ? [
                      'Sunday',
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                    ][metric.busiest_day_of_week]
                  : 'N/A'}
              </P>
              <Muted className="text-xs">Highest traffic day of week</Muted>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Stack>
  )
}
