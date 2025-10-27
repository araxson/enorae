import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { AdminRevenueRow } from '@/features/admin/finance/types'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface RevenueBySalonProps {
  data: AdminRevenueRow[]
}

export function RevenueBySalon({ data }: RevenueBySalonProps) {
  const formatCurrency = (value: number | null | undefined) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0)
  }

  const formatNumber = (value: number | null | undefined) => {
    return new Intl.NumberFormat('en-US').format(value || 0)
  }

  const formatPercentage = (value: number | null | undefined) => {
    return `${((value || 0) * 100).toFixed(1)}%`
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Revenue by Salon</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No revenue data available</EmptyTitle>
              <EmptyDescription>Salon-level revenue appears once bookings and sales are recorded.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="divide-y">
            {data.map((row, index) => (
              <Item key={`revenue-${index}`} className="grid gap-3 p-4 md:grid-cols-2">
                <ItemContent>
                  <ItemTitle>{row.salon_name || 'Unnamed salon'}</ItemTitle>
                  <ItemDescription>
                    Chain: {row.chain_name || 'Independent'}
                  </ItemDescription>
                  <ItemDescription className="text-xs text-muted-foreground">
                    Total appointments {formatNumber(row.total_appointments)}
                  </ItemDescription>
                </ItemContent>
                <ItemContent>
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <span>Total</span>
                    <span className="font-semibold">{formatCurrency(row.total_revenue)}</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <span>Service</span>
                    <span>{formatCurrency(row.service_revenue)}</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <span>Products</span>
                    <span>{formatCurrency(row.product_revenue)}</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <span>Appointments</span>
                    <span>{formatNumber(row.completed_appointments)}</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                    <span>Completion rate</span>
                    <span>{formatPercentage(row.completion_rate)}</span>
                  </div>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
