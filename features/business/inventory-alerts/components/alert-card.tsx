'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { resolveStockAlert, unresolveStockAlert } from '../api/mutations'
import { useTransition } from 'react'
import type { StockAlertWithProduct } from '../api/queries'

interface AlertCardProps {
  alert: StockAlertWithProduct
}

export function AlertCard({ alert }: AlertCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleResolve = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('alertId', alert.id || '')
      await resolveStockAlert(formData)
    })
  }

  const handleUnresolve = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('alertId', alert.id || '')
      await unresolveStockAlert(formData)
    })
  }

  const getAlertLevelVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'destructive'
      case 'warning':
        return 'default'
      case 'info':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'Low Stock'
      case 'out_of_stock':
        return 'Out of Stock'
      case 'expiring_soon':
        return 'Expiring Soon'
      case 'expired':
        return 'Expired'
      default:
        return type
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex gap-4 items-start justify-between">
            <div>
              <p className="text-lg font-semibold">{alert.product?.name || 'Unknown Product'}</p>
              {alert.product?.sku && (
                <p className="text-sm font-medium text-muted-foreground">SKU: {alert.product.sku}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Badge variant={getAlertLevelVariant(alert.alert_level || 'low')}>
                {alert.alert_level?.toUpperCase() || 'UNKNOWN'}
              </Badge>
              {alert.is_resolved && (
                <Badge variant="outline">Resolved</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <p className="text-sm font-medium text-muted-foreground">Type:</p>
              <p className="text-sm font-medium">{getAlertTypeLabel(alert.alert_type || '')}</p>
            </div>

            {alert.current_quantity !== null && (
              <div className="flex gap-3">
                <p className="text-sm font-medium text-muted-foreground">Current:</p>
                <p className="text-sm font-medium">
                  {alert.current_quantity} {alert.product?.unit_of_measure || 'units'}
                </p>
              </div>
            )}

            {alert.threshold_quantity !== null && (
              <div className="flex gap-3">
                <p className="text-sm font-medium text-muted-foreground">Threshold:</p>
                <p className="text-sm font-medium">
                  {alert.threshold_quantity} {alert.product?.unit_of_measure || 'units'}
                </p>
              </div>
            )}

            {alert.location && (
              <div className="flex gap-3">
                <p className="text-sm font-medium text-muted-foreground">Location:</p>
                <p className="text-sm font-medium">{alert.location.name}</p>
              </div>
            )}

            {alert.message && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message:</p>
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            )}

            <div className="flex gap-3">
              <p className="text-sm font-medium text-muted-foreground">Created:</p>
              <p className="text-sm font-medium">{alert.created_at ? new Date(alert.created_at).toLocaleDateString() : 'N/A'}</p>
            </div>

            {alert.resolved_at && (
              <div className="flex gap-3">
                <p className="text-sm font-medium text-muted-foreground">Resolved:</p>
                <p className="text-sm font-medium">{new Date(alert.resolved_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            {!alert.is_resolved ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleResolve}
                disabled={isPending}
              >
                {isPending ? 'Resolving...' : 'Resolve'}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleUnresolve}
                disabled={isPending}
              >
                {isPending ? 'Unresolving...' : 'Reopen'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
