'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TrendingUp, TrendingDown, Users, UserPlus, Repeat, DollarSign } from 'lucide-react'

interface CustomerInsightsCardProps {
  data: {
    totalCustomers: number
    newCustomers: number
    returningCustomers: number
    retentionRate: number
    averageLifetimeValue: number
    averageOrderValue: number
    topCustomers: {
      name: string
      email?: string
      totalSpent: number
      visitCount: number
    }[]
  }
}

export function CustomerInsightsCard({ data }: CustomerInsightsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const newCustomerPercentage = data.totalCustomers > 0
    ? ((data.newCustomers / data.totalCustomers) * 100).toFixed(1)
    : '0.0'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Insights</CardTitle>
        <CardDescription>Customer behavior and lifetime value analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                icon: <Users className="h-5 w-5 text-muted-foreground" />,
                title: data.totalCustomers,
                description: 'Total Customers',
              },
              {
                icon: <UserPlus className="h-5 w-5 text-primary" />,
                title: data.newCustomers,
                description: `New (${newCustomerPercentage}%)`,
              },
              {
                icon: <Repeat className="h-5 w-5 text-secondary" />,
                title: data.returningCustomers,
                description: 'Returning',
              },
              {
                icon:
                  data.retentionRate >= 50 ? (
                    <TrendingUp className="h-5 w-5 text-primary" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  ),
                title: `${data.retentionRate.toFixed(1)}%`,
                description: 'Retention Rate',
              },
            ].map((metric) => (
              <Card key={metric.description}>
                <CardHeader className="items-center space-y-2 text-center">
                  <div className="flex items-center justify-center">{metric.icon}</div>
                  <CardTitle>{metric.title}</CardTitle>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Separator />

          {/* Value Metrics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Avg Lifetime Value</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-1">
                <CardTitle>{formatCurrency(data.averageLifetimeValue)}</CardTitle>
                <CardDescription>Per customer</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Avg Order Value</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-1">
                <CardTitle>{formatCurrency(data.averageOrderValue)}</CardTitle>
                <CardDescription>Per appointment</CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Top Customers */}
          {data.topCustomers.length > 0 && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {data.topCustomers.map((customer, index) => (
                    <Card key={customer.name}>
                      <CardContent className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{customer.name}</p>
                          {customer.email && (
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(customer.totalSpent)}</p>
                            <p className="text-sm text-muted-foreground">{customer.visitCount} visits</p>
                          </div>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
