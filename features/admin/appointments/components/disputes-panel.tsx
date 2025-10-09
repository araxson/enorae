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
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Scale className="h-4 w-4 text-muted-foreground" />
          Dispute Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {disputes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No high-risk appointments awaiting review.</p>
        ) : (
          <ul className="space-y-2">
            {disputes.slice(0, 6).map((item) => (
              <li key={item.appointmentId} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">{item.customerName || 'Unknown customer'}</span>
                  <Badge variant="secondary" className="text-xs">{item.status}</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {item.salonName || 'Unknown salon'} · {formatCurrency(item.amount)}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{item.reason}</p>
                <p className="mt-2 text-xs text-foreground">Recommended: {item.recommendedAction}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
