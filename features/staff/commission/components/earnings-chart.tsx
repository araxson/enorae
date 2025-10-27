'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { DailyEarnings } from '@/features/staff/commission/api/queries'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts'
import { TrendingUp } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type EarningsChartProps = {
  data: DailyEarnings[]
}

export function EarningsChart({ data }: EarningsChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <CardTitle>Earnings Trend</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TrendingUp className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No earnings data</EmptyTitle>
              <EmptyDescription>Once you complete appointments, earnings performance appears here.</EmptyDescription>
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
          <Item variant="muted" size="sm">
            <ItemContent>
              <CardTitle>Earnings Trend (Last 30 Days)</CardTitle>
              <CardDescription>Daily revenue from completed appointments</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            earnings: { label: 'Earnings', color: 'hsl(var(--primary))' },
          }}
          className="h-64 w-full"
        >
          <ResponsiveContainer>
            <BarChart
              data={data.map((day) => ({
                label: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                earnings: Number(day.earnings.toFixed(2)),
                appointments: day.appointments,
              }))}
              margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" className="text-xs" tickLine={false} axisLine={false} />
              <YAxis className="text-xs" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="earnings" fill="var(--color-earnings)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
