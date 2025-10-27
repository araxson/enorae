import { ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { FraudAlert } from '@/features/admin/appointments/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

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
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-destructive" />
          <CardTitle>Fraud &amp; Abuse Signals</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No suspicious activity detected</EmptyTitle>
              <EmptyDescription>Fraud signals surface automatically when risk thresholds trigger.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-2">
            {alerts.slice(0, 8).map((alert) => (
              <Alert key={alert.id} variant={alert.score >= 0.8 ? 'destructive' : 'default'}>
                <ShieldAlert className="h-4 w-4" />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <AlertTitle>{LABELS[alert.type]}</AlertTitle>
                    <AlertDescription>{alert.summary}</AlertDescription>
                    <AlertDescription className="mt-1">
                      {alert.relatedAppointmentIds.length} linked appointment(s)
                      {alert.customerId ? ` · Customer ${alert.customerId}` : ''}
                      {alert.salonId ? ` · Salon ${alert.salonId}` : ''}
                    </AlertDescription>
                  </div>
                  <Badge variant={getVariant(alert.score)}>
                    Risk {(alert.score * 100).toFixed(0)}%
                  </Badge>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
