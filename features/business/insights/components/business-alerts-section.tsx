'use client'

import {
  AlertTriangle,
  Info,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

import type { AnomalyAlert } from '@/features/business/insights/api/queries'

interface BusinessAlertsSectionProps {
  alerts: AnomalyAlert[]
}

export function BusinessAlertsSection({ alerts }: BusinessAlertsSectionProps) {
  if (alerts.length === 0) return null

  return (
    <div className="space-y-4">
      <ItemGroup>
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>Active alerts</ItemTitle>
            <ItemDescription>Review anomalies that need immediate attention.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
      <div className="flex flex-col gap-4">
        {alerts.map((alert) => {
          const Icon =
            alert.severity === 'critical'
              ? AlertTriangle
              : alert.severity === 'warning'
              ? AlertTriangle
              : Info

          return (
            <Alert
              key={alert.id}
              variant={alert.severity === 'critical' ? 'destructive' : 'default'}
            >
              <Icon className="h-4 w-4" />
              <AlertTitle>{alert.metric}</AlertTitle>
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>{alert.message}</span>
                  <Badge variant="outline">{alert.severity}</Badge>
                </div>
              </AlertDescription>
            </Alert>
          )
        })}
      </div>
    </div>
  )
}
