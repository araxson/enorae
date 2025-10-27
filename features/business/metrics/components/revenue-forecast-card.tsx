'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import type { RevenueForecast } from '@/lib/utils/metrics'

type RevenueForecastCardProps = {
  forecast: RevenueForecast
}

export function RevenueForecastCard({ forecast }: RevenueForecastCardProps) {
  if (forecast.points.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast</CardTitle>
          <CardDescription>Not enough historical data to forecast</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const chartData = forecast.points.map((point) => ({
    date: format(new Date(point.date), 'MMM dd'),
    actual: point.actual ?? null,
    forecast: Number(point.forecast.toFixed(0)),
    baseline: Number(point.baseline.toFixed(0)),
    isFuture: point.actual === undefined,
  }))

  const upcoming = chartData.filter((point) => point.actual === null)
  const nextForecast = upcoming[0]
  const growthColor = forecast.projectedGrowth >= 0 ? 'text-primary' : 'text-destructive'

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Revenue Forecast</CardTitle>
          <CardDescription>Projected revenue using trend analysis</CardDescription>
        </div>
        {nextForecast ? (
          <Badge variant={forecast.projectedGrowth >= 0 ? 'default' : 'destructive'}>
            Next: ${nextForecast.forecast.toLocaleString()} · {forecast.projectedGrowth >= 0 ? '+' : ''}
            {forecast.projectedGrowth.toFixed(1)}%
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <ChartContainer
            config={{
              actual: { label: 'Actual', color: 'hsl(var(--chart-1))' },
              forecast: { label: 'Forecast', color: 'hsl(var(--chart-2))' },
              baseline: { label: 'Baseline', color: 'hsl(var(--muted-foreground))' },
            }}
            className="h-72 w-full"
          >
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="var(--color-actual)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="var(--color-forecast)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="var(--color-baseline)"
                  strokeWidth={1}
                  strokeDasharray="2 6"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Avg daily revenue</div>
              <div className="text-2xl font-semibold">
                ${forecast.averageRevenue.toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Projected change (next {forecast.points.filter((p) => p.actual === undefined).length} days)
              </div>
              <div className={`text-xl font-semibold ${growthColor}`}>
                {forecast.projectedGrowth >= 0 ? '+' : ''}
                {forecast.projectedGrowth.toFixed(1)}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Upcoming forecast</div>
              <ul className="space-y-1 text-sm">
                {upcoming.slice(0, 4).map((point) => (
                  <li key={point.date}>
                    <Card>
                      <CardContent className="flex items-center justify-between gap-4 py-3">
                        <span>{point.date}</span>
                        <span className="font-medium">${point.forecast.toLocaleString()}</span>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
