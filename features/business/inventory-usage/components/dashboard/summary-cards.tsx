import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Package, TrendingUp, BarChart3 } from 'lucide-react'
import type { UsageAnalytics } from '../../api/queries'
import { formatCurrency, formatNumber } from './utils'

interface SummaryCardsProps {
  analytics: UsageAnalytics
}

export function SummaryCards({ analytics }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Total Cost</CardTitle>
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
          <CardTitle>Total Usage</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(analytics.totalUsage)}</div>
          <p className="text-xs text-muted-foreground">Units consumed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Avg Cost/Use</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(analytics.avgCostPerUse)}</div>
          <p className="text-xs text-muted-foreground">Per usage record</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Products Tracked</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.uniqueProducts}</div>
          <p className="text-xs text-muted-foreground">Unique products</p>
        </CardContent>
      </Card>
    </div>
  )
}
