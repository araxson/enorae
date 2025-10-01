import { Package, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@enorae/ui'
import { getInventoryLevels, getLowStockProducts } from '../dal/queries'

interface InventoryDashboardProps {
  salonId: string
}

export async function InventoryDashboard({ salonId }: InventoryDashboardProps) {
  const [inventory, lowStock] = await Promise.all([
    getInventoryLevels(salonId),
    getLowStockProducts(salonId)
  ])

  const totalValue = (inventory as any[]).reduce((sum: number, item: any) =>
    sum + (item.quantity * item.products.unit_price), 0
  )
  const totalItems = (inventory as any[]).reduce((sum: number, item: any) => sum + item.quantity, 0)

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inventory.length}</div>
          <p className="text-xs text-muted-foreground">
            Unique products in inventory
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground">
            Total quantity in stock
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalValue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total inventory value
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStock.length}</div>
          <p className="text-xs text-muted-foreground">
            Products below reorder point
          </p>
        </CardContent>
      </Card>
    </div>
  )
}