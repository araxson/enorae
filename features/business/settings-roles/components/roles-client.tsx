'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RolesList } from './roles-list'
import { AssignRoleDialog } from './assign-role-dialog'
import { EditRoleDialog } from './edit-role-dialog'
import type { UserRoleWithDetails } from '../api/queries'
import { deactivateUserRole } from '../api/mutations'
import { useToast } from '@/lib/hooks/use-toast'

interface RolesClientProps {
  roles: UserRoleWithDetails[]
  availableStaff: Array<{ id: string; full_name: string | null; email: string | null }>
  salonId?: string
}

export function RolesClient({ roles, availableStaff, salonId }: RolesClientProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRoleWithDetails | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleEdit = (role: UserRoleWithDetails) => {
    setSelectedRole(role)
    setIsEditDialogOpen(true)
  }

  const handleDeactivate = (id: string) => {
    if (!confirm('Are you sure you want to deactivate this role?')) return

    startTransition(async () => {
      const result = await deactivateUserRole(id)

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Role deactivated successfully',
        })
      }
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-start justify-between">
        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold">User Roles Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Assign and manage roles for your team members
          </p>
        </div>
        <Button onClick={() => setIsAssignDialogOpen(true)} disabled={isPending}>
          <Plus className="h-4 w-4 mr-2" />
          Assign Role
        </Button>
      </div>

      <RolesList roles={roles} onEdit={handleEdit} onDeactivate={handleDeactivate} />

      <AssignRoleDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        availableStaff={availableStaff}
        salonId={salonId}
      />

      <EditRoleDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        role={selectedRole}
      />
    </div>
  )
}
