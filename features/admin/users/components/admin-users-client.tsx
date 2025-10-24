import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, UserX, Shield } from 'lucide-react'
import { getUsersOverview, getUsersWithDetails } from '@/features/admin/users/api/queries'
import type { AdminUser } from '@/features/admin/users/api/queries'
import {
  suspendUser,
  reactivateUser,
  terminateAllUserSessions,
  deleteUserPermanently,
} from '@/features/admin/users/api/mutations'
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
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>All accounts created within the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{overview.totalUsers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>Active Users</CardTitle>
                  <UserCheck className="h-4 w-4 text-primary" />
                </div>
                <CardDescription>Users with an active login status.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{overview.activeUsers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>Suspended</CardTitle>
                  <UserX className="h-4 w-4 text-destructive" />
                </div>
                <CardDescription>Accounts currently disabled by admins.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{overview.suspendedUsers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>With Roles</CardTitle>
                  <Shield className="h-4 w-4 text-secondary" />
                </div>
                <CardDescription>Users assigned to one or more roles.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{overview.usersWithRoles}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
              <CardDescription>User counts by platform role.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {overview.roleBreakdown.map((role) => (
                <Badge key={role.role} variant="outline">
                  {role.role.replace('_', ' ')}: {role.count}
                </Badge>
              ))}
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
