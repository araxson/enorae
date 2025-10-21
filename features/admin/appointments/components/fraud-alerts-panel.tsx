import { ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { FraudAlert } from '../api/types'

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
          <p className="text-sm text-muted-foreground">No suspicious activity detected.</p>
        ) : (
          <div className="space-y-2">
            {alerts.slice(0, 8).map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{LABELS[alert.type]}</span>
                    <Badge variant={getVariant(alert.score)} className="text-xs">
                      Risk {(alert.score * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{alert.summary}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {alert.relatedAppointmentIds.length} linked appointment(s)
                    {alert.customerId ? ` · Customer ${alert.customerId}` : ''}
                    {alert.salonId ? ` · Salon ${alert.salonId}` : ''}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
