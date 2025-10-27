import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface UserRoleStatsProps {
  stats: {
    roleCounts: Record<string, number>
    totalUsers: number
  }
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super admin',
  platform_admin: 'Platform admin',
  tenant_owner: 'Tenant owner',
  salon_owner: 'Salon owner',
  salon_manager: 'Salon manager',
  senior_staff: 'Senior staff',
  staff: 'Staff',
  junior_staff: 'Junior staff',
  vip_customer: 'VIP customer',
  customer: 'Customer',
  guest: 'Guest',
}

const roleDescriptions: Record<string, string> = {
  super_admin: 'Full platform access with ability to manage other admins.',
  platform_admin: 'Oversees global operations and compliance.',
  tenant_owner: 'Owns a tenant franchise with full salon management rights.',
  salon_owner: 'Primary contact for a specific salon.',
  salon_manager: 'Handles day-to-day salon operations.',
  senior_staff: 'Experienced staff with elevated permissions.',
  staff: 'Standard staff accounts handling appointments.',
  junior_staff: 'New staff members with limited privileges.',
  vip_customer: 'High-value customer segment requiring concierge service.',
  customer: 'Regular customer accounts.',
  guest: 'Unverified or pending accounts.',
}

const progressAccent: Record<string, string> = {
  super_admin: '[&>div]:bg-primary',
  platform_admin: '[&>div]:bg-primary',
  tenant_owner: '[&>div]:bg-accent',
  salon_owner: '[&>div]:bg-accent',
  salon_manager: '[&>div]:bg-secondary',
  senior_staff: '[&>div]:bg-secondary',
  staff: '[&>div]:bg-secondary',
  junior_staff: '[&>div]:bg-accent',
  vip_customer: '[&>div]:bg-primary',
  customer: '[&>div]:bg-primary',
  guest: '[&>div]:bg-muted',
}

export function UserRoleStats({ stats }: UserRoleStatsProps) {
  const sortedRoles = Object.entries(stats.roleCounts).sort(([, a], [, b]) => b - a)

  const topRole = sortedRoles[0]
  const topRoleLabel = topRole ? roleLabels[topRole[0]] || topRole[0] : null

  if (sortedRoles.length === 0) {
    return (
      <div className="h-full">
        <Card>
          <CardHeader className="space-y-3">
            <ItemGroup>
              <Item variant="muted">
                <ItemContent>
                  <CardTitle>User distribution</CardTitle>
                  <CardDescription>
                    Role analytics will appear when users are assigned roles.
                  </CardDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No role data available</EmptyTitle>
                <EmptyDescription>Assign platform roles to users to populate distribution metrics.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full">
      <Card>
        <CardHeader className="space-y-3">
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>User distribution</CardTitle>
                <CardDescription>
                  Breakdown by platform role with relative share.
                </CardDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="outline">
                  <Users className="mr-1 h-3 w-3" />
                  {stats.totalUsers.toLocaleString()} users
                </Badge>
              </ItemActions>
            </Item>
            {topRoleLabel ? (
              <Item variant="muted">
                <ItemContent>
                  <Badge variant="secondary">Most common: {topRoleLabel}</Badge>
                </ItemContent>
              </Item>
            ) : null}
          </ItemGroup>
        </CardHeader>

        <CardContent className="space-y-4">
          <ScrollArea className="h-80 pr-4">
            <div className="space-y-4">
              {sortedRoles.map(([role, count]) => {
                const percentage = stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0
                const label = roleLabels[role] || role
                return (
                  <Card key={role}>
                    <CardHeader className="pb-2">
                      <ItemGroup>
                        <Item>
                          <ItemContent>
                            <CardTitle>{label}</CardTitle>
                            <CardDescription>
                              {roleDescriptions[role] || 'No description available'}
                            </CardDescription>
                          </ItemContent>
                          <ItemActions>
                            <Badge variant="outline">{count.toLocaleString()}</Badge>
                          </ItemActions>
                        </Item>
                      </ItemGroup>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3 pt-0">
                      <Progress value={Number(percentage.toFixed(1))} className={`h-1.5 flex-1 ${progressAccent[role] ?? '[&>div]:bg-muted'}`} />
                      <span className="w-14 text-right text-xs font-medium text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
