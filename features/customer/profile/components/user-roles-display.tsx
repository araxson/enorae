import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Building2 } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia } from '@/components/ui/item'

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
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Active Roles</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {roles.map((userRole) => {
            const badgeLabel = userRole.salon_id ? 'Salon role' : 'Account role'

            return (
              <Card key={userRole.id}>
                <CardHeader>
                  <ItemGroup>
                    <Item>
                      <ItemContent>
                        <CardTitle>{getRoleDisplayName(userRole.role)}</CardTitle>
                      </ItemContent>
                      <ItemActions className="flex-none">
                        <Badge variant={getRoleBadgeVariant(userRole.role)}>{badgeLabel}</Badge>
                      </ItemActions>
                    </Item>
                  </ItemGroup>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userRole.salon_id ? (
                    <ItemGroup>
                      <Item variant="muted" size="sm">
                        <ItemMedia variant="icon">
                          <Building2 className="h-3 w-3" aria-hidden="true" />
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
                          <ItemDescription>
                            <span className="text-xs text-muted-foreground">Permissions</span>
                          </ItemDescription>
                          <ItemDescription>
                            <div className="flex flex-wrap gap-1 text-xs">
                              {userRole.permissions.slice(0, 5).map((permission: string, idx: number) => (
                                <Badge key={idx} variant="outline">
                                  {String(permission)}
                                </Badge>
                              ))}
                              {userRole.permissions.length > 5 && (
                                <Badge variant="outline">+{userRole.permissions.length - 5} more</Badge>
                              )}
                            </div>
                          </ItemDescription>
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
