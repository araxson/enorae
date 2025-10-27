'use client'

import { Fragment } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Target,
  Award,
} from 'lucide-react'
import type {
  StaffPerformanceMetrics,
  StaffRevenueBreakdown,
  CustomerRelationship,
} from '@/features/staff/analytics/api/queries'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

interface StaffAnalyticsDashboardProps {
  metrics: StaffPerformanceMetrics
  revenueBreakdown: StaffRevenueBreakdown[]
  customerRelationships: CustomerRelationship[]
  earnings: {
    total_revenue: number
    estimated_commission: number
    commission_rate: number
    completed_appointments: number
    avg_earning_per_appointment: number
  }
}

export function StaffAnalyticsDashboard({
  metrics,
  revenueBreakdown,
  customerRelationships,
  earnings,
}: StaffAnalyticsDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(metrics.total_revenue)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(metrics.avg_appointment_value)} avg per appointment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Estimated Commission</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(earnings.estimated_commission)}</div>
            <p className="text-xs text-muted-foreground">
              {earnings.commission_rate}% commission rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{metrics.completed_appointments}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.total_appointments} total ({formatPercentage(metrics.completion_rate)} completion)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{metrics.unique_customers}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.repeat_customers} repeat customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="customers">Top Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Statistics</CardTitle>
                  <CardDescription>Your appointment performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Appointments</span>
                      <Badge variant="outline">{metrics.total_appointments}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <Badge variant="secondary">
                        {metrics.completed_appointments}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cancelled</span>
                      <Badge variant="destructive">{metrics.cancelled_appointments}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">No Shows</span>
                      <Badge variant="secondary">{metrics.no_show_appointments}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Rates</CardTitle>
                  <CardDescription>Completion and cancellation metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Completion Rate</span>
                        <span className="text-sm font-semibold text-primary">
                          {formatPercentage(metrics.completion_rate)}
                        </span>
                      </div>
                      <Progress value={metrics.completion_rate} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Cancellation Rate</span>
                        <span className="text-sm font-semibold text-destructive">
                          {formatPercentage(metrics.cancellation_rate)}
                        </span>
                      </div>
                      <Progress value={metrics.cancellation_rate} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Revenue Breakdown</CardTitle>
                <CardDescription>Revenue generated by each service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBreakdown.length > 0 ? (
                    <div className="flex flex-col">
                      {revenueBreakdown.map((service, index) => (
                        <Fragment key={service.service_id}>
                          <article className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                            <div className="space-y-1">
                              <p className="font-medium">{service.service_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {service.bookings_count} bookings • {formatCurrency(service.avg_price)} avg
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(service.total_revenue)}</p>
                            </div>
                          </article>
                          {index < revenueBreakdown.length - 1 ? <Separator /> : null}
                        </Fragment>
                      ))}
                    </div>
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>No revenue data available</EmptyTitle>
                        <EmptyDescription>Select a different period to see revenue performance.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Your most loyal customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerRelationships.length > 0 ? (
                    <div className="flex flex-col">
                      {customerRelationships.map((customer, index) => (
                        <Fragment key={customer.customer_id}>
                          <article className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                            <div className="flex-1 space-y-1">
                              <p className="font-medium">{customer.customer_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {customer.total_appointments} appointments • Last visit:{' '}
                                {new Date(customer.last_appointment_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(customer.total_spent)}</p>
                              <p className="text-xs text-muted-foreground">Total spent</p>
                            </div>
                          </article>
                          {index < customerRelationships.length - 1 ? <Separator /> : null}
                        </Fragment>
                      ))}
                    </div>
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>No customer data available</EmptyTitle>
                        <EmptyDescription>Engage with clients to populate top customer insights.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
