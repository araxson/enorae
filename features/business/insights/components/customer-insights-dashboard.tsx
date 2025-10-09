'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack } from '@/components/layout'
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Crown,
  Heart,
  AlertTriangle,
  Star,
  UserPlus,
  UserX,
} from 'lucide-react'
import type { CustomerMetrics, InsightsSummary } from '../api/queries'

interface CustomerInsightsDashboardProps {
  summary: InsightsSummary
  topCustomers: CustomerMetrics[]
}

export function CustomerInsightsDashboard({
  summary,
  topCustomers,
}: CustomerInsightsDashboardProps) {
  const [selectedSegment, setSelectedSegment] = useState<string>('all')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'VIP':
        return <Crown className="h-4 w-4 text-yellow-600" />
      case 'Loyal':
        return <Heart className="h-4 w-4 text-red-600" />
      case 'Regular':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'At Risk':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'New':
        return <UserPlus className="h-4 w-4 text-green-600" />
      case 'Churned':
        return <UserX className="h-4 w-4 text-gray-600" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'VIP':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Loyal':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'Regular':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'At Risk':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'New':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'Churned':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCustomers =
    selectedSegment === 'all'
      ? topCustomers
      : topCustomers.filter((c) => c.segment.toLowerCase() === selectedSegment)

  return (
    <Stack gap="lg">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total_customers}</div>
            <p className="text-xs text-muted-foreground">
              {summary.active_customers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lifetime Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.avg_lifetime_value)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.avg_visits_per_customer.toFixed(1)} avg visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(summary.retention_rate)}
            </div>
            <p className="text-xs text-muted-foreground">
              Customer retention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatPercentage(summary.churn_rate)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.segmentation.churned} churned customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Segmentation */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segmentation</CardTitle>
          <CardDescription>
            Customer distribution across different segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <div className="flex flex-col items-center p-4 border rounded-lg bg-yellow-50">
              <Crown className="h-6 w-6 text-yellow-600 mb-2" />
              <div className="text-2xl font-bold">{summary.segmentation.vip}</div>
              <div className="text-xs text-muted-foreground">VIP</div>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg bg-red-50">
              <Heart className="h-6 w-6 text-red-600 mb-2" />
              <div className="text-2xl font-bold">{summary.segmentation.loyal}</div>
              <div className="text-xs text-muted-foreground">Loyal</div>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg bg-blue-50">
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <div className="text-2xl font-bold">{summary.segmentation.regular}</div>
              <div className="text-xs text-muted-foreground">Regular</div>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg bg-orange-50">
              <AlertTriangle className="h-6 w-6 text-orange-600 mb-2" />
              <div className="text-2xl font-bold">{summary.segmentation.at_risk}</div>
              <div className="text-xs text-muted-foreground">At Risk</div>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg bg-green-50">
              <UserPlus className="h-6 w-6 text-green-600 mb-2" />
              <div className="text-2xl font-bold">{summary.segmentation.new}</div>
              <div className="text-xs text-muted-foreground">New</div>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-50">
              <UserX className="h-6 w-6 text-gray-600 mb-2" />
              <div className="text-2xl font-bold">{summary.segmentation.churned}</div>
              <div className="text-xs text-muted-foreground">Churned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List with Tabs */}
      <Tabs defaultValue="all" onValueChange={setSelectedSegment}>
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
          <TabsTrigger value="loyal">Loyal</TabsTrigger>
          <TabsTrigger value="at risk">At Risk</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedSegment} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedSegment === 'all'
                  ? 'Top Customers by Lifetime Value'
                  : `${selectedSegment.charAt(0).toUpperCase() + selectedSegment.slice(1)} Customers`}
              </CardTitle>
              <CardDescription>
                Detailed customer insights and metrics ({filteredCustomers.length} customers)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.customer_id}
                      className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{customer.customer_name}</span>
                          <Badge
                            variant="outline"
                            className={getSegmentColor(customer.segment)}
                          >
                            {getSegmentIcon(customer.segment)}
                            <span className="ml-1">{customer.segment}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">{customer.total_visits}</span> visits
                          </div>
                          <div>
                            <span className="font-medium">
                              {formatCurrency(customer.lifetime_value)}
                            </span>{' '}
                            LTV
                          </div>
                          <div>
                            <span className="font-medium">{customer.favorite_service_name}</span>{' '}
                            favorite
                          </div>
                          {customer.average_rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{customer.average_rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Last visit: {new Date(customer.last_visit_date).toLocaleDateString()} •
                          Favorite staff: {customer.favorite_staff_name}
                        </div>

                        {customer.cancellation_rate > 20 && (
                          <Badge variant="destructive" className="text-xs">
                            High cancellation rate ({formatPercentage(customer.cancellation_rate)})
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No customers in this segment
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
