'use client'

import { Badge } from '@/components/ui/badge'
import type { StaffWithMetrics } from '@/features/admin/staff/api/queries'

function getVariant(risk: StaffWithMetrics['compliance']['riskLabel']) {
  if (risk === 'high') return 'destructive' as const
  if (risk === 'medium') return 'default' as const
  return 'outline' as const
}

function getLabel(status: StaffWithMetrics['compliance']['status']) {
  if (status === 'critical') return 'Critical'
  if (status === 'warning') return 'Monitor'
  return 'Compliant'
}

export function StaffRiskBadge({ staff }: { staff: StaffWithMetrics }) {
  return (
    <Badge variant={getVariant(staff.compliance.riskLabel)}>
      {getLabel(staff.compliance.status)}
    </Badge>
  )
}
