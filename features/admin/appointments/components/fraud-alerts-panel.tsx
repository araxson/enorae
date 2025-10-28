import { ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { FraudAlert } from '@/features/admin/appointments/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'

interface FraudAlertsPanelProps {
  alerts: FraudAlert[]
}

const getVariant = (score: number) => {
  if (score >= 0.8) return 'destructive'
  if (score >= 0.5) return 'secondary'
  return 'outline'
}

const LABELS: Record<FraudAlert['type'], string> = {
  repeated_no_show: 'Repeat offender',
  high_value_cancellation: 'High-value cancellation',
  rapid_cancellation: 'Rapid cancellation',
  double_booking_risk: 'Double booking risk',
}

export function FraudAlertsPanel({ alerts }: FraudAlertsPanelProps) {
  return (
    <div className="h-full">
      <Card>
        <CardHeader>
          <div className="pb-4">
            <ItemGroup>
              <Item variant="muted">
                <ItemMedia variant="icon">
                  <ShieldAlert className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <CardTitle>Fraud &amp; Abuse Signals</CardTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No suspicious activity detected</EmptyTitle>
                  <EmptyDescription>
                    Fraud signals surface automatically when risk thresholds trigger.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="space-y-2">
                {alerts.slice(0, 8).map((alert) => (
                  <Alert key={alert.id} variant={alert.score >= 0.8 ? 'destructive' : 'default'}>
                    <ShieldAlert className="size-4" />
                    <ItemGroup>
                      <Item variant="muted" size="sm">
                        <ItemContent>
                          <div className="space-y-2">
                            <AlertTitle>{LABELS[alert.type]}</AlertTitle>
                            <AlertDescription>
                              <p>{alert.summary}</p>
                              <p className="mt-1">
                                {alert.relatedAppointmentIds.length} linked appointment(s)
                                {alert.customerId ? ` · Customer ${alert.customerId}` : ''}
                                {alert.salonId ? ` · Salon ${alert.salonId}` : ''}
                              </p>
                            </AlertDescription>
                          </div>
                        </ItemContent>
                        <ItemActions>
                          <Badge variant={getVariant(alert.score)}>
                            Risk {(alert.score * 100).toFixed(0)}%
                          </Badge>
                        </ItemActions>
                      </Item>
                    </ItemGroup>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
