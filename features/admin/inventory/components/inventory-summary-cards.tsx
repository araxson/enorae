import { Package, AlertTriangle, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Grid } from '@/components/layout'
import { formatCurrency } from './inventory-utils'

type Summary = {
  totalProducts: number
  totalStockValue: number
  lowStockAlerts: number
  criticalStockAlerts: number
  activeSalons: number
}

type SummaryCardsProps = {
  summary: Summary
}

export function InventorySummaryCards({ summary }: SummaryCardsProps) {
  return (
    <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalProducts.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Across {summary.activeSalons} salons</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Inventory Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalStockValue)}</div>
          <p className="text-xs text-muted-foreground">Estimated total value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Low Stock Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.lowStockAlerts}</div>
          <p className="text-xs text-muted-foreground">Needs attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Critical Alerts</CardTitle>
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
  )
}
