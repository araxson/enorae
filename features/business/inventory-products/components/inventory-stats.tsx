import { Package, AlertTriangle, Users, ShoppingCart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Grid, Box, Flex } from '@/components/layout'

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
      color: 'text-blue-500',
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
      color: 'text-green-500',
    },
    {
      icon: ShoppingCart,
      label: 'Pending Orders',
      value: stats.pendingOrdersCount,
      color: 'text-orange-500',
    },
  ]

  return (
    <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent>
            <Box pt="md">
              <Flex align="center" justify="between">
                <Box>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-2">{card.value}</h3>
                </Box>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </Flex>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Grid>
  )
}
