'use client'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Scissors } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

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
    color: 'hsl(var(--chart-1))',
  },
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-2))',
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
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>{title}</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <Empty className="h-72">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Scissors className="h-8 w-8" aria-hidden="true" />
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
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
            </ItemContent>
            {description ? (
              <ItemContent>
                <ItemDescription>{description}</ItemDescription>
              </ItemContent>
            ) : null}
          </Item>
        </ItemGroup>
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
