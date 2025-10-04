'use client'

import {
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Grid, Stack } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
import type {
  ServiceDistribution,
  PeakHoursData,
  StaffPerformance,
} from '../api/queries'

type ComputedMetrics = {
  staffUtilizationRate: number
  activeStaff: number
  totalStaff: number
  completionRate: number
  completedAppointments: number
  totalAppointments: number
  capacityUtilization: number
  bookedHours: number
  totalCapacityHours: number
  noShowRate: number
  noShowAppointments: number
  cancelledAppointments: number
}

type Props = {
  metrics: ComputedMetrics
  serviceDistribution: ServiceDistribution[]
  peakHours: PeakHoursData[]
  staffPerformance: StaffPerformance[]
}

export function OperationalDashboard({
  metrics,
  serviceDistribution,
  peakHours,
  staffPerformance,
}: Props) {
  const formatPercent = (value: number) => `${value.toFixed(1)}%`
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`

  // Find peak hour
  const peakHour = peakHours.reduce(
    (max, curr) => (curr.appointmentCount > max.appointmentCount ? curr : max),
    peakHours[0]
  )

  return (
    <Stack gap="xl">
      {/* Key Metrics Grid */}
      <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(metrics.staffUtilizationRate)}</div>
            <Progress value={Math.min(metrics.staffUtilizationRate, 100)} className="mt-2" />
            <P className="text-xs text-muted-foreground mt-2">
              {metrics.activeStaff} of {metrics.totalStaff} staff active
            </P>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(metrics.completionRate)}</div>
            <Progress value={metrics.completionRate} className="mt-2" />
            <P className="text-xs text-muted-foreground mt-2">
              {metrics.completedAppointments} of {metrics.totalAppointments} completed
            </P>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(metrics.capacityUtilization)}</div>
            <Progress value={Math.min(metrics.capacityUtilization, 100)} className="mt-2" />
            <P className="text-xs text-muted-foreground mt-2">
              {metrics.bookedHours.toFixed(1)}h of {metrics.totalCapacityHours.toFixed(1)}h
            </P>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(metrics.noShowRate)}</div>
            <Progress value={metrics.noShowRate} className="mt-2" />
            <P className="text-xs text-muted-foreground mt-2">
              {metrics.noShowAppointments} no-shows
            </P>
          </CardContent>
        </Card>
      </Grid>

      {/* Appointment Breakdown */}
      <Grid cols={{ base: 1, lg: 2 }} gap="md">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>Breakdown of all appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <P>Completed</P>
                </div>
                <P className="font-semibold">{metrics.completedAppointments}</P>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <P>Cancelled</P>
                </div>
                <P className="font-semibold">{metrics.cancelledAppointments}</P>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <P>No-Show</P>
                </div>
                <P className="font-semibold">{metrics.noShowAppointments}</P>
              </div>
              <div className="border-t pt-2 flex items-center justify-between font-semibold">
                <P>Total</P>
                <P>{metrics.totalAppointments}</P>
              </div>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
            <CardDescription>Busiest time: {peakHour?.hour || 0}:00</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {peakHours
                .filter((h) => h.appointmentCount > 0)
                .sort((a, b) => b.appointmentCount - a.appointmentCount)
                .slice(0, 6)
                .map((hourData) => (
                  <div key={hourData.hour} className="flex items-center gap-2">
                    <Muted className="w-16">{hourData.hour}:00</Muted>
                    <Progress value={(hourData.appointmentCount / peakHour.appointmentCount) * 100} className="flex-1" />
                    <P className="w-8 text-right">{hourData.appointmentCount}</P>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Service Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Service Distribution</CardTitle>
          <CardDescription>Most popular services</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg Duration</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceDistribution
                .sort((a, b) => b.serviceCount - a.serviceCount)
                .slice(0, 10)
                .map((service) => (
                  <TableRow key={service.serviceName}>
                    <TableCell className="font-medium">{service.serviceName}</TableCell>
                    <TableCell className="text-right">{service.serviceCount}</TableCell>
                    <TableCell className="text-right">{formatCurrency(service.totalRevenue)}</TableCell>
                    <TableCell className="text-right">{service.avgDuration.toFixed(0)} min</TableCell>
                    <TableCell className="text-right">{formatPercent(service.percentageOfTotal)}</TableCell>
                  </TableRow>
                ))}
              {serviceDistribution.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <Muted>No service data available</Muted>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
          <CardDescription>Individual staff metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead className="text-right">Appointments</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Utilization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffPerformance.map((staff) => (
                <TableRow key={staff.staffId}>
                  <TableCell className="font-medium">{staff.staffName}</TableCell>
                  <TableCell className="text-right">{staff.totalAppointments}</TableCell>
                  <TableCell className="text-right">{staff.completedAppointments}</TableCell>
                  <TableCell className="text-right">{formatCurrency(staff.totalRevenue)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={staff.utilizationRate > 80 ? 'default' : 'secondary'}>
                      {formatPercent(Math.min(staff.utilizationRate, 100))}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {staffPerformance.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <Muted>No staff data available</Muted>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  )
}
