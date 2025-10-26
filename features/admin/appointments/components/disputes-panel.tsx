import { Scale } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
              <Card key={item.appointmentId}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{item.customerName || 'Unknown customer'}</CardTitle>
                    <div className="text-xs">
                      <Badge variant="secondary">
                        {(item.status || '').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {item.salonName || 'Unknown salon'} · {formatCurrency(item.amount)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <p className="text-xs text-muted-foreground">{item.reason}</p>
                  <p className="text-xs text-foreground">Recommended: {item.recommendedAction}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
