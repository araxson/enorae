import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import type { Database } from '@/lib/types/database.types'
import { PeakHourCard } from './peak-hour-card'
import { BusiestDayCard } from './busiest-day-card'
import { AnomalyScoreCard } from './anomaly-score-card'
import { ForecastAccuracyCard } from './forecast-accuracy-card'
import { RealtimeMonitoringCard } from './realtime-monitoring-card'
import { DemandForecastCard } from './demand-forecast-card'
import { TrendIndicatorsCard } from './trend-indicators-card'

type OperationalMetric = Database['public']['Views']['operational_metrics_view']['Row']

type OperationalDashboardProps = {
  metrics: OperationalMetric | null
}

export function OperationalDashboard({ metrics }: OperationalDashboardProps) {
  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Operational Metrics</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No operational data</EmptyTitle>
              <EmptyDescription>Metrics will appear once operational tracking is enabled.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const peakHour = metrics['peak_hour'] ?? 0
  const busiestDay = metrics['busiest_day_of_week'] ?? 0
  const anomalyScore = metrics['anomaly_score'] ?? 0
  const forecastAccuracy = metrics['forecast_accuracy'] ?? 0
  const realtimeUpdates = metrics['real_time_updates_count'] ?? 0

  return (
    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel>Operational intelligence</FieldLabel>
        <FieldContent>
          <FieldDescription>Real-time operational insights and forecasting</FieldDescription>
        </FieldContent>
      </Field>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <PeakHourCard peakHour={peakHour} />
        <BusiestDayCard busiestDay={busiestDay} />
        <AnomalyScoreCard anomalyScore={anomalyScore} />
        <ForecastAccuracyCard forecastAccuracy={forecastAccuracy} />
      </div>

      <RealtimeMonitoringCard realtimeUpdates={realtimeUpdates} lastUpdate={metrics['last_real_time_update']} />

      {metrics['predicted_demand'] && <DemandForecastCard predictedDemand={metrics['predicted_demand']} />}

      {metrics['trend_indicators'] && <TrendIndicatorsCard trendIndicators={metrics['trend_indicators']} />}
    </div>
  )
}
