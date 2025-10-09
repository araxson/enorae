'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type { UserActionsMenuProps, UserActionResult } from './types'

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
}: Pick<
  UserActionsMenuProps,
  'userId' | 'userName' | 'onSuspend' | 'onReactivate' | 'onTerminateSessions' | 'onDelete'
>) {
  const router = useRouter()
  const [dialogs, setDialogs] = useState(initialDialogs)
  const [isLoading, setIsLoading] = useState(false)

  const closeDialogs = () => setDialogs(initialDialogs)
  const setDialog = (key: keyof typeof dialogs, value: boolean) =>
    setDialogs((current) => ({ ...current, [key]: value }))

  const performAction = async (
    action: (formData: FormData) => Promise<UserActionResult>,
    onSuccessMessage: string,
    payload?: (formData: FormData) => void
  ) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('userId', userId)
    payload?.(formData)

    const result = await action(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(onSuccessMessage)
      closeDialogs()
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
    handleDelete: () =>
      onDelete
        ? performAction(onDelete, 'User deleted permanently')
        : Promise.resolve(),
    userName,
    onDelete,
  }
}
