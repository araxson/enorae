'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TrendingUp, TrendingDown, Users, UserPlus, Repeat, DollarSign } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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
          <ItemGroup className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
              <Item
                key={metric.description}
                variant="outline"
                className="flex flex-col items-center justify-center gap-2 py-6"
              >
                <ItemContent className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center">{metric.icon}</div>
                  <CardTitle>{metric.title}</CardTitle>
                  <CardDescription>{metric.description}</CardDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>

          <Separator />

          {/* Value Metrics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <CardTitle>Avg Lifetime Value</CardTitle>
                    </ItemContent>
                    <ItemActions className="flex-none">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </CardHeader>
              <CardContent className="space-y-1">
                <CardTitle>{formatCurrency(data.averageLifetimeValue)}</CardTitle>
                <CardDescription>Per customer</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <CardTitle>Avg Order Value</CardTitle>
                    </ItemContent>
                    <ItemActions className="flex-none">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </ItemActions>
                  </Item>
                </ItemGroup>
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
                  <ItemGroup className="gap-2">
                    {data.topCustomers.map((customer, index) => (
                      <Item key={customer.name} variant="outline" className="items-start">
                        <ItemContent>
                          <ItemTitle>{customer.name}</ItemTitle>
                          {customer.email ? (
                            <ItemDescription>{customer.email}</ItemDescription>
                          ) : null}
                        </ItemContent>
                        <ItemActions className="flex-none items-center gap-4">
                          <div className="text-right">
                            <CardDescription>{formatCurrency(customer.totalSpent)}</CardDescription>
                            <CardDescription>{customer.visitCount} visits</CardDescription>
                          </div>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </ItemActions>
                      </Item>
                    ))}
                  </ItemGroup>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
