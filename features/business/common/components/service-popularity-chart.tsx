'use client'

import { Scissors } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

interface ServicePopularityChartProps {
  data: {
    name: string
    count: number
    revenue: number
  }[]
  title?: string
  description?: string
}

const chartConfig = {
  count: {
    label: 'Bookings',
    color: 'var(--chart-1)',
  },
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-2)',
  },
}

export function ServicePopularityChart({
  data,
  title = 'Popular Services',
  description = 'Top services by bookings'
}: ServicePopularityChartProps) {
  const chartData = data.slice(0, 8).map(service => ({
    ...service,
    displayName: service.name.length > 20 ? service.name.substring(0, 20) + '...' : service.name
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty className="h-72">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Scissors className="size-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No service data available</EmptyTitle>
              <EmptyDescription>Service popularity metrics will appear once bookings are made</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="displayName"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                className="text-xs"
                height={80}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
