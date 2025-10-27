'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { PieChart } from 'lucide-react'

import type { ServiceRevenue } from '@/features/staff/commission/api/queries'

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
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PieChart className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No service data available</EmptyTitle>
              <EmptyDescription>Once services generate revenue, the breakdown appears here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const totalRevenue = data.reduce((sum, s) => sum + s.revenue, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Service</CardTitle>
        <CardDescription>This month&apos;s performance breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="text-right">Appointments</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
              <TableHead className="w-32">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((service) => {
              const percentage = totalRevenue > 0 ? (service.revenue / totalRevenue) * 100 : 0
              return (
                <TableRow key={service.service_name}>
                  <TableCell className="font-medium">{service.service_name}</TableCell>
                  <TableCell className="text-right">{service.count}</TableCell>
                  <TableCell className="text-right font-semibold">${service.revenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{percentage.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Progress value={percentage} className="h-2" />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
