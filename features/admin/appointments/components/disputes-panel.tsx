import { Scale } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { DisputeCandidate } from '@/features/admin/appointments/types'

interface DisputesPanelProps {
  disputes: DisputeCandidate[]
}

const formatCurrency = (value: number | null) => {
  if (!value) return '$0'
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export function DisputesPanel({ disputes }: DisputesPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-muted-foreground" />
          <CardTitle>Dispute Queue</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {disputes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No high-risk appointments awaiting review.</p>
        ) : (
          <div className="space-y-2">
            {disputes.slice(0, 6).map((item) => (
              <Alert key={item.appointmentId} variant="default">
                <Scale className="h-4 w-4" />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <AlertTitle>{item.customerName || 'Unknown customer'}</AlertTitle>
                    <AlertDescription>
                      {item.salonName || 'Unknown salon'} · {formatCurrency(item.amount)}
                    </AlertDescription>
                    <AlertDescription className="mt-1">{item.reason}</AlertDescription>
                    <AlertDescription className="mt-1 font-medium">
                      Recommended: {item.recommendedAction}
                    </AlertDescription>
                  </div>
                  <Badge variant="secondary">
                    {(item.status || '').replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
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
