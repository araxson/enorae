'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Scissors } from 'lucide-react'
import type { DailyMetricsDashboardProps } from '@/features/business/daily-analytics/types'
import { formatCurrency } from '@/features/business/business-common'

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
            <div className="text-xl font-semibold">{formatCurrency(aggregated.serviceRevenue)}</div>
            <div className="text-xs text-muted-foreground">{serviceShare.toFixed(1)}% of total</div>
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
            <div className="text-xl font-semibold">{formatCurrency(aggregated.productRevenue)}</div>
            <div className="text-xs text-muted-foreground">{productShare.toFixed(1)}% of total</div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
