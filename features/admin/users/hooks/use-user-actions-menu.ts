'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type { UserActionsMenuProps, UserActionResult } from '../api/types'

const initialDialogs = {
  suspend: false,
  reactivate: false,
  terminate: false,
  delete: false,
}

export function useUserActionsMenu({
  userId,
  userName,
  onSuspend,
  onReactivate,
  onTerminateSessions,
  onDelete,
  onLoadingChange,
}: Pick<
  UserActionsMenuProps,
  'userId' | 'userName' | 'onSuspend' | 'onReactivate' | 'onTerminateSessions' | 'onDelete' | 'onLoadingChange'
>) {
  const router = useRouter()
  const [dialogs, setDialogs] = useState(initialDialogs)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')

  const closeDialogs = () => setDialogs(initialDialogs)
  const setDialog = (key: keyof typeof dialogs, value: boolean) =>
    setDialogs((current) => {
      if (key === 'delete' && !value) {
        setDeleteReason('')
      }
      return { ...current, [key]: value }
    })

  const performAction = async (
    action: (formData: FormData) => Promise<UserActionResult>,
    onSuccessMessage: string,
    payload?: (formData: FormData) => void
  ) => {
    onLoadingChange?.(true, userId)
    setIsLoading(true)
    const formData = new FormData()
    formData.append('userId', userId)
    payload?.(formData)

    const result = await action(formData)
    setIsLoading(false)
    onLoadingChange?.(false, userId)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(onSuccessMessage)
      closeDialogs()
      setDeleteReason('')
      router.refresh()
    }
  }

  return {
    dialogs,
    isLoading,
    setDialog,
    handleSuspend: () =>
      performAction(onSuspend, 'User suspended successfully', (formData) => {
        formData.append('reason', 'Suspended by admin')
      }),
    handleReactivate: () => performAction(onReactivate, 'User reactivated successfully'),
    handleTerminateSessions: () => performAction(onTerminateSessions, 'All sessions terminated'),
    deleteReason,
    setDeleteReason,
    handleDelete: (reason: string) =>
      onDelete
        ? performAction(onDelete, 'User deleted permanently', (formData) => {
            formData.append('reason', reason)
          })
        : Promise.resolve(),
    userName,
    onDelete,
    onLoadingChange,
  }
}
