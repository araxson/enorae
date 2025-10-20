'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DailyEarnings } from '../api/queries'

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

  const maxEarnings = Math.max(...data.map((d) => d.earnings))
  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Trend (Last 30 Days)</CardTitle>
        <p className="text-sm text-muted-foreground">Daily revenue from completed appointments</p>
      </CardHeader>
      <CardContent>
        <div className="relative h-52">
          <div className="flex h-full items-end justify-between gap-1">
            {data.map((day) => {
              const height = maxEarnings > 0 ? (day.earnings / maxEarnings) * 100 : 0
              return (
                <div key={day.date} className="flex-1 group relative">
                  <div
                    className="bg-primary hover:bg-primary/80 transition-colors rounded-t cursor-pointer"
                    style={{ height: `${height}%` }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-popover border rounded-md px-2 py-1 shadow-md whitespace-nowrap z-10">
                    <p className="text-xs font-medium">${day.earnings.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-muted-foreground">{day.appointments} appointments</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          <span>
            {new Date(data[data.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
