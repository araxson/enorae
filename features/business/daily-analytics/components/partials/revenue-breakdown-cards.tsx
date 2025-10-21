'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Scissors } from 'lucide-react'
import type { DailyMetricsDashboardProps } from '../types'
import { formatCurrency } from '../utils/value-formatters'

type Props = Pick<DailyMetricsDashboardProps, 'aggregated'>

export function RevenueBreakdownCards({ aggregated }: Props) {
  const serviceShare =
    aggregated.totalRevenue > 0 ? (aggregated.serviceRevenue / aggregated.totalRevenue) * 100 : 0
  const productShare =
    aggregated.totalRevenue > 0 ? (aggregated.productRevenue / aggregated.totalRevenue) * 100 : 0

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            <CardTitle>Service Revenue</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="scroll-m-20 text-2xl font-semibold text-xl">{formatCurrency(aggregated.serviceRevenue)}</h3>
            <p className="text-sm text-muted-foreground text-xs">{serviceShare.toFixed(1)}% of total</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <CardTitle>Product Revenue</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="scroll-m-20 text-2xl font-semibold text-xl">{formatCurrency(aggregated.productRevenue)}</h3>
            <p className="text-sm text-muted-foreground text-xs">{productShare.toFixed(1)}% of total</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
