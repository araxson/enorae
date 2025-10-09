import { Section } from '@/components/layout'
import { getAllRoleAssignments, getRoleStats, getRoleAuditTimeline } from './api/queries'
import { RolesClient } from './components/roles-client'
import { requireAnyRole } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function AdminRoles() {
  const session = await requireAnyRole(['super_admin', 'platform_admin'])
  const isSuperAdmin = session.role === 'super_admin'

  // Fetch roles and stats in parallel
  const [roles, stats, auditEvents] = await Promise.all([
    getAllRoleAssignments(),
    getRoleStats(),
    getRoleAuditTimeline(50),
  ])

  // Fetch salons for role assignment dropdown
  const supabase = createServiceRoleClient()
  const { data: salons } = await supabase
    .from('salons')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  const sanitizedSalons = (salons || []).reduce<Array<{ id: string; name: string }>>(
    (acc, salon) => {
      if (!salon?.id) {
        return acc
      }
      acc.push({ id: salon.id, name: salon.name ?? 'Unnamed Salon' })
      return acc
    },
    []
  )

  return (
    <Section size="lg">
      <RolesClient
        roles={roles}
        stats={stats}
        salons={sanitizedSalons}
        canDelete={isSuperAdmin}
        auditEvents={auditEvents}
      />
    </Section>
  )
}
