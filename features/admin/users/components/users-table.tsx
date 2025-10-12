'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserActionsMenu } from './user-actions-menu'
import { formatDistanceToNow } from 'date-fns'
import { User, Shield } from 'lucide-react'
import { DataTableEmpty } from '@/components/shared/data-table-empty'
import { STATUS_BADGE_VARIANT } from '@/features/admin/admin-common/constants/badge-variants'

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
      <DataTableEmpty
        icon={User}
        title="No users found"
        description="Invite staff and platform administrators to see them listed here."
      />
    )
  }

  return (
    <>
      <div className="hidden md:block border rounded-lg">
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
                className={rowIsLoading ? 'opacity-60 pointer-events-none relative' : 'relative'}
                aria-busy={rowIsLoading}
              >
                {rowIsLoading && (
                  <div className="absolute inset-0 rounded-lg bg-background/60 flex items-center justify-center text-xs font-medium text-muted-foreground">
                    Processing…
                  </div>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
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
                        <Badge key={role} variant="outline" className="text-xs" title={role.replace(/_/g, ' ')}>
                          <Shield className="h-3 w-3 mr-1" />
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
      </div>

      <div className="md:hidden space-y-4">
        {users.map((user) => {
          const isActive = !user.deleted_at
          const displayName = user.full_name || user.username || 'Unknown'
          const createdLabel = user.created_at
            ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true })
            : 'Unknown'

          return (
            <div key={user.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold" title={displayName}>
                    {displayName}
                  </p>
                  {user.username && user.username !== displayName && (
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  )}
                </div>
                <Badge variant={STATUS_BADGE_VARIANT[isActive ? 'active' : 'suspended']}>
                  {isActive ? 'Active' : 'Suspended'}
                </Badge>
              </div>

              <div className="text-sm">
                <span className="font-medium">Email:</span>{' '}
                <span>{user.email || 'No email'}</span>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium">Roles</span>
                <div className="flex flex-wrap gap-1">
                  {user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role} variant="outline" className="text-xs" title={role.replace(/_/g, ' ')}>
                        <Shield className="h-3 w-3 mr-1" />
                        {role.replace('_', ' ')}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No roles</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">Sessions: </span>
                  <Badge variant={(user.session_count ?? 0) > 0 ? 'default' : 'outline'}>
                    {user.session_count ?? 0}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">Created {createdLabel}</div>
              </div>

              <div className="pt-2 border-t">
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
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
