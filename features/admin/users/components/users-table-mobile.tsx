'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Shield } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { STATUS_BADGE_VARIANT } from '@/features/admin/common/constants/badge-variants'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { UserActionsMenu } from './user-actions-menu'

type UserWithDetails = {
  id: string
  username: string | null
  email: string | null
  full_name: string | null
  deleted_at: string | null
  created_at: string | null
  roles: string[]
  session_count?: number | null
}

interface UsersMobileTableProps {
  users: UserWithDetails[]
  loadingUserId: string | null
  onSuspend: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onReactivate: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onTerminateSessions: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onDelete?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onLoadingChange: (userId: string | null) => void
}

export function UsersMobileTable({
  users,
  loadingUserId,
  onSuspend,
  onReactivate,
  onTerminateSessions,
  onDelete,
  onLoadingChange,
}: UsersMobileTableProps) {
  return (
    <div className="space-y-4">
      {users.map((user) => {
        const isActive = !user.deleted_at
        const displayName = user.full_name || user.username || 'Unknown'
        const createdLabel = user.created_at
          ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true })
          : 'Unknown'

        return (
          <Card key={user.id}>
            <CardHeader>
              <div className="pb-2">
                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <CardTitle title={displayName}>{displayName}</CardTitle>
                      {user.username && user.username !== displayName ? (
                        <CardDescription>@{user.username}</CardDescription>
                      ) : null}
                    </ItemContent>
                    <ItemActions>
                      <Badge variant={STATUS_BADGE_VARIANT[isActive ? 'active' : 'suspended']}>
                        {isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>
                <CardDescription>Created {createdLabel}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 pt-0">
                <div>
                  <span className="font-medium">Email:</span>{' '}
                  <span>{user.email || 'No email'}</span>
                </div>

                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <ItemTitle>Roles</ItemTitle>
                      <ItemDescription>
                        <span className="sr-only">Assigned roles</span>
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
                <div className="flex flex-wrap gap-1">
                  {user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role} variant="outline" title={role.replace(/_/g, ' ')}>
                        <Shield className="mr-1 size-3" />
                        {role.replace('_', ' ')}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No roles</span>
                  )}
                </div>

                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <ItemTitle>Sessions</ItemTitle>
                      <ItemDescription>Active sessions across devices</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant={(user.session_count ?? 0) > 0 ? 'default' : 'outline'}>
                        {user.session_count ?? 0}
                      </Badge>
                    </ItemActions>
                  </Item>
                  <Item variant="muted">
                    <ItemActions>
                      <UserActionsMenu
                        userId={user.id}
                        userName={displayName}
                        isActive={isActive}
                        onSuspend={onSuspend}
                        onReactivate={onReactivate}
                        onTerminateSessions={onTerminateSessions}
                        onDelete={onDelete}
                        onLoadingChange={(loading: boolean) => onLoadingChange(loading ? user.id : null)}
                      />
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
