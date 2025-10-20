'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DailyEarnings } from '../api/queries'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts'

type EarningsChartProps = {
  data: DailyEarnings[]
}

export function EarningsChart({ data }: EarningsChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earnings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No earnings data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Trend (Last 30 Days)</CardTitle>
        <p className="text-sm text-muted-foreground">Daily revenue from completed appointments</p>
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
