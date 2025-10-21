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
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{data.totalCustomers}</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Total Customers</small>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted/50">
              <UserPlus className="h-5 w-5 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold">{data.newCustomers}</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">New ({newCustomerPercentage}%)</small>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Repeat className="h-5 w-5 mx-auto mb-2 text-info" />
              <div className="text-2xl font-bold">{data.returningCustomers}</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Returning</small>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="flex gap-2 items-center justify-center mb-2">
                {data.retentionRate >= 50 ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div className="text-2xl font-bold">{data.retentionRate.toFixed(1)}%</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Retention Rate</small>
            </div>
          </div>

          <Separator />

          {/* Value Metrics */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="p-4 rounded-lg border">
              <div className="flex gap-3 items-center mb-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-base">Avg Lifetime Value</h3>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(data.averageLifetimeValue)}</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Per customer</small>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex gap-3 items-center mb-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-base">Avg Order Value</h3>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(data.averageOrderValue)}</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Per appointment</small>
            </div>
          </div>

          {/* Top Customers */}
          {data.topCustomers.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Top Customers</h3>
                <div className="flex flex-col gap-3">
                  {data.topCustomers.map((customer, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{customer.name}</div>
                        {customer.email && (
                          <small className="text-sm font-medium leading-none text-muted-foreground">{customer.email}</small>
                        )}
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(customer.totalSpent)}</div>
                          <small className="text-sm font-medium leading-none text-muted-foreground">{customer.visitCount} visits</small>
                        </div>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
