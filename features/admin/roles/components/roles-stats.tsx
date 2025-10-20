import { Shield, Users, UserCheck, UserX } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Flex, Box } from '@/components/layout'
import { Badge } from '@/components/ui/badge'

type RoleStatsProps = {
  stats: Record<string, { total: number; active: number; inactive: number }>
}

export function RolesStats({ stats }: RoleStatsProps) {
  const totalAssignments = Object.values(stats).reduce((sum, s) => sum + s.total, 0)
  const totalActive = Object.values(stats).reduce((sum, s) => sum + s.active, 0)
  const totalInactive = Object.values(stats).reduce((sum, s) => sum + s.inactive, 0)
  const uniqueRoles = Object.keys(stats).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <Box>
              <p className="leading-7 text-sm text-muted-foreground">Total Assignments</p>
              <p className="text-2xl font-bold">{totalAssignments}</p>
            </Box>
            <Shield className="h-4 w-4 text-blue-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <Box>
              <p className="leading-7 text-sm text-muted-foreground">Active Roles</p>
              <p className="text-2xl font-bold">{totalActive}</p>
            </Box>
            <UserCheck className="h-4 w-4 text-green-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <Box>
              <p className="leading-7 text-sm text-muted-foreground">Inactive Roles</p>
              <p className="text-2xl font-bold">{totalInactive}</p>
            </Box>
            <UserX className="h-4 w-4 text-orange-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <Box>
              <p className="leading-7 text-sm text-muted-foreground">Role Types</p>
              <p className="text-2xl font-bold">{uniqueRoles}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(stats)
                  .sort((a, b) => b[1].total - a[1].total)
                  .slice(0, 3)
                  .map(([role, data]) => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {role.replace('_', ' ')}: {data.total}
                    </Badge>
                  ))}
              </div>
            </Box>
            <Users className="h-4 w-4 text-purple-500" />
          </Flex>
        </CardContent>
      </Card>
    </div>
  )
}
