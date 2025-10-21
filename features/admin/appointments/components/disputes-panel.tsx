import { Scale } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { DisputeCandidate } from '../api/types'

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
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{item.customerName || 'Unknown customer'}</span>
                    <Badge variant="secondary" className="text-xs">{item.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {item.salonName || 'Unknown salon'} · {formatCurrency(item.amount)}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{item.reason}</p>
                  <p className="mt-2 text-xs text-foreground">Recommended: {item.recommendedAction}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
