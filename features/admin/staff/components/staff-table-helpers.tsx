import { Badge } from '@/components/ui/badge'
import type { StaffWithMetrics } from '@/features/admin/staff/api/queries'
import { formatDate } from '@/lib/utils/date-time'

export { formatDate }

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
