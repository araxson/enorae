import { Shield, Users, UserCheck, UserX } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle>Total Assignments</CardTitle>
            <Shield className="h-4 w-4 text-secondary" />
          </div>
          <CardDescription>All role assignments across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{totalAssignments}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle>Active Roles</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </div>
          <CardDescription>Role assignments currently active.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{totalActive}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle>Inactive Roles</CardTitle>
            <UserX className="h-4 w-4 text-accent" />
          </div>
          <CardDescription>Assignments awaiting reactivation.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{totalInactive}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle>Role Types</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <CardDescription>Total unique roles with recent assignments.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{uniqueRoles}</p>
          <div className="mt-2 flex flex-wrap gap-1 text-xs">
            {Object.entries(stats)
              .sort((a, b) => b[1].total - a[1].total)
              .slice(0, 3)
              .map(([role, data]) => (
                <Badge key={role} variant="secondary">
                  {role.replace('_', ' ')}: {data.total}
                </Badge>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
