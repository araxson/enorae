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
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'

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
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <CardTitle>Total Revenue</CardTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
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
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <Award className="h-4 w-4 text-primary" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <CardTitle>Estimated Commission</CardTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
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
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <CardTitle>Appointments</CardTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
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
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <CardTitle>Customers</CardTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
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
                  <ItemGroup>
                    <Item variant="muted" size="sm">
                      <ItemContent>
                        <CardTitle>Appointment Statistics</CardTitle>
                        <CardDescription>Your appointment performance metrics</CardDescription>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                </CardHeader>
                <CardContent>
                  <ItemGroup className="gap-3">
                    <Item>
                      <ItemContent>
                        <ItemDescription>Total Appointments</ItemDescription>
                      </ItemContent>
                      <ItemActions className="flex-none">
                        <Badge variant="outline">{metrics.total_appointments}</Badge>
                      </ItemActions>
                    </Item>
                    <Item>
                      <ItemContent>
                        <ItemDescription>Completed</ItemDescription>
                      </ItemContent>
                      <ItemActions className="flex-none">
                        <Badge variant="secondary">{metrics.completed_appointments}</Badge>
                      </ItemActions>
                    </Item>
                    <Item>
                      <ItemContent>
                        <ItemDescription>Cancelled</ItemDescription>
                      </ItemContent>
                      <ItemActions className="flex-none">
                        <Badge variant="destructive">{metrics.cancelled_appointments}</Badge>
                      </ItemActions>
                    </Item>
                    <Item>
                      <ItemContent>
                        <ItemDescription>No Shows</ItemDescription>
                      </ItemContent>
                      <ItemActions className="flex-none">
                        <Badge variant="secondary">{metrics.no_show_appointments}</Badge>
                      </ItemActions>
                    </Item>
                  </ItemGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <ItemGroup>
                    <Item variant="muted" size="sm">
                      <ItemContent>
                        <CardTitle>Performance Rates</CardTitle>
                        <CardDescription>Completion and cancellation metrics</CardDescription>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <ItemGroup>
                        <Item>
                          <ItemContent>
                            <ItemTitle>Completion Rate</ItemTitle>
                          </ItemContent>
                          <ItemActions className="flex-none">
                            <span className="text-sm font-semibold text-primary">
                              {formatPercentage(metrics.completion_rate)}
                            </span>
                          </ItemActions>
                        </Item>
                      </ItemGroup>
                      <Progress value={metrics.completion_rate} className="h-2" />
                    </div>
                    <div>
                      <ItemGroup>
                        <Item>
                          <ItemContent>
                            <ItemTitle>Cancellation Rate</ItemTitle>
                          </ItemContent>
                          <ItemActions className="flex-none">
                            <span className="text-sm font-semibold text-destructive">
                              {formatPercentage(metrics.cancellation_rate)}
                            </span>
                          </ItemActions>
                        </Item>
                      </ItemGroup>
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
                <ItemGroup>
                  <Item variant="muted" size="sm">
                    <ItemContent>
                      <CardTitle>Service Revenue Breakdown</CardTitle>
                      <CardDescription>Revenue generated by each service</CardDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBreakdown.length > 0 ? (
                    <ItemGroup className="gap-0">
                      {revenueBreakdown.map((service, index) => (
                        <Fragment key={service.service_id}>
                          <Item variant="outline" size="sm">
                            <ItemContent>
                              <ItemTitle>{service.service_name}</ItemTitle>
                              <ItemDescription>
                                {service.bookings_count} bookings • {formatCurrency(service.avg_price)} avg
                              </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                              <div className="text-right text-sm font-semibold leading-tight">
                                {formatCurrency(service.total_revenue)}
                              </div>
                            </ItemActions>
                          </Item>
                          {index < revenueBreakdown.length - 1 ? <ItemSeparator /> : null}
                        </Fragment>
                      ))}
                    </ItemGroup>
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
                <ItemGroup>
                  <Item variant="muted" size="sm">
                    <ItemContent>
                      <CardTitle>Top Customers</CardTitle>
                      <CardDescription>Your most loyal customers</CardDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerRelationships.length > 0 ? (
                    <ItemGroup className="gap-0">
                      {customerRelationships.map((customer, index) => (
                        <Fragment key={customer.customer_id}>
                          <Item variant="outline" size="sm">
                            <ItemContent>
                              <ItemTitle>{customer.customer_name}</ItemTitle>
                              <ItemDescription>
                                {customer.total_appointments} appointments • Last visit:{' '}
                                {new Date(customer.last_appointment_date).toLocaleDateString()}
                              </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                              <div className="text-right text-sm leading-tight">
                                <div className="font-semibold">
                                  {formatCurrency(customer.total_spent)}
                                </div>
                                <div className="text-xs text-muted-foreground">Total spent</div>
                              </div>
                            </ItemActions>
                          </Item>
                          {index < customerRelationships.length - 1 ? <ItemSeparator /> : null}
                        </Fragment>
                      ))}
                    </ItemGroup>
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
