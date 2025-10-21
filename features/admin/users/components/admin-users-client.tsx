import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, UserX, Shield } from 'lucide-react'
import { getUsersOverview, getUsersWithDetails } from '../api/queries'
import type { AdminUser } from '../api/queries'
import {
  suspendUser,
  reactivateUser,
  terminateAllUserSessions,
  deleteUserPermanently,
} from '../api/mutations'
import { UsersTable } from './users-table'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function AdminUsersClient() {
  const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const isSuperAdmin = session.role === 'super_admin'
  const [overview, users] = await Promise.all([getUsersOverview(), getUsersWithDetails()])

  type AdminUserRecord = AdminUser & {
    id?: string | null
    roles?: string[] | null
    session_count?: number | null
  }

  const normalizedUsers = users.map((user) => {
    const record = user as AdminUserRecord
    return {
      ...record,
      id: record.id ?? '',
      roles: record.roles ?? [],
      session_count: record.session_count ?? 0,
    }
  })

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="leading-7 text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{overview.totalUsers}</p>
                </div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="leading-7 text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{overview.activeUsers}</p>
                </div>
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="leading-7 text-sm text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold">{overview.suspendedUsers}</p>
                </div>
                <UserX className="h-4 w-4 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="leading-7 text-sm text-muted-foreground">With Roles</p>
                  <p className="text-2xl font-bold">{overview.usersWithRoles}</p>
                </div>
                <Shield className="h-4 w-4 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <p className="leading-7 text-sm font-medium mb-4">Role Distribution</p>
            <div className="flex flex-wrap gap-4">
              {overview.roleBreakdown.map((role) => (
                <Badge key={role.role} variant="outline">
                  {role.role.replace('_', ' ')}: {role.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div>
          <UsersTable
            users={normalizedUsers}
            onSuspend={suspendUser}
            onReactivate={reactivateUser}
            onTerminateSessions={terminateAllUserSessions}
            onDelete={isSuperAdmin ? deleteUserPermanently : undefined}
          />
        </div>
        </div>
      </div>
    </section>
  )
}
