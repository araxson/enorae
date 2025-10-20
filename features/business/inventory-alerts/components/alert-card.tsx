'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Stack, Flex, Box } from '@/components/layout'
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
        <Stack gap="sm">
          <Flex justify="between" align="start">
            <Box>
              <span className="text-lg font-semibold">{alert.product?.name || 'Unknown Product'}</span>
              {alert.product?.sku && (
                <small className="text-sm font-medium leading-none text-muted-foreground">SKU: {alert.product.sku}</small>
              )}
            </Box>
            <Flex gap="xs">
              <Badge variant={getAlertLevelVariant(alert.alert_level || 'low')}>
                {alert.alert_level?.toUpperCase() || 'UNKNOWN'}
              </Badge>
              {alert.is_resolved && (
                <Badge variant="outline">Resolved</Badge>
              )}
            </Flex>
          </Flex>

          <Stack gap="xs">
            <Flex gap="sm">
              <small className="text-sm font-medium leading-none text-muted-foreground">Type:</small>
              <small className="text-sm font-medium leading-none">{getAlertTypeLabel(alert.alert_type || '')}</small>
            </Flex>

            {alert.current_quantity !== null && (
              <Flex gap="sm">
                <small className="text-sm font-medium leading-none text-muted-foreground">Current:</small>
                <small className="text-sm font-medium leading-none">
                  {alert.current_quantity} {alert.product?.unit_of_measure || 'units'}
                </small>
              </Flex>
            )}

            {alert.threshold_quantity !== null && (
              <Flex gap="sm">
                <small className="text-sm font-medium leading-none text-muted-foreground">Threshold:</small>
                <small className="text-sm font-medium leading-none">
                  {alert.threshold_quantity} {alert.product?.unit_of_measure || 'units'}
                </small>
              </Flex>
            )}

            {alert.location && (
              <Flex gap="sm">
                <small className="text-sm font-medium leading-none text-muted-foreground">Location:</small>
                <small className="text-sm font-medium leading-none">{alert.location.name}</small>
              </Flex>
            )}

            {alert.message && (
              <Box>
                <small className="text-sm font-medium leading-none text-muted-foreground">Message:</small>
                <small className="text-sm font-medium leading-none">{alert.message}</small>
              </Box>
            )}

            <Flex gap="sm">
              <small className="text-sm font-medium leading-none text-muted-foreground">Created:</small>
              <small className="text-sm font-medium leading-none">{alert.created_at ? new Date(alert.created_at).toLocaleDateString() : 'N/A'}</small>
            </Flex>

            {alert.resolved_at && (
              <Flex gap="sm">
                <small className="text-sm font-medium leading-none text-muted-foreground">Resolved:</small>
                <small className="text-sm font-medium leading-none">{new Date(alert.resolved_at).toLocaleDateString()}</small>
              </Flex>
            )}
          </Stack>

          <Flex justify="end" gap="sm">
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
          </Flex>
        </Stack>
      </CardContent>
    </Card>
  )
}
