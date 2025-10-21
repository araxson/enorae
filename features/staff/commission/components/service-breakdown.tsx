'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

import type { ServiceRevenue } from '../api/queries'

type ServiceBreakdownProps = {
  data: ServiceRevenue[]
}

export function ServiceBreakdown({ data }: ServiceBreakdownProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Service</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No service data available</p>
        </CardContent>
      </Card>
    )
  }

  const totalRevenue = data.reduce((sum, s) => sum + s.revenue, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Service</CardTitle>
        <p className="text-sm text-muted-foreground">This month&apos;s performance breakdown</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {data.map((service) => {
            const percentage = totalRevenue > 0 ? (service.revenue / totalRevenue) * 100 : 0
            return (
              <div key={service.service_name} className="space-y-2">
                <div className="flex gap-4 items-center justify-between">
                  <div className="flex-1">
                    <p className="leading-7 text-sm font-medium">{service.service_name}</p>
                    <p className="text-sm text-muted-foreground text-xs">{service.count} appointments</p>
                  </div>
                  <div className="text-right">
                    <p className="leading-7 text-sm font-bold">${service.revenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground text-xs">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
