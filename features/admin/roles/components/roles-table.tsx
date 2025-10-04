'use client'

import { useState } from 'react'
import { MoreVertical, Shield, ShieldOff, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { revokeRole, deleteRole } from '../api/mutations'

type RoleAssignment = {
  id: string | null
  user_id: string | null
  user_name?: string | null
  user_email?: string | null
  role: string | null
  salon_id?: string | null
  salon_name?: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at?: string | null
  permissions?: string[] | null
}

type RolesTableProps = {
  roles: RoleAssignment[]
  canDelete?: boolean
}

export function RolesTable({ roles, canDelete = false }: RolesTableProps) {
  const [actionRole, setActionRole] = useState<RoleAssignment | null>(null)
  const [action, setAction] = useState<'revoke' | 'delete' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleRevoke() {
    if (!actionRole) return

    if (!actionRole.id) {
      toast.error('Invalid role ID')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('roleId', actionRole.id)

    const result = await revokeRole(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('The role has been deactivated successfully.')
    }

    setActionRole(null)
    setAction(null)
  }

  async function handleDelete() {
    if (!actionRole) return

    if (!actionRole.id) {
      toast.error('Invalid role ID')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('roleId', actionRole.id)

    const result = await deleteRole(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('The role has been permanently deleted.')
    }

    setActionRole(null)
    setAction(null)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Salon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No role assignments found
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{role.user_name || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{role.user_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      {role.role?.replace(/_/g, ' ') || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {role.salon_name ? (
                      <span className="text-sm">{role.salon_name}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {role.is_active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
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
                          <DropdownMenuItem
                            onClick={() => {
                              setActionRole(role)
                              setAction('revoke')
                            }}
                          >
                            <ShieldOff className="mr-2 h-4 w-4" />
                            Revoke Role
                          </DropdownMenuItem>
                        ) : null}
                        {canDelete && (
                          <DropdownMenuItem
                            onClick={() => {
                              setActionRole(role)
                              setAction('delete')
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Permanently
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Revoke Dialog */}
      <AlertDialog open={action === 'revoke'} onOpenChange={(open) => !open && setAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the <strong>{actionRole?.role?.replace(/_/g, ' ') || 'Unknown'}</strong> role from{' '}
              <strong>{actionRole?.user_name || actionRole?.user_email || 'Unknown'}</strong>? This will deactivate the role but preserve the record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevoke} disabled={isLoading}>
              {isLoading ? 'Revoking...' : 'Revoke'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={action === 'delete'} onOpenChange={(open) => !open && setAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this role assignment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
              {isLoading ? 'Deleting...' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
