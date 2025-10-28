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
import { DollarSign } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { format } from 'date-fns'

interface RevenueTrendChartProps {
  data: {
    date: string
    revenue: number
    serviceRevenue?: number
    productRevenue?: number
  }[]
  title?: string
  showBreakdown?: boolean
}

const chartConfig = {
  revenue: {
    label: 'Total Revenue',
    color: 'hsl(var(--primary))',
  },
  serviceRevenue: {
    label: 'Service Revenue',
    color: 'hsl(var(--chart-1))',
  },
  productRevenue: {
    label: 'Product Revenue',
    color: 'hsl(var(--chart-2))',
  },
}

export function RevenueTrendChart({
  data,
  title = 'Revenue Trend',
  showBreakdown = true
}: RevenueTrendChartProps) {
  const chartData = data.map(item => ({
    ...item,
    displayDate: format(new Date(item.date), 'MMM dd'),
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

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
                <DollarSign className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No revenue data available</EmptyTitle>
              <EmptyDescription>Revenue trends will appear once transactions are recorded</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>
                Total: {formatCurrency(totalRevenue)} • Last {data.length} days
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="displayDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatCurrency}
                className="text-xs"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
                name="Total Revenue"
              />
              {showBreakdown && (
                <>
                  <Line
                    type="monotone"
                    dataKey="serviceRevenue"
                    stroke="var(--color-serviceRevenue)"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                    name="Service Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="productRevenue"
                    stroke="var(--color-productRevenue)"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                    name="Product Revenue"
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
