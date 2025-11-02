'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { UserRole } from '@/lib/types'
import { revokeRole } from '@/features/admin/roles/api/mutations'
import { deleteRole } from '@/features/admin/roles/api/mutations'

type Action = 'revoke' | 'delete' | null

export function useRoleActions() {
  const router = useRouter()
  const [targetRole, setTargetRole] = useState<UserRole | null>(null)
  const [editRole, setEditRole] = useState<UserRole | null>(null)
  const [action, setAction] = useState<Action>(null)
  const [isLoading, setIsLoading] = useState(false)

  const openRevokeDialog = (role: UserRole) => {
    setTargetRole(role)
    setAction('revoke')
  }

  const openDeleteDialog = (role: UserRole) => {
    setTargetRole(role)
    setAction('delete')
  }

  const openEditDialog = (role: UserRole) => {
    setEditRole(role)
  }

  const closeDialog = () => {
    setTargetRole(null)
    setAction(null)
  }

  const closeEditDialog = () => {
    setEditRole(null)
  }

  const handleRevoke = async () => {
    if (!targetRole) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('userId', targetRole.user_id)
      formData.append('role', targetRole.role)

      const result = await revokeRole(formData)

      if ('error' in result && result.error) {
        toast.error(result.error)
      } else {
        toast.success('Role revoked successfully')
        closeDialog()
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to revoke role')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!targetRole) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('role', targetRole.role)

      const result = await deleteRole(formData)

      if ('error' in result && result.error) {
        toast.error(result.error)
      } else {
        toast.success('Role deleted successfully')
        closeDialog()
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to delete role')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    state: {
      targetRole,
      action,
      isLoading,
      editRole,
    },
    openRevokeDialog,
    openDeleteDialog,
    openEditDialog,
    closeDialog,
    closeEditDialog,
    handleRevoke,
    handleDelete,
  }
}
