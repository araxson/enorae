import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, TrendingUp, AlertTriangle, Clock, Calendar } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type OperationalMetric = Database['public']['Views']['operational_metrics']['Row']

type OperationalDashboardProps = {
  metrics: OperationalMetric | null
}

export function OperationalDashboard({ metrics }: OperationalDashboardProps) {
  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Operational Metrics</CardTitle>
          <CardDescription>No operational data available</CardDescription>
        </CardHeader>
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
      <div>
        <h2 className="text-2xl font-bold">Operational Intelligence</h2>
        <p className="text-sm text-muted-foreground">Real-time operational insights and forecasting</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Peak Hour</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{peakHour}:00</div>
            <p className="text-xs text-muted-foreground">Busiest time of day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Busiest Day</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{busiestDayName}</div>
            <p className="text-xs text-muted-foreground">Highest demand day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Anomaly Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{anomalyScore.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {anomalyScore > 0.7 ? 'High anomaly detected' : 'Normal operations'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Forecast Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(forecastAccuracy * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Prediction confidence</p>
          </CardContent>
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
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Real-time Updates</span>
              <Badge variant="secondary">{realtimeUpdates} updates</Badge>
            </div>
            {metrics['last_real_time_update'] && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Update</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(metrics['last_real_time_update']).toLocaleString()}
                </span>
              </div>
            )}
          </div>
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
