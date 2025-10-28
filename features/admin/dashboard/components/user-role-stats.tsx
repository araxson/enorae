import { Fragment } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemFooter,
  ItemSeparator,
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

export function UserRoleStats({ stats }: UserRoleStatsProps) {
  const sortedRoles = Object.entries(stats.roleCounts).sort(([, a], [, b]) => b - a)

  const topRole = sortedRoles[0]
  const topRoleLabel = topRole ? roleLabels[topRole[0]] || topRole[0] : null

  if (sortedRoles.length === 0) {
    return (
      <div className="h-full">
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>User distribution</ItemTitle>
                  <ItemDescription>
                    Role analytics will appear when users are assigned roles.
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Users aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No role data available</EmptyTitle>
                <EmptyDescription>
                  Assign platform roles to users to populate distribution metrics.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>Invite teams or sync data to unlock role analytics.</EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>User distribution</ItemTitle>
                <ItemDescription>
                  Breakdown by platform role with relative share.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="outline">
                  <Users className="mr-1 size-3" />
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

        <CardContent>
          <ScrollArea className="h-80">
            <ItemGroup>
              {sortedRoles.map(([role, count], index) => {
                const percentage = stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0
                const label = roleLabels[role] || role

                return (
                  <Fragment key={role}>
                    <Item variant="outline" size="sm">
                      <ItemHeader>
                        <ItemTitle>{label}</ItemTitle>
                        <Badge variant="outline">{count.toLocaleString()}</Badge>
                      </ItemHeader>
                      <ItemContent>
                        <ItemDescription>
                          {roleDescriptions[role] || 'No description available'}
                        </ItemDescription>
                        <Progress value={Number(percentage.toFixed(1))} />
                      </ItemContent>
                      <ItemFooter>
                        <ItemDescription>
                          {percentage.toFixed(1)}% of users
                        </ItemDescription>
                      </ItemFooter>
                    </Item>
                    {index < sortedRoles.length - 1 ? <ItemSeparator /> : null}
                  </Fragment>
                )
              })}
            </ItemGroup>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
