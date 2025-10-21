import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import type { InventoryValuationSummary } from '../api/queries'
import { formatCurrency } from './inventory-utils'

type InventoryValuationBreakdownProps = {
  valuation: InventoryValuationSummary
}

export function InventoryValuationBreakdown({ valuation }: InventoryValuationBreakdownProps) {
  if (!valuation.categories.length) {
    return (
      <p className="text-sm text-muted-foreground">No valuation data available</p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="leading-7 text-sm font-semibold text-muted-foreground">Total Stock Value</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(valuation.totalStockValue)}
          </p>
        </div>
        <div>
          <p className="leading-7 text-sm font-semibold text-muted-foreground">Total Retail Value</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(valuation.totalRetailValue)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {valuation.categories.map((category) => (
          <Card key={category.categoryName}>
            <CardContent className="space-y-2 pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium leading-tight">{category.categoryName}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.productCount} products • {category.salonCount} salons
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(category.stockValue)}</p>
                  <p className="text-xs text-muted-foreground">
                    {(category.contribution * 100).toFixed(1)}% of stock
                  </p>
                </div>
              </div>
              <Progress value={Math.min(category.contribution * 100, 100)} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
