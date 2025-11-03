import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { ChainRevenueData } from '@/features/admin/finance/api/types'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface RevenueByChainProps {
  data: ChainRevenueData[]
}

export function RevenueByChain({ data }: RevenueByChainProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const totalRevenue = data.reduce((sum, row) => sum + row.totalRevenue, 0)

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Revenue by Chain</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No chain revenue data available</EmptyTitle>
              <EmptyDescription>
                Revenue metrics populate after chains process transactions.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="divide-y">
            <ItemGroup>
              {data.map((row) => (
                <Item key={row.chainName}>
                  <ItemContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <ItemTitle>{row.chainName}</ItemTitle>
                        <ItemDescription className="text-xs text-muted-foreground">
                          {row.salonCount} salons
                        </ItemDescription>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap justify-between gap-2">
                          <span>Total revenue</span>
                          <span className="font-semibold">{formatCurrency(row.totalRevenue)}</span>
                        </div>
                        <div className="flex flex-wrap justify-between gap-2">
                          <span>% of platform</span>
                          <span>{((row.totalRevenue / totalRevenue) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex flex-wrap justify-between gap-2">
                          <span>Avg per salon</span>
                          <span>{formatCurrency(row.totalRevenue / row.salonCount)}</span>
                        </div>
                      </div>
                    </div>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
