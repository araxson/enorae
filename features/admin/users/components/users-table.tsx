'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { UserActionsMenu } from './user-actions-menu'
import { formatDistanceToNow } from 'date-fns'
import { User, Shield } from 'lucide-react'
import { STATUS_BADGE_VARIANT } from '@/features/admin/admin-common/constants/badge-variants'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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

interface UsersTableProps {
  users: UserWithDetails[]
  onSuspend: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onReactivate: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onTerminateSessions: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onDelete?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
}

export function UsersTable({
  users,
  onSuspend,
  onReactivate,
  onTerminateSessions,
  onDelete,
}: UsersTableProps) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)

  if (users.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <User />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No users found</EmptyTitle>
          <EmptyDescription>Invite staff and administrators to populate the directory.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          Once accounts are created, role assignments, sessions, and status appear automatically.
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <div className="sr-only">
              <CardTitle>Platform users</CardTitle>
              <CardDescription>Manage staff and administrator accounts</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="-m-6">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Active Sessions</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                  const isActive = !user.deleted_at
                  const displayName = user.full_name || user.username || 'Unknown'
                  const rowIsLoading = loadingUserId === user.id

                  return (
                    <TableRow
                      key={user.id}
                      className={rowIsLoading ? 'pointer-events-none relative opacity-60' : 'relative'}
                      aria-busy={rowIsLoading}
                    >
                      {rowIsLoading && (
                        <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-background/60 text-xs font-medium text-muted-foreground">
                          <Spinner className="size-4" />
                          <span>Processing…</span>
                        </div>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium" title={displayName}>
                              {displayName}
                            </p>
                            {user.username && user.username !== displayName && (
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm" title={user.email ?? undefined}>
                          {user.email || 'No email'}
                        </span>
                      </TableCell>

                      <TableCell>
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
                      </TableCell>

                      <TableCell>
                        <Badge variant={STATUS_BADGE_VARIANT[isActive ? 'active' : 'suspended']}>
                          {isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant={(user.session_count ?? 0) > 0 ? 'default' : 'outline'}>
                          {user.session_count ?? 0}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {user.created_at
                            ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true })
                            : 'Unknown'}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <UserActionsMenu
                          userId={user.id}
                          userName={displayName}
                          isActive={isActive}
                          onSuspend={onSuspend}
                          onReactivate={onReactivate}
                          onTerminateSessions={onTerminateSessions}
                          onDelete={onDelete}
                          onLoadingChange={(loading) => setLoadingUserId(loading ? user.id : null)}
                        />
                      </TableCell>
                    </TableRow>
                  )
                    })}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 md:hidden">
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
                          onLoadingChange={(loading) => setLoadingUserId(loading ? user.id : null)}
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
    </>
  )
}
