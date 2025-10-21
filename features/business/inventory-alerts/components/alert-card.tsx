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
              <span className="text-lg font-semibold">{alert.product?.name || 'Unknown Product'}</span>
              {alert.product?.sku && (
                <small className="text-sm font-medium leading-none text-muted-foreground">SKU: {alert.product.sku}</small>
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
              <small className="text-sm font-medium leading-none text-muted-foreground">Type:</small>
              <small className="text-sm font-medium leading-none">{getAlertTypeLabel(alert.alert_type || '')}</small>
            </div>

            {alert.current_quantity !== null && (
              <div className="flex gap-3">
                <small className="text-sm font-medium leading-none text-muted-foreground">Current:</small>
                <small className="text-sm font-medium leading-none">
                  {alert.current_quantity} {alert.product?.unit_of_measure || 'units'}
                </small>
              </div>
            )}

            {alert.threshold_quantity !== null && (
              <div className="flex gap-3">
                <small className="text-sm font-medium leading-none text-muted-foreground">Threshold:</small>
                <small className="text-sm font-medium leading-none">
                  {alert.threshold_quantity} {alert.product?.unit_of_measure || 'units'}
                </small>
              </div>
            )}

            {alert.location && (
              <div className="flex gap-3">
                <small className="text-sm font-medium leading-none text-muted-foreground">Location:</small>
                <small className="text-sm font-medium leading-none">{alert.location.name}</small>
              </div>
            )}

            {alert.message && (
              <div>
                <small className="text-sm font-medium leading-none text-muted-foreground">Message:</small>
                <small className="text-sm font-medium leading-none">{alert.message}</small>
              </div>
            )}

            <div className="flex gap-3">
              <small className="text-sm font-medium leading-none text-muted-foreground">Created:</small>
              <small className="text-sm font-medium leading-none">{alert.created_at ? new Date(alert.created_at).toLocaleDateString() : 'N/A'}</small>
            </div>

            {alert.resolved_at && (
              <div className="flex gap-3">
                <small className="text-sm font-medium leading-none text-muted-foreground">Resolved:</small>
                <small className="text-sm font-medium leading-none">{new Date(alert.resolved_at).toLocaleDateString()}</small>
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
