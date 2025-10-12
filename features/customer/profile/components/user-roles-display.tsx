import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
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
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Active Roles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          {roles.map((userRole) => (
            <div key={userRole.id} className="flex items-start justify-between gap-4 rounded-lg border p-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(userRole.role)}>
                    {getRoleDisplayName(userRole.role)}
                  </Badge>
                </div>

                {userRole.salon_id && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    <Muted className="text-xs">Salon-specific role</Muted>
                  </div>
                )}

                {userRole.permissions && Array.isArray(userRole.permissions) && userRole.permissions.length > 0 && (
                  <div className="mt-2">
                    <Muted className="text-xs mb-1">Permissions:</Muted>
                    <div className="flex flex-wrap gap-1">
                      {userRole.permissions.slice(0, 5).map((permission, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {String(permission)}
                        </Badge>
                      ))}
                      {userRole.permissions.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{userRole.permissions.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {roles.length === 1 && roles[0]?.role === 'customer' && (
            <Muted className="text-xs text-center py-2">
              You have a customer account. Contact salon staff to request additional roles.
            </Muted>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
