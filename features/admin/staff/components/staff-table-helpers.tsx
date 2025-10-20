import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import type { StaffWithMetrics } from '../api/queries'

export function formatDate(value: string | null) {
  if (!value) return '—'
  try {
    return format(new Date(value), 'MMM d, yyyy')
  } catch (error) {
    return '—'
  }
}

export function renderBackgroundBadge(status: StaffWithMetrics['background']['status']) {
  switch (status) {
    case 'clear':
      return <Badge variant="outline">Clear</Badge>
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge variant="secondary">Missing</Badge>
  }
}
