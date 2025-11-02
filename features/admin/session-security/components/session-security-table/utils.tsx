import { Badge } from '@/components/ui/badge'
import { ShieldAlert } from 'lucide-react'

/**
 * Get risk level badge based on level
 */
export function getRiskBadge(riskLevel: string) {
  switch (riskLevel) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>
    case 'high':
      return <Badge variant="outline">High</Badge>
    case 'medium':
      return <Badge variant="secondary">Medium</Badge>
    case 'low':
      return <Badge variant="outline">Low</Badge>
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

/**
 * Render security flags badge
 */
export function renderSecurityFlags(flags: string[]) {
  if (flags.length === 0) {
    return <Badge variant="outline">No flags</Badge>
  }

  return (
    <div className="flex items-center gap-1">
      <ShieldAlert className="size-4 text-destructive" />
      <Badge variant="destructive">{flags.length} flags</Badge>
    </div>
  )
}
