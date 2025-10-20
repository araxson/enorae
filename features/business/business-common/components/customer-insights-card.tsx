'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Grid, Stack, Box, Flex } from '@/components/layout'
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
        <Stack gap="lg">
          {/* Key Metrics */}
          <Grid cols={{ base: 2, md: 4 }} gap="md">
            <Box className="text-center p-4 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{data.totalCustomers}</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Total Customers</small>
            </Box>

            <Box className="text-center p-4 rounded-lg bg-muted/50">
              <UserPlus className="h-5 w-5 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold">{data.newCustomers}</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">New ({newCustomerPercentage}%)</small>
            </Box>

            <Box className="text-center p-4 rounded-lg bg-muted/50">
              <Repeat className="h-5 w-5 mx-auto mb-2 text-info" />
              <div className="text-2xl font-bold">{data.returningCustomers}</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Returning</small>
            </Box>

            <Box className="text-center p-4 rounded-lg bg-muted/50">
              <Flex align="center" justify="center" gap="xs" className="mb-2">
                {data.retentionRate >= 50 ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </Flex>
              <div className="text-2xl font-bold">{data.retentionRate.toFixed(1)}%</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Retention Rate</small>
            </Box>
          </Grid>

          <Separator />

          {/* Value Metrics */}
          <Grid cols={{ base: 1, md: 2 }} gap="md">
            <Box className="p-4 rounded-lg border">
              <Flex align="center" gap="sm" className="mb-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-base">Avg Lifetime Value</h3>
              </Flex>
              <div className="text-3xl font-bold">{formatCurrency(data.averageLifetimeValue)}</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Per customer</small>
            </Box>

            <Box className="p-4 rounded-lg border">
              <Flex align="center" gap="sm" className="mb-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-base">Avg Order Value</h3>
              </Flex>
              <div className="text-3xl font-bold">{formatCurrency(data.averageOrderValue)}</div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Per appointment</small>
            </Box>
          </Grid>

          {/* Top Customers */}
          {data.topCustomers.length > 0 && (
            <>
              <Separator />
              <Box>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Top Customers</h3>
                <Stack gap="sm">
                  {data.topCustomers.map((customer, index) => (
                    <Flex
                      key={index}
                      justify="between"
                      align="center"
                      className="p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Box className="flex-1">
                        <div className="font-medium">{customer.name}</div>
                        {customer.email && (
                          <small className="text-sm font-medium leading-none text-muted-foreground">{customer.email}</small>
                        )}
                      </Box>
                      <Flex gap="md" align="center">
                        <Box className="text-right">
                          <div className="font-semibold">{formatCurrency(customer.totalSpent)}</div>
                          <small className="text-sm font-medium leading-none text-muted-foreground">{customer.visitCount} visits</small>
                        </Box>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </Flex>
                    </Flex>
                  ))}
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
