'use client'

import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { UserActionsMenu } from './user-actions-menu'
import { formatDistanceToNow } from 'date-fns'
import { User, Shield } from 'lucide-react'
import { STATUS_BADGE_VARIANT } from '@/features/admin/admin-common/constants/badge-variants'
import { Spinner } from '@/components/ui/spinner'

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

interface UserTableRowProps {
  user: UserWithDetails
  isLoading: boolean
  onSuspend: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onReactivate: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onTerminateSessions: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onDelete?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onLoadingChange: (loading: boolean) => void
}

export function UserTableRow({
  user,
  isLoading,
  onSuspend,
  onReactivate,
  onTerminateSessions,
  onDelete,
  onLoadingChange,
}: UserTableRowProps) {
  const isActive = !user.deleted_at
  const displayName = user.full_name || user.username || 'Unknown'

  return (
    <TableRow
      className={isLoading ? 'pointer-events-none relative opacity-60' : 'relative'}
      aria-busy={isLoading}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-background/60 text-xs font-medium text-muted-foreground">
          <Spinner className="size-4" />
          <span>Processing…</span>
        </div>
      )}
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="size-4 text-muted-foreground" aria-hidden="true" />
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
                <Shield className="mr-1 size-3" aria-hidden="true" />
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
          onLoadingChange={onLoadingChange}
        />
      </TableCell>
    </TableRow>
  )
}
