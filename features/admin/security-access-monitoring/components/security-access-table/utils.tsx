import { Badge } from '@/components/ui/badge'

/**
 * Get status badge based on access status
 */
export function getStatusBadge(status: string) {
  switch (status) {
    case 'blocked':
      return <Badge variant="destructive">Blocked</Badge>
    case 'flagged':
      return <Badge variant="outline">Flagged</Badge>
    case 'success':
      return <Badge variant="secondary">Success</Badge>
    default:
      return <Badge>Unknown</Badge>
  }
}

/**
 * Get acknowledgement status badge
 */
export function getAckBadge(ackStatus: string) {
  switch (ackStatus) {
    case 'acknowledged':
      return <Badge variant="secondary">Acknowledged</Badge>
    case 'dismissed':
      return <Badge variant="outline">Dismissed</Badge>
    case 'pending':
      return <Badge variant="default">Pending</Badge>
    default:
      return <Badge>Unknown</Badge>
  }
}

/**
 * Get risk color class based on score
 */
export function getRiskColor(riskScore: number): string {
  if (riskScore >= 80) return 'text-destructive'
  if (riskScore >= 60) return 'text-primary'
  if (riskScore >= 40) return 'text-secondary'
  return 'text-foreground'
}
