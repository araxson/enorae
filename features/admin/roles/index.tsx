import { Section } from '@/components/layout'
import { getAllRoleAssignments, getRoleStats } from './api/queries'
import { RolesClient } from './components/roles-client'
import { requireAnyRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function AdminRoles() {
  const session = await requireAnyRole(['super_admin', 'platform_admin'])
  const isSuperAdmin = session.role === 'super_admin'

  // Fetch roles and stats in parallel
  const [roles, stats] = await Promise.all([
    getAllRoleAssignments(),
    getRoleStats(),
  ])

  // Fetch salons for role assignment dropdown
  const supabase = await createClient()
  const { data: salons } = await supabase
    .from('salons')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  return (
    <Section size="lg">
      <RolesClient
        roles={roles}
        stats={stats}
        salons={salons || []}
        canDelete={isSuperAdmin}
      />
    </Section>
  )
}
