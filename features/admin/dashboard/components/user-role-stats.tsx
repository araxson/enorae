import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Small } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
} from '@/components/ui/item'
import { Users } from 'lucide-react'

interface UserRoleStatsProps {
  stats: {
    roleCounts: Record<string, number>
    totalUsers: number
  }
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  platform_admin: 'Platform Admin',
  tenant_owner: 'Tenant Owner',
  salon_owner: 'Salon Owner',
  salon_manager: 'Salon Manager',
  senior_staff: 'Senior Staff',
  staff: 'Staff',
  junior_staff: 'Junior Staff',
  vip_customer: 'VIP Customer',
  customer: 'Customer',
  guest: 'Guest',
}

const roleColors: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  super_admin: 'destructive',
  platform_admin: 'destructive',
  tenant_owner: 'default',
  salon_owner: 'default',
  salon_manager: 'default',
  senior_staff: 'secondary',
  staff: 'secondary',
  junior_staff: 'secondary',
  vip_customer: 'outline',
  customer: 'outline',
  guest: 'outline',
}

export function UserRoleStats({ stats }: UserRoleStatsProps) {
  const sortedRoles = Object.entries(stats.roleCounts).sort(([, a], [, b]) => b - a)

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <Small>{stats.totalUsers} total users</Small>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {sortedRoles.map(([role, count], index) => {
            const percentage = ((count / stats.totalUsers) * 100).toFixed(1)
            return (
              <div key={role}>
                <Item variant="outline" size="sm">
                  <ItemMedia variant="icon">
                    <Users className="h-4 w-4" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{roleLabels[role] || role}</ItemTitle>
                    <ItemDescription>{percentage}% of users</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant={roleColors[role] || 'outline'}>
                      {count}
                    </Badge>
                  </ItemActions>
                </Item>
                {index < sortedRoles.length - 1 && <ItemSeparator />}
              </div>
            )
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
