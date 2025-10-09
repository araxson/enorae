'use client'

import { format } from 'date-fns'
import { Shield, ShieldOff, Trash2, MoreVertical } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { UserRole } from '@/lib/types/app.types'

type Props = {
  roles: UserRole[]
  canDelete: boolean
  onRevoke: (role: UserRole) => void
  onDelete: (role: UserRole) => void
}

export function RolesTableContent({ roles, canDelete, onRevoke, onDelete }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Salon</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Assigned</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No role assignments found
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role) => {
              const displayUserId = role.user_id ? role.user_id.slice(0, 8) : 'Unassigned'
              const displaySalonId = role.salon_id ? role.salon_id.slice(0, 8) : '—'

              return (
                <TableRow key={role.id ?? `${role.user_id}-${role.role}`}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{displayUserId}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {role.user_id || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      {role.role?.replace(/_/g, ' ') || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{displaySalonId}</span>
                  </TableCell>
                  <TableCell>
                    {role.is_active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {role.permissions?.length ? role.permissions.join(', ') : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {role.created_at ? format(new Date(role.created_at), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {role.is_active ? (
                          <DropdownMenuItem onClick={() => onRevoke(role)}>
                            <ShieldOff className="mr-2 h-4 w-4" />
                            Revoke Role
                          </DropdownMenuItem>
                        ) : null}
                        {canDelete && (
                          <DropdownMenuItem onClick={() => onDelete(role)} variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Permanently
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
