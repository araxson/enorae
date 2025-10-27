'use client'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TrendingUp, TrendingDown, Users, UserPlus, Repeat, DollarSign } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
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
    <Item variant="outline" className="flex-col gap-6">
      <ItemHeader>
        <ItemTitle>Customer Insights</ItemTitle>
        <ItemDescription>Customer behavior and lifetime value analysis</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-6">
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
                  <ItemTitle>{metric.title}</ItemTitle>
                  <ItemDescription>{metric.description}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Item variant="outline" className="flex-col gap-3">
              <ItemHeader className="items-center justify-between">
                <ItemTitle>Avg Lifetime Value</ItemTitle>
                <ItemActions className="flex-none">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </ItemActions>
              </ItemHeader>
              <ItemContent className="space-y-1">
                <ItemTitle>{formatCurrency(data.averageLifetimeValue)}</ItemTitle>
                <ItemDescription>Per customer</ItemDescription>
              </ItemContent>
            </Item>

            <Item variant="outline" className="flex-col gap-3">
              <ItemHeader className="items-center justify-between">
                <ItemTitle>Avg Order Value</ItemTitle>
                <ItemActions className="flex-none">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </ItemActions>
              </ItemHeader>
              <ItemContent className="space-y-1">
                <ItemTitle>{formatCurrency(data.averageOrderValue)}</ItemTitle>
                <ItemDescription>Per appointment</ItemDescription>
              </ItemContent>
            </Item>
          </div>

          {data.topCustomers.length > 0 && (
            <>
              <Separator />
              <Item variant="outline" className="flex-col gap-3">
                <ItemHeader>
                  <ItemTitle>Top Customers</ItemTitle>
                </ItemHeader>
                <ItemContent className="flex flex-col gap-3">
                  <ItemGroup className="gap-2">
                    {data.topCustomers.map((customer, index) => (
                      <Item key={customer.name} variant="outline" className="items-start">
                        <ItemContent>
                          <ItemTitle>{customer.name}</ItemTitle>
                          {customer.email ? <ItemDescription>{customer.email}</ItemDescription> : null}
                        </ItemContent>
                        <ItemActions className="flex-none items-center gap-4">
                          <div className="text-right">
                            <ItemDescription>{formatCurrency(customer.totalSpent)}</ItemDescription>
                            <ItemDescription>{customer.visitCount} visits</ItemDescription>
                          </div>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </ItemActions>
                      </Item>
                    ))}
                  </ItemGroup>
                </ItemContent>
              </Item>
            </>
          )}
        </div>
      </ItemContent>
    </Item>
  )
}
