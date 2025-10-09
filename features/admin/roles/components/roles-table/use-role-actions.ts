'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { revokeRole, deleteRole } from '../../api/mutations'
import type { UserRole } from '@/lib/types/app.types'

export function useRoleActions() {
  const [targetRole, setTargetRole] = useState<UserRole | null>(null)
  const [action, setAction] = useState<'revoke' | 'delete' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editRole, setEditRole] = useState<UserRole | null>(null)

  const closeDialog = () => {
    setTargetRole(null)
    setAction(null)
  }

  const closeEditDialog = () => {
    setEditRole(null)
  }

  const performAction = async (
    mutation: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  ) => {
    if (!targetRole?.id) {
      toast.error('Invalid role ID')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('roleId', targetRole.id)
    const result = await mutation(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(
        action === 'delete'
          ? 'The role has been permanently deleted.'
          : 'The role has been deactivated successfully.'
      )
      closeDialog()
    }
  }

  return {
    state: {
      targetRole,
      action,
      isLoading,
      editRole,
    },
    openRevokeDialog: (role: UserRole) => {
      setTargetRole(role)
      setAction('revoke')
    },
    openDeleteDialog: (role: UserRole) => {
      setTargetRole(role)
      setAction('delete')
    },
    openEditDialog: (role: UserRole) => {
      setEditRole(role)
    },
    closeDialog,
    closeEditDialog,
    handleRevoke: () => performAction(revokeRole),
    handleDelete: () => performAction(deleteRole),
  }
}
