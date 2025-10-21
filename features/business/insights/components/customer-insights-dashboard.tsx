'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'

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
        return <Crown className="h-4 w-4 text-accent" />
      case 'Loyal':
        return <Heart className="h-4 w-4 text-destructive" />
      case 'Regular':
        return <Users className="h-4 w-4 text-secondary" />
      case 'At Risk':
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'New':
        return <UserPlus className="h-4 w-4 text-primary" />
      case 'Churned':
        return <UserX className="h-4 w-4 text-muted-foreground" />
      default:
        return <Users className="h-4 w-4 text-muted-foreground" />
    }
  }

  const filteredCustomers =
    selectedSegment === 'all'
      ? topCustomers
      : topCustomers.filter((c) => c.segment.toLowerCase() === selectedSegment)

  const segmentCards = [
    { label: 'VIP', value: summary.segmentation.vip, icon: Crown, iconClass: 'text-accent' },
    { label: 'Loyal', value: summary.segmentation.loyal, icon: Heart, iconClass: 'text-destructive' },
    { label: 'Regular', value: summary.segmentation.regular, icon: Users, iconClass: 'text-secondary' },
    { label: 'At Risk', value: summary.segmentation.at_risk, icon: AlertTriangle, iconClass: 'text-destructive' },
    { label: 'New', value: summary.segmentation.new, icon: UserPlus, iconClass: 'text-primary' },
    { label: 'Churned', value: summary.segmentation.churned, icon: UserX, iconClass: 'text-muted-foreground' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total_customers}</div>
            <div className="text-xs text-muted-foreground">{summary.active_customers} active</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Avg Lifetime Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.avg_lifetime_value)}
            </div>
            <div className="text-xs text-muted-foreground">
              {summary.avg_visits_per_customer.toFixed(1)} avg visits
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Retention Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(summary.retention_rate)}
            </div>
            <div className="text-xs text-muted-foreground">Customer retention</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatPercentage(summary.churn_rate)}
            </div>
            <div className="text-xs text-muted-foreground">
              {summary.segmentation.churned} churned customers
            </div>
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
            {segmentCards.map(({ label, value, icon: Icon, iconClass }) => (
              <Card key={label}>
                <CardContent className="flex flex-col items-center gap-2 p-4">
                  <Icon className={cn('h-6 w-6', iconClass)} />
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </CardContent>
              </Card>
            ))}
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
                          <span className="font-semibold">{customer.customer_name}</span>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getSegmentIcon(customer.segment)}
                            <span>{customer.segment}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-semibold">{customer.total_visits}</span> visits
                          </div>
                          <div>
                            <span className="font-semibold">
                              {formatCurrency(customer.lifetime_value)}
                            </span>{' '}
                            LTV
                          </div>
                          <div>
                            <span className="font-semibold">{customer.favorite_service_name}</span>{' '}
                            favorite
                          </div>
                          {customer.average_rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-accent text-accent" />
                              <span className="font-semibold">{customer.average_rating.toFixed(1)}</span>
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
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No customers in this segment
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
