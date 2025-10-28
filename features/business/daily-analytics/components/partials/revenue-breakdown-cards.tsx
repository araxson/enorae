'use client'

import { Package, Scissors } from 'lucide-react'
import type { DailyMetricsDashboardProps } from '@/features/business/daily-analytics/types'
import { formatCurrency } from '@/features/business/business-common'
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item'

type Props = Pick<DailyMetricsDashboardProps, 'aggregated'>

export function RevenueBreakdownCards({ aggregated }: Props) {
  const serviceShare =
    aggregated.totalRevenue > 0 ? (aggregated.serviceRevenue / aggregated.totalRevenue) * 100 : 0
  const productShare =
    aggregated.totalRevenue > 0 ? (aggregated.productRevenue / aggregated.totalRevenue) * 100 : 0

  return (
    <>
      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader className="items-center gap-2">
          <Scissors className="size-4" />
          <ItemTitle>Service Revenue</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <div className="space-y-2">
            <div className="text-xl font-semibold">{formatCurrency(aggregated.serviceRevenue)}</div>
            <div className="text-xs text-muted-foreground">{serviceShare.toFixed(1)}% of total</div>
          </div>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader className="items-center gap-2">
          <Package className="size-4" />
          <ItemTitle>Product Revenue</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <div className="space-y-2">
            <div className="text-xl font-semibold">{formatCurrency(aggregated.productRevenue)}</div>
            <div className="text-xs text-muted-foreground">{productShare.toFixed(1)}% of total</div>
          </div>
        </ItemContent>
      </Item>
    </>
  )
}
