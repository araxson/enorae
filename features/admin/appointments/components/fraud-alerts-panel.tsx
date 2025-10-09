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
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <ShieldAlert className="h-4 w-4 text-red-600" />
          Fraud & Abuse Signals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No suspicious activity detected.</p>
        ) : (
          <ul className="space-y-2">
            {alerts.slice(0, 8).map((alert) => (
              <li key={alert.id} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">{LABELS[alert.type]}</span>
                  <Badge variant={getVariant(alert.score)} className="text-xs">
                    Risk {(alert.score * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{alert.summary}</p>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {alert.relatedAppointmentIds.length} linked appointment(s)
                  {alert.customerId ? ` · Customer ${alert.customerId}` : ''}
                  {alert.salonId ? ` · Salon ${alert.salonId}` : ''}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
