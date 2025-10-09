import { Progress } from '@/components/ui/progress'
import { Muted, P } from '@/components/ui/typography'
import type { InventoryValuationSummary } from '../api/queries'
import { formatCurrency } from './inventory-utils'

type InventoryValuationBreakdownProps = {
  valuation: InventoryValuationSummary
}

export function InventoryValuationBreakdown({ valuation }: InventoryValuationBreakdownProps) {
  if (!valuation.categories.length) {
    return (
      <Muted>No valuation data available</Muted>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <P className="text-sm font-semibold text-muted-foreground">Total Stock Value</P>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(valuation.totalStockValue)}
          </p>
        </div>
        <div>
          <P className="text-sm font-semibold text-muted-foreground">Total Retail Value</P>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(valuation.totalRetailValue)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {valuation.categories.map((category) => (
          <div key={category.categoryName} className="space-y-2 rounded-lg border p-4">
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
          </div>
        ))}
      </div>
    </div>
  )
}
