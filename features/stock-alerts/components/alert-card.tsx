'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Stack, Flex, Box } from '@/components/layout'
import { Small, P, Large } from '@/components/ui/typography'
import { resolveStockAlert, unresolveStockAlert } from '../actions/stock-alerts.actions'
import { useTransition } from 'react'
import type { StockAlertWithProduct } from '../dal/stock-alerts.queries'

interface AlertCardProps {
  alert: StockAlertWithProduct
}

export function AlertCard({ alert }: AlertCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleResolve = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('alertId', alert.id)
      await resolveStockAlert(formData)
    })
  }

  const handleUnresolve = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('alertId', alert.id)
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
    <Card className="p-4">
      <Stack gap="sm">
        <Flex justify="between" align="start">
          <Box>
            <Large>{alert.product?.name || 'Unknown Product'}</Large>
            {alert.product?.sku && (
              <Small className="text-muted-foreground">SKU: {alert.product.sku}</Small>
            )}
          </Box>
          <Flex gap="xs">
            <Badge variant={getAlertLevelVariant(alert.alert_level)}>
              {alert.alert_level.toUpperCase()}
            </Badge>
            {alert.is_resolved && (
              <Badge variant="outline">Resolved</Badge>
            )}
          </Flex>
        </Flex>

        <Stack gap="xs">
          <Flex gap="sm">
            <Small className="text-muted-foreground">Type:</Small>
            <Small>{getAlertTypeLabel(alert.alert_type)}</Small>
          </Flex>

          {alert.current_quantity !== null && (
            <Flex gap="sm">
              <Small className="text-muted-foreground">Current:</Small>
              <Small>
                {alert.current_quantity} {alert.product?.unit_of_measure || 'units'}
              </Small>
            </Flex>
          )}

          {alert.threshold_quantity !== null && (
            <Flex gap="sm">
              <Small className="text-muted-foreground">Threshold:</Small>
              <Small>
                {alert.threshold_quantity} {alert.product?.unit_of_measure || 'units'}
              </Small>
            </Flex>
          )}

          {alert.location && (
            <Flex gap="sm">
              <Small className="text-muted-foreground">Location:</Small>
              <Small>{alert.location.name}</Small>
            </Flex>
          )}

          {alert.message && (
            <Box>
              <Small className="text-muted-foreground">Message:</Small>
              <Small>{alert.message}</Small>
            </Box>
          )}

          <Flex gap="sm">
            <Small className="text-muted-foreground">Created:</Small>
            <Small>{new Date(alert.created_at).toLocaleDateString()}</Small>
          </Flex>

          {alert.resolved_at && (
            <Flex gap="sm">
              <Small className="text-muted-foreground">Resolved:</Small>
              <Small>{new Date(alert.resolved_at).toLocaleDateString()}</Small>
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
    </Card>
  )
}
