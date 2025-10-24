import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users } from 'lucide-react'

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

  return (
    <div className="h-full">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>User distribution</CardTitle>
              <CardDescription>
                Breakdown by platform role with relative share.
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1 text-xs">
              <Users className="h-3 w-3" />
              {stats.totalUsers.toLocaleString()} users
            </Badge>
          </div>
          {topRoleLabel && (
            <Badge variant="secondary" className="w-fit text-xs font-semibold">
              Most common: {topRoleLabel}
            </Badge>
          )}
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
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle>{label}</CardTitle>
                        <Badge variant="outline" className="gap-1 text-xs">
                          {count.toLocaleString()}
                        </Badge>
                      </div>
                      <CardDescription>{roleDescriptions[role] || 'No description available'}</CardDescription>
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
