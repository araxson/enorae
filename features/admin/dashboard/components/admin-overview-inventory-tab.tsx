import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { InventoryOverview } from './admin-overview-types'

type InventoryTabProps = {
  inventory: InventoryOverview[]
}

export function AdminOverviewInventoryTab({ inventory }: InventoryTabProps) {
  if (inventory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory alerts</CardTitle>
          <CardDescription>
            Low stock and critical alerts surfaced automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Inventory levels look healthy. Alerts will show up here when thresholds are breached.
          </p>
        </CardContent>
      </Card>
    )
  }

  const rows = inventory.slice(0, 20)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory alerts</CardTitle>
        <CardDescription>
          Low stock and critical alerts surfaced automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <div className="space-y-3">
            {rows.map((item) => (
              <Alert key={item.id} variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertTitle>{item.product_name || 'Unknown product'}</AlertTitle>
                <AlertDescription>
                  {item.salon_name || 'Unknown salon'} • Stock remaining: {item.total_available ?? 0}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
