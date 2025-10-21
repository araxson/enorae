'use client'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FunnelChart, Funnel, LabelList, ResponsiveContainer } from 'recharts'

interface AppointmentConversionChartProps {
  data: {
    total: number
    confirmed: number
    completed: number
    cancelled: number
    noShow: number
  }
}

const chartConfig = {
  value: {
    label: 'Appointments',
    color: 'hsl(var(--primary))',
  },
}

export function AppointmentConversionChart({ data }: AppointmentConversionChartProps) {
  const chartData = [
    { name: 'Total Appointments', value: data.total, fill: 'hsl(var(--chart-1))' },
    { name: 'Confirmed', value: data.confirmed, fill: 'hsl(var(--chart-2))' },
    { name: 'Completed', value: data.completed, fill: 'hsl(var(--chart-3))' },
  ]

  const conversionRate = data.total > 0 ? ((data.completed / data.total) * 100).toFixed(1) : '0.0'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Conversion Funnel</CardTitle>
        <CardDescription>
          {conversionRate}% completion rate • {data.cancelled} cancelled • {data.noShow} no-shows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Funnel dataKey="value" data={chartData} isAnimationActive>
                <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
                <LabelList position="inside" fill="hsl(var(--background))" stroke="none" dataKey="value" />
              </Funnel>
              <ChartTooltip content={<ChartTooltipContent />} />
            </FunnelChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
