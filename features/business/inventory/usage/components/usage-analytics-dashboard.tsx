'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Package, TrendingUp, BarChart3 } from 'lucide-react'
import type { UsageAnalytics, UsageTrend, ServiceCostAnalysis } from '../api/queries'

interface UsageAnalyticsDashboardProps {
  analytics: UsageAnalytics
  trends: UsageTrend[]
  serviceCosts: ServiceCostAnalysis[]
  highUsageProducts: Awaited<ReturnType<typeof import('../api/queries').getHighUsageProducts>>
}

export function UsageAnalyticsDashboard({
  analytics,
  trends,
  serviceCosts,
  highUsageProducts,
}: UsageAnalyticsDashboardProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)

  const formatNumber = (num: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalCost)}</div>
            <p className="text-xs text-muted-foreground">
              From {analytics.uniqueProducts} products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.totalUsage)}</div>
            <p className="text-xs text-muted-foreground">
              Units consumed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Use</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.avgCostPerUse)}</div>
            <p className="text-xs text-muted-foreground">
              Per usage record
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Tracked</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.uniqueProducts}</div>
            <p className="text-xs text-muted-foreground">
              Unique products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products by Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
                <TableHead className="text-right">Uses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.topProducts.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell className="font-medium">{product.product_name}</TableCell>
                  <TableCell className="text-right">{formatNumber(product.total_quantity)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.total_cost)}</TableCell>
                  <TableCell className="text-right">{product.usage_count}</TableCell>
                </TableRow>
              ))}
              {analytics.topProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No product usage data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Service Cost Analysis */}
      {serviceCosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Appointments</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Avg Cost/Service</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceCosts.map((service) => (
                  <TableRow key={service.service_id}>
                    <TableCell className="font-medium">{service.service_name}</TableCell>
                    <TableCell className="text-right">{service.total_appointments}</TableCell>
                    <TableCell className="text-right">{formatCurrency(service.total_product_cost)}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(service.avg_cost_per_service)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* High Usage Products (for inventory optimization) */}
      {highUsageProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>High Usage Products & Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">SKU</TableHead>
                  <TableHead className="text-right">Daily Avg</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Days Until Reorder</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highUsageProducts.map((product) => {
                  const needsReorder = product.days_until_reorder <= 7
                  const critical = product.days_until_reorder <= 3

                  return (
                    <TableRow key={product.product_id}>
                      <TableCell className="font-medium">{product.product_name}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {product.product_sku || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(product.daily_average)} {product.product_unit || 'units'}/day
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(product.current_stock)} {product.product_unit || 'units'}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.days_until_reorder > 0
                          ? `${product.days_until_reorder} days`
                          : 'Below minimum'}
                      </TableCell>
                      <TableCell className="text-right">
                        {critical ? (
                          <Badge variant="destructive">Critical</Badge>
                        ) : needsReorder ? (
                          <Badge variant="secondary">Reorder Soon</Badge>
                        ) : (
                          <Badge variant="outline">OK</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Usage Trends */}
      {trends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Trends (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Products Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trends.slice(-10).map((trend) => (
                  <TableRow key={trend.date}>
                    <TableCell>
                      {new Date(trend.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(trend.total_quantity)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(trend.total_cost)}</TableCell>
                    <TableCell className="text-right">{trend.product_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
