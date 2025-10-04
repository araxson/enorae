import { Section, Stack, Box, Flex } from '@/components/layout'
import { H1, P, Lead } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, UserX, Shield } from 'lucide-react'
import { getUsersOverview, getUsersWithDetails } from './api/queries'
import {
  suspendUser,
  reactivateUser,
  terminateAllUserSessions,
  deleteUserPermanently,
} from './api/mutations'
import { UsersTable } from './components/users-table'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function UserManagement() {
  // Require super admin for delete capability
  const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const isSuperAdmin = session.role === 'super_admin'

  const [overview, users] = await Promise.all([getUsersOverview(), getUsersWithDetails()])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>User Management</H1>
          <Lead>Manage platform users, roles, and permissions</Lead>
        </Box>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <Flex justify="between" align="start">
                <div>
                  <P className="text-sm text-muted-foreground">Total Users</P>
                  <p className="text-2xl font-bold">{overview.totalUsers}</p>
                </div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Flex justify="between" align="start">
                <div>
                  <P className="text-sm text-muted-foreground">Active Users</P>
                  <p className="text-2xl font-bold">{overview.activeUsers}</p>
                </div>
                <UserCheck className="h-4 w-4 text-green-500" />
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Flex justify="between" align="start">
                <div>
                  <P className="text-sm text-muted-foreground">Suspended</P>
                  <p className="text-2xl font-bold">{overview.suspendedUsers}</p>
                </div>
                <UserX className="h-4 w-4 text-red-500" />
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Flex justify="between" align="start">
                <div>
                  <P className="text-sm text-muted-foreground">With Roles</P>
                  <p className="text-2xl font-bold">{overview.usersWithRoles}</p>
                </div>
                <Shield className="h-4 w-4 text-blue-500" />
              </Flex>
            </CardContent>
          </Card>
        </div>

        {/* Roles Breakdown */}
        <Card>
          <CardContent className="p-6">
            <P className="text-sm font-medium mb-4">Role Distribution</P>
            <Flex gap="sm" wrap>
              {overview.roleBreakdown.map((role) => (
                <Badge key={role.role} variant="outline">
                  {role.role.replace('_', ' ')}: {role.count}
                </Badge>
              ))}
            </Flex>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Box>
          <UsersTable
            users={users}
            onSuspend={suspendUser}
            onReactivate={reactivateUser}
            onTerminateSessions={terminateAllUserSessions}
            onDelete={isSuperAdmin ? deleteUserPermanently : undefined}
          />
        </Box>
      </Stack>
    </Section>
  )
}
