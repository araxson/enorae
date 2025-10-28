import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia } from '@/components/ui/item'

type UserRole = Database['identity']['Tables']['user_roles']['Row']

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
        <CardTitle>Active roles</CardTitle>
        <CardDescription>Roles linked to your customer account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {roles.map((userRole) => {
            const badgeLabel = userRole.salon_id ? 'Salon role' : 'Account role'

            return (
              <Card key={userRole.id}>
                <CardHeader>
                  <CardTitle>{getRoleDisplayName(userRole.role)}</CardTitle>
                  <CardDescription>{badgeLabel}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant={getRoleBadgeVariant(userRole.role)}>{badgeLabel}</Badge>
                  {userRole.salon_id ? (
                    <ItemGroup>
                      <Item variant="muted" size="sm">
                        <ItemMedia variant="icon">
                          <Building2 className="size-3" aria-hidden="true" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemDescription>Salon-specific role</ItemDescription>
                        </ItemContent>
                      </Item>
                    </ItemGroup>
                  ) : null}

                  {userRole.permissions && Array.isArray(userRole.permissions) && userRole.permissions.length > 0 ? (
                    <ItemGroup>
                      <Item variant="muted" size="sm">
                        <ItemContent>
                          <p className="text-xs font-medium text-muted-foreground">Permissions</p>
                          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                            {userRole.permissions.slice(0, 5).map((permission: string, idx: number) => (
                              <Badge key={idx} variant="outline">
                                {String(permission)}
                              </Badge>
                            ))}
                            {userRole.permissions.length > 5 && (
                              <Badge variant="outline">+{userRole.permissions.length - 5} more</Badge>
                            )}
                          </div>
                        </ItemContent>
                      </Item>
                    </ItemGroup>
                  ) : null}
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
