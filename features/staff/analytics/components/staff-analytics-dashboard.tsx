'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/layout'
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
} from '../api/queries'

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
    <Stack gap="lg">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.total_revenue)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(metrics.avg_appointment_value)} avg per appointment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Commission</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earnings.estimated_commission)}</div>
            <p className="text-xs text-muted-foreground">
              {earnings.commission_rate}% commission rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completed_appointments}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.total_appointments} total ({formatPercentage(metrics.completion_rate)} completion)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.unique_customers}</div>
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

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Statistics</CardTitle>
                <CardDescription>Your appointment performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Appointments</span>
                  <Badge variant="outline">{metrics.total_appointments}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <Badge className="bg-green-600">{metrics.completed_appointments}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cancelled</span>
                  <Badge variant="destructive">{metrics.cancelled_appointments}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">No Shows</span>
                  <Badge variant="secondary">{metrics.no_show_appointments}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Rates</CardTitle>
                <CardDescription>Completion and cancellation metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatPercentage(metrics.completion_rate)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{ width: `${metrics.completion_rate}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Cancellation Rate</span>
                    <span className="text-sm font-bold text-red-600">
                      {formatPercentage(metrics.cancellation_rate)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${metrics.cancellation_rate}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Revenue Breakdown</CardTitle>
              <CardDescription>Revenue generated by each service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBreakdown.length > 0 ? (
                  revenueBreakdown.map((service) => (
                    <div
                      key={service.service_id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{service.service_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.bookings_count} bookings • {formatCurrency(service.avg_price)} avg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(service.total_revenue)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No revenue data available for this period
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Your most loyal customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerRelationships.length > 0 ? (
                  customerRelationships.map((customer) => (
                    <div
                      key={customer.customer_id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">{customer.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.total_appointments} appointments • Last visit:{' '}
                          {new Date(customer.last_appointment_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(customer.total_spent)}</p>
                        <p className="text-xs text-muted-foreground">Total spent</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No customer data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Stack>
  )
}
