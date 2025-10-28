'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { deactivateUserRole } from '@/features/business/settings-roles/api/mutations'
import type { UserRoleWithDetails } from '@/features/business/settings-roles/api/queries'
import { useToast } from '@/lib/hooks/use-toast'
import { AssignRoleDialog } from './assign-role-dialog'
import { EditRoleDialog } from './edit-role-dialog'
import { RolesList } from './roles-list'

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
      <ItemGroup className="items-start justify-between gap-4">
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>User Roles Management</ItemTitle>
            <ItemDescription>Assign and manage roles for your team members</ItemDescription>
          </ItemContent>
        </Item>
        <ItemActions className="flex-none">
          <Button onClick={() => setIsAssignDialogOpen(true)} disabled={isPending}>
            <Plus className="mr-2 size-4" />
            Assign Role
          </Button>
        </ItemActions>
      </ItemGroup>

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
