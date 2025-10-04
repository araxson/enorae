'use client'

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

type UserWithDetails = {
  id: string
  username: string | null
  email: string | null
  full_name: string | null
  deleted_at: string | null
  created_at: string | null
  roles: string[]
  session_count: number
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
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
        <User className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No users found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
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

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{displayName}</p>
                      {user.username && user.username !== displayName && (
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm">{user.email || 'No email'}</span>
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">
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
                  {isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Suspended</Badge>
                  )}
                </TableCell>

                <TableCell>
                  <Badge variant={user.session_count > 0 ? 'default' : 'outline'}>
                    {user.session_count}
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
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
