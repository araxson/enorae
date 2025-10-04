'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack, Flex } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'

import type { ServiceRevenue } from '../api/enhanced-queries'

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
          <Muted>No service data available</Muted>
        </CardContent>
      </Card>
    )
  }

  const totalRevenue = data.reduce((sum, s) => sum + s.revenue, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Service</CardTitle>
        <Muted>This month&apos;s performance breakdown</Muted>
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          {data.map((service) => {
            const percentage = totalRevenue > 0 ? (service.revenue / totalRevenue) * 100 : 0
            return (
              <div key={service.service_name} className="space-y-2">
                <Flex justify="between" align="center">
                  <div className="flex-1">
                    <P className="text-sm font-medium">{service.service_name}</P>
                    <Muted className="text-xs">{service.count} appointments</Muted>
                  </div>
                  <div className="text-right">
                    <P className="text-sm font-bold">${service.revenue.toFixed(2)}</P>
                    <Muted className="text-xs">{percentage.toFixed(1)}%</Muted>
                  </div>
                </Flex>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}
