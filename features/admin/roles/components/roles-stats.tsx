import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Shield, UserCheck, UserX, Users } from 'lucide-react'

type RoleStatsProps = {
  stats: Record<string, { total: number; active: number; inactive: number }>
}

export function RolesStats({ stats }: RoleStatsProps) {
  const totalAssignments = Object.values(stats).reduce((sum, s) => sum + s.total, 0)
  const totalActive = Object.values(stats).reduce((sum, s) => sum + s.active, 0)
  const totalInactive = Object.values(stats).reduce((sum, s) => sum + s.inactive, 0)
  const uniqueRoles = Object.keys(stats).length

  return (
    <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Total Assignments</ItemTitle>
          <ItemMedia variant="icon">
            <Shield className="h-4 w-4 text-secondary" aria-hidden="true" />
          </ItemMedia>
        </ItemHeader>
        <ItemContent className="flex flex-col gap-2">
          <CardTitle>{totalAssignments}</CardTitle>
          <ItemDescription>All role assignments across the platform</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Active Roles</ItemTitle>
          <ItemMedia variant="icon">
            <UserCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          </ItemMedia>
        </ItemHeader>
        <ItemContent className="flex flex-col gap-2">
          <CardTitle>{totalActive}</CardTitle>
          <ItemDescription>Role assignments currently active</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Inactive Roles</ItemTitle>
          <ItemMedia variant="icon">
            <UserX className="h-4 w-4 text-accent" aria-hidden="true" />
          </ItemMedia>
        </ItemHeader>
        <ItemContent className="flex flex-col gap-2">
          <CardTitle>{totalInactive}</CardTitle>
          <ItemDescription>Assignments awaiting reactivation</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Role Types</ItemTitle>
          <ItemMedia variant="icon">
            <Users className="h-4 w-4 text-primary" aria-hidden="true" />
          </ItemMedia>
        </ItemHeader>
        <ItemContent className="flex flex-col gap-2">
          <CardTitle>{uniqueRoles}</CardTitle>
          <ItemDescription>Total unique roles with recent assignments</ItemDescription>
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(stats)
              .sort((a, b) => b[1].total - a[1].total)
              .slice(0, 3)
              .map(([role, data]) => (
                <Badge key={role} variant="secondary">
                  {role.replace('_', ' ')}: {data.total}
                </Badge>
              ))}
          </div>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
