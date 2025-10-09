'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { H3, Muted } from '@/components/ui/typography'
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
          <CardTitle className="text-base flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            Service Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <H3 className="text-xl">{formatCurrency(aggregated.serviceRevenue)}</H3>
            <Muted className="text-xs">{serviceShare.toFixed(1)}% of total</Muted>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Product Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <H3 className="text-xl">{formatCurrency(aggregated.productRevenue)}</H3>
            <Muted className="text-xs">{productShare.toFixed(1)}% of total</Muted>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
