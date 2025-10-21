import { Package, AlertTriangle, Users, ShoppingCart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
type InventoryStatsProps = {
  stats: {
    productsCount: number
    lowStockCount: number
    suppliersCount: number
    pendingOrdersCount: number
  }
}

export function InventoryStats({ stats }: InventoryStatsProps) {
  const cards = [
    {
      icon: Package,
      label: 'Total Products',
      value: stats.productsCount,
      color: 'text-info',
    },
    {
      icon: AlertTriangle,
      label: 'Low Stock Alerts',
      value: stats.lowStockCount,
      color: 'text-destructive',
    },
    {
      icon: Users,
      label: 'Active Suppliers',
      value: stats.suppliersCount,
      color: 'text-success',
    },
    {
      icon: ShoppingCart,
      label: 'Pending Orders',
      value: stats.pendingOrdersCount,
      color: 'text-warning',
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent>
            <div className="pt-4">
              <div className="flex gap-4 items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-2">{card.value}</h3>
                </div>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
