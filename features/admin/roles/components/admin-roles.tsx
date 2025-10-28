import { requireAnyRole } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { UserRole } from '@/lib/types'
import { getAllRoleAssignments, getRoleAuditTimeline, getRoleStats } from '../api/queries'
import { RolesClient } from './roles-client'

export async function AdminRoles() {
  const session = await requireAnyRole(['super_admin', 'platform_admin'])
  const isSuperAdmin = session.role === 'super_admin'

  const [roles, stats, auditEvents] = await Promise.all([
    getAllRoleAssignments(),
    getRoleStats(),
    getRoleAuditTimeline(50),
  ])

  const supabase = createServiceRoleClient()
  const { data: salons } = await supabase
    .from('salons_view')
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

  const transformedRoles = roles.reduce<UserRole[]>((acc, role) => {
    if (!role.id || !role.created_at || !role.updated_at || !role.role || !role.user_id) {
      return acc
    }

    acc.push({
      id: role.id,
      created_at: role.created_at,
      updated_at: role.updated_at,
      created_by_id: role.user_id,
      updated_by_id: role.user_id,
      deleted_at: null,
      deleted_by_id: null,
      is_active: role.is_active ?? true,
      permissions: role.permissions,
      role: role.role,
      salon_id: role.salon_id,
      user_id: role.user_id,
    })

    return acc
  }, [])

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <RolesClient
          roles={transformedRoles}
          stats={stats}
          salons={sanitizedSalons}
          canDelete={isSuperAdmin}
          auditEvents={auditEvents}
        />
      </div>
    </section>
  )
}
