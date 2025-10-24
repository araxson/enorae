'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PermissionsEditor } from './permissions-editor'
import { updateRolePermissions } from '@/features/admin/roles/api/mutations'
import { toast } from 'sonner'
import type { UserRole } from '@/lib/types'

interface EditPermissionsDialogProps {
  role: UserRole | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPermissionsDialog({ role, open, onOpenChange }: EditPermissionsDialogProps) {
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && role) {
      setPermissions(role.permissions || [])
    }
  }, [open, role])

  const handleAddPermission = (permission: string) => {
    setPermissions((current) => {
      if (current.includes(permission)) {
        toast.warning('Permission already applied')
        return current
      }
      return [...current, permission]
    })
  }

  const handleRemovePermission = (permission: string) => {
    setPermissions((current) => current.filter((item) => item !== permission))
  }

  const handleSubmit = async () => {
    if (!role?.id) {
      toast.error('Invalid role identifier')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('roleId', role.id)
    formData.append('permissions', JSON.stringify(permissions))

    const result = await updateRolePermissions(formData)
    setIsLoading(false)

    if (!result.success) {
      toast.error(result.error)
    } else {
      toast.success('Permissions updated successfully.')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit permissions</DialogTitle>
          <DialogDescription>
            Adjust custom permissions for this assignment. Core role capabilities remain unchanged.
          </DialogDescription>
        </DialogHeader>

        <PermissionsEditor
          permissions={permissions}
          onAdd={handleAddPermission}
          onRemove={handleRemovePermission}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
