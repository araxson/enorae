'use client'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { format } from 'date-fns'
import type { Database } from '@/lib/types/database.types'

type DailyMetric = Database['public']['Views']['daily_metrics']['Row'] & { metric_at: string }

interface RevenueChartProps {
  data: DailyMetric[]
}

const chartConfig = {
  total_revenue: {
    label: 'Total Revenue',
    color: 'hsl(var(--primary))',
  },
  service_revenue: {
    label: 'Service Revenue',
    color: 'hsl(var(--chart-1))',
  },
  product_revenue: {
    label: 'Product Revenue',
    color: 'hsl(var(--chart-2))',
  },
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Transform data for the chart
  const chartData = data.map((metric) => ({
    date: format(new Date(metric['metric_at']), 'MMM dd'),
    total: Number(metric['total_revenue']) || 0,
    service: Number(metric['service_revenue']) || 0,
    product: Number(metric['product_revenue']) || 0,
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="flex h-72 items-center justify-center text-muted-foreground">
          No revenue data to display
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Last {data.length} days of revenue performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-total_revenue)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-total_revenue)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillService" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-service_revenue)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-service_revenue)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillProduct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-product_revenue)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-product_revenue)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
              className="text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="service"
              stroke="var(--color-service_revenue)"
              fill="url(#fillService)"
              fillOpacity={0.6}
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="product"
              stroke="var(--color-product_revenue)"
              fill="url(#fillProduct)"
              fillOpacity={0.6}
              stackId="1"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
