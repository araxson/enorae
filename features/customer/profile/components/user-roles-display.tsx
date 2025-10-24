import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Building2 } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type UserRole = Database['public']['Views']['user_roles']['Row']

interface UserRolesDisplayProps {
  roles: UserRole[]
}

const getRoleBadgeVariant = (role: string | null) => {
  if (!role) return 'secondary' as const

  const roleStr = role.toLowerCase()
  if (roleStr.includes('admin') || roleStr.includes('owner')) {
    return 'default' as const
  }
  if (roleStr.includes('staff')) {
    return 'secondary' as const
  }
  return 'outline' as const
}

const getRoleDisplayName = (role: string | null) => {
  if (!role) return 'Unknown Role'

  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function UserRolesDisplay({ roles }: UserRolesDisplayProps) {
  if (roles.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <CardTitle>Active Roles</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {roles.map((userRole) => {
            const badgeLabel = userRole.salon_id ? 'Salon role' : 'Account role'

            return (
              <Card key={userRole.id}>
                <CardHeader className="flex items-center justify-between gap-3">
                  <CardTitle>{getRoleDisplayName(userRole.role)}</CardTitle>
                  <Badge variant={getRoleBadgeVariant(userRole.role)}>{badgeLabel}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userRole.salon_id && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span>Salon-specific role</span>
                    </div>
                  )}

                  {userRole.permissions && Array.isArray(userRole.permissions) && userRole.permissions.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground">Permissions</span>
                      <div className="flex flex-wrap gap-1 text-xs">
                        {userRole.permissions.slice(0, 5).map((permission, idx) => (
                          <Badge key={idx} variant="outline">
                            {String(permission)}
                          </Badge>
                        ))}
                        {userRole.permissions.length > 5 && (
                          <Badge variant="outline">+{userRole.permissions.length - 5} more</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {roles.length === 1 && roles[0]?.role === 'customer' && (
            <p className="py-2 text-center text-xs text-muted-foreground">
              You have a customer account. Contact salon staff to request additional roles.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
