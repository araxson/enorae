import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, TrendingUp, AlertTriangle, Clock, Calendar } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import type { Database } from '@/lib/types/database.types'

type OperationalMetric = Database['public']['Views']['operational_metrics_view']['Row']

type OperationalDashboardProps = {
  metrics: OperationalMetric | null
}

export function OperationalDashboard({ metrics }: OperationalDashboardProps) {
  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Operational Metrics</CardTitle>
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

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const busiestDayName = dayNames[busiestDay] || 'Unknown'

  return (
    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel>Operational intelligence</FieldLabel>
        <FieldContent>
          <FieldDescription>Real-time operational insights and forecasting</FieldDescription>
        </FieldContent>
      </Field>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <CardTitle>Peak Hour</CardTitle>
                  <CardDescription>Busiest time of day</CardDescription>
                </ItemContent>
                <ItemActions className="flex-none text-muted-foreground">
                  <Clock className="h-4 w-4" />
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{peakHour}:00</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <CardTitle>Busiest Day</CardTitle>
                  <CardDescription>Highest demand day</CardDescription>
                </ItemContent>
                <ItemActions className="flex-none text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{busiestDayName}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <CardTitle>Anomaly Score</CardTitle>
                  <CardDescription>
                    {anomalyScore > 0.7 ? 'High anomaly detected' : 'Normal operations'}
                  </CardDescription>
                </ItemContent>
                <ItemActions className="flex-none text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{anomalyScore.toFixed(2)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <CardTitle>Forecast Accuracy</CardTitle>
                  <CardDescription>Prediction confidence</CardDescription>
                </ItemContent>
                <ItemActions className="flex-none text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{(forecastAccuracy * 100).toFixed(1)}%</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <CardTitle>Real-Time Monitoring</CardTitle>
          </div>
          <CardDescription>Live operational updates</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemGroup className="flex flex-col gap-4">
            <Item>
              <ItemContent>
                <ItemTitle>Real-time updates</ItemTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <Badge variant="secondary">{realtimeUpdates} updates</Badge>
              </ItemActions>
            </Item>
            {metrics['last_real_time_update'] ? (
              <Item>
                <ItemContent>
                  <ItemTitle>Last update</ItemTitle>
                </ItemContent>
                <ItemActions className="flex-none text-muted-foreground">
                  <ItemDescription>
                    {new Date(metrics['last_real_time_update']).toLocaleString()}
                  </ItemDescription>
                </ItemActions>
              </Item>
            ) : null}
          </ItemGroup>
        </CardContent>
      </Card>

      {metrics['predicted_demand'] && (
        <Card>
          <CardHeader>
            <CardTitle>Demand Forecast</CardTitle>
            <CardDescription>AI-powered demand prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(metrics['predicted_demand'], null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {metrics['trend_indicators'] && (
        <Card>
          <CardHeader>
            <CardTitle>Trend Indicators</CardTitle>
            <CardDescription>Performance trends and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(metrics['trend_indicators'], null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
