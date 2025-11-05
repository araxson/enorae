'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils/index'
import type { RevenueForecast } from '@/features/business/metrics/utils'

type RevenueForecastCardProps = {
  forecast: RevenueForecast
}

export function RevenueForecastCard({ forecast }: RevenueForecastCardProps) {
  if (forecast.points.length === 0) {
    return (
      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Revenue Forecast</ItemTitle>
          <ItemDescription>Not enough historical data to forecast</ItemDescription>
        </ItemHeader>
      </Item>
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
  const metricValueClass = 'text-2xl font-semibold leading-none tracking-tight'

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <ItemTitle>Revenue Forecast</ItemTitle>
            <ItemDescription>Projected revenue using trend analysis</ItemDescription>
          </div>
          {nextForecast ? (
            <Badge variant={forecast.projectedGrowth >= 0 ? 'default' : 'destructive'}>
              Next: ${nextForecast.forecast.toLocaleString()} · {forecast.projectedGrowth >= 0 ? '+' : ''}
              {forecast.projectedGrowth.toFixed(1)}%
            </Badge>
          ) : null}
        </div>
      </ItemHeader>
      <ItemContent>
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <ChartContainer
            config={{
              actual: { label: 'Actual', color: 'var(--chart-1)' },
              forecast: { label: 'Forecast', color: 'var(--chart-2)' },
              baseline: { label: 'Baseline', color: 'var(--muted-foreground)' },
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

          <ItemGroup className="space-y-4">
            <Item variant="muted" className="flex-col">
              <ItemContent className="gap-2">
                <ItemTitle>Avg daily revenue</ItemTitle>
                <p className={metricValueClass}>${forecast.averageRevenue.toFixed(0)}</p>
              </ItemContent>
            </Item>

            <Item variant="muted" className="flex-col">
              <ItemContent className="gap-2">
                <ItemTitle>
                  Projected change (next {forecast.points.filter((p) => p.actual === undefined).length} days)
                </ItemTitle>
                <div className={cn('text-xl font-semibold', growthColor)}>
                  {forecast.projectedGrowth >= 0 ? '+' : ''}
                  {forecast.projectedGrowth.toFixed(1)}%
                </div>
              </ItemContent>
            </Item>

            <Item variant="outline" className="flex-col">
              <ItemContent className="gap-3">
                <ItemTitle>Upcoming forecast</ItemTitle>
                <ItemGroup className="space-y-2">
                  {upcoming.slice(0, 4).map((point) => (
                    <Item
                      key={point.date}
                      variant="muted"
                      className="items-center justify-between"
                    >
                      <ItemHeader>
                        <ItemTitle>{point.date}</ItemTitle>
                        <div className="text-sm font-medium">
                          ${point.forecast.toLocaleString()}
                        </div>
                      </ItemHeader>
                    </Item>
                  ))}
                </ItemGroup>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>
      </ItemContent>
    </Item>
  )
}
