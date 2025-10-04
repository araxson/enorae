'use client'

import { Package, AlertTriangle, DollarSign, Building2, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Grid, Stack } from '@/components/layout'
import { Muted } from '@/components/ui/typography'
import type {
  InventorySummary,
  LowStockAlert,
  SalonInventoryValue,
  TopProduct,
} from '../api/queries'

type Props = {
  summary: InventorySummary
  lowStockAlerts: LowStockAlert[]
  salonValues: SalonInventoryValue[]
  topProducts: TopProduct[]
}

export function InventoryOverview({ summary, lowStockAlerts, salonValues, topProducts }: Props) {
  const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <Stack gap="xl">
      {/* Summary Cards */}
      <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {summary.activeSalons} salons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalStockValue)}</div>
            <p className="text-xs text-muted-foreground">Estimated total value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.lowStockAlerts}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {summary.criticalStockAlerts}
            </div>
            <p className="text-xs text-muted-foreground">Immediate action required</p>
          </CardContent>
        </Card>
      </Grid>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>Products that need restocking</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Salon</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Threshold</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockAlerts.map((alert) => (
                <TableRow key={`${alert.productId}-${alert.salonId}-${alert.locationName}`}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{alert.productName}</p>
                      {alert.productSku && (
                        <Muted className="text-xs">SKU: {alert.productSku}</Muted>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{alert.salonName}</TableCell>
                  <TableCell>{alert.locationName}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {alert.currentQuantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {alert.alertLevel === 'critical'
                      ? alert.criticalThreshold
                      : alert.lowThreshold}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={alert.alertLevel === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.alertLevel === 'critical' ? 'Critical' : 'Low'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {lowStockAlerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Muted>No low stock alerts</Muted>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Salon Inventory Values */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Value by Salon</CardTitle>
          <CardDescription>Estimated inventory value per location</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salon</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Total Quantity</TableHead>
                <TableHead className="text-right">Estimated Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salonValues.map((salon) => (
                <TableRow key={salon.salonId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {salon.salonName}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{salon.totalProducts}</TableCell>
                  <TableCell className="text-right">{salon.totalQuantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(salon.estimatedValue)}
                  </TableCell>
                </TableRow>
              ))}
              {salonValues.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Muted>No salon data available</Muted>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Most stocked products across platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Total Quantity</TableHead>
                <TableHead className="text-right">Salons</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product, index) => (
                <TableRow key={product.productId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {index < 3 && <TrendingUp className="h-4 w-4 text-green-500" />}
                      <div>
                        <p className="font-medium">{product.productName}</p>
                        {product.productSku && (
                          <Muted className="text-xs">SKU: {product.productSku}</Muted>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {product.totalQuantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{product.salonsCount}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {topProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <Muted>No product data available</Muted>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  )
}
