import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export interface SecurityIncidentRecord {
  id: string
  event_type: string
  severity: 'info' | 'warning' | 'critical'
  user_email: string | null
  description: string
  impacted_resources: string[]
  remediation_status: 'pending' | 'in_progress' | 'resolved'
  occurred_at: string
  created_at: string
}

export interface SecurityIncidentsSnapshot {
  incidents: SecurityIncidentRecord[]
  totalCount: number
  criticalCount: number
  pendingCount: number
}

export async function getSecurityIncidents(
  options: { limit?: number; offset?: number } = {},
): Promise<SecurityIncidentsSnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()
  const limit = options.limit ?? 100
  const offset = options.offset ?? 0

  const { data: incidents, error } = await supabase
    .from('security_incident_logs_view')
    .select('*')
    .order('occurred_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch security incidents:', error)
    return { incidents: [], totalCount: 0, criticalCount: 0, pendingCount: 0 }
  }

  const { count: totalCount } = await supabase
    .from('security_incident_logs_view')
    .select('*', { count: 'exact', head: true })

  const { count: criticalCount } = await supabase
    .from('security_incident_logs_view')
    .select('*', { count: 'exact', head: true })
    .eq('severity', 'critical')

  const { count: pendingCount } = await supabase
    .from('security_incident_logs_view')
    .select('*', { count: 'exact', head: true })
    .eq('remediation_status', 'pending')

  return {
    incidents: (incidents as SecurityIncidentRecord[]) ?? [],
    totalCount: totalCount ?? 0,
    criticalCount: criticalCount ?? 0,
    pendingCount: pendingCount ?? 0,
  }
}
