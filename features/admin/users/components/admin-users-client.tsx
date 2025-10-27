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
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'

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
                <ItemGroup>
                  <Item variant="muted" className="items-start justify-between gap-2">
                    <ItemContent>
                      <CardTitle>Total Users</CardTitle>
                      <CardDescription>All accounts created within the platform.</CardDescription>
                    </ItemContent>
                    <ItemActions>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{overview.totalUsers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ItemGroup>
                  <Item variant="muted" className="items-start justify-between gap-2">
                    <ItemContent>
                      <CardTitle>Active Users</CardTitle>
                      <CardDescription>Users with an active login status.</CardDescription>
                    </ItemContent>
                    <ItemActions>
                      <UserCheck className="h-4 w-4 text-primary" />
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{overview.activeUsers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ItemGroup>
                  <Item variant="muted" className="items-start justify-between gap-2">
                    <ItemContent>
                      <CardTitle>Suspended</CardTitle>
                      <CardDescription>Accounts currently disabled by admins.</CardDescription>
                    </ItemContent>
                    <ItemActions>
                      <UserX className="h-4 w-4 text-destructive" />
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{overview.suspendedUsers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ItemGroup>
                  <Item variant="muted" className="items-start justify-between gap-2">
                    <ItemContent>
                      <CardTitle>With Roles</CardTitle>
                      <CardDescription>Users assigned to one or more roles.</CardDescription>
                    </ItemContent>
                    <ItemActions>
                      <Shield className="h-4 w-4 text-secondary" />
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{overview.usersWithRoles}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <ItemGroup>
                <Item variant="muted">
                  <ItemContent>
                    <CardTitle>Role Distribution</CardTitle>
                    <CardDescription>User counts by platform role.</CardDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
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
