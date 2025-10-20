'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/layout'
import { resolveStockAlert } from '../api/mutations'
import type { StockAlertWithProduct } from '../api/queries'

type StockAlertsListProps = {
  alerts: StockAlertWithProduct[]
}

export function StockAlertsList({ alerts }: StockAlertsListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleResolve = (alertId: string) => {
    startTransition(async () => {
      const result = await resolveStockAlert(alertId)
      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Alert resolved')
      router.refresh()
    })
  }

  const getAlertType = (alertType: string) => {
    switch (alertType) {
      case 'low_stock':
        return { label: 'Low Stock', variant: 'secondary' as const }
      case 'out_of_stock':
        return { label: 'Out of Stock', variant: 'destructive' as const }
      case 'reorder_needed':
        return { label: 'Reorder Needed', variant: 'default' as const }
      default:
        return { label: alertType, variant: 'default' as const }
    }
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p>No active stock alerts</p>
            <p className="text-sm text-muted-foreground">All products are adequately stocked</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Stock Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          {alerts.map((alert, index) => {
            const alertInfo = getAlertType(alert.alert_type || 'unknown')

            return (
              <div
                key={alert.id ?? `alert-${index}`}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{alert.product?.name || 'Unknown Product'}</span>
                    <Badge variant={alertInfo.variant}>{alertInfo.label}</Badge>
                  </div>
                  {alert.message && (
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert.id && handleResolve(alert.id)}
                  disabled={!alert.id || isPending}
                  aria-busy={isPending}
                >
                  Resolve
                </Button>
              </div>
            )
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}
