'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
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
import { MoreVertical, UserX, UserCheck, ShieldOff, Trash2 } from 'lucide-react'

interface UserActionsMenuProps {
  userId: string
  userName: string
  isActive: boolean
  onSuspend: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onReactivate: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onTerminateSessions: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onDelete?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
}

export function UserActionsMenu({
  userId,
  userName,
  isActive,
  onSuspend,
  onReactivate,
  onTerminateSessions,
  onDelete,
}: UserActionsMenuProps) {
  const router = useRouter()
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [showReactivateDialog, setShowReactivateDialog] = useState(false)
  const [showTerminateDialog, setShowTerminateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSuspend() {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('reason', 'Suspended by admin')

    const result = await onSuspend(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('User suspended successfully')
      setShowSuspendDialog(false)
      router.refresh()
    }
  }

  async function handleReactivate() {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('userId', userId)

    const result = await onReactivate(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('User reactivated successfully')
      setShowReactivateDialog(false)
      router.refresh()
    }
  }

  async function handleTerminateSessions() {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('userId', userId)

    const result = await onTerminateSessions(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('All sessions terminated')
      setShowTerminateDialog(false)
      router.refresh()
    }
  }

  async function handleDelete() {
    if (!onDelete) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('userId', userId)

    const result = await onDelete(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('User deleted permanently')
      setShowDeleteDialog(false)
      router.refresh()
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {isActive ? (
            <DropdownMenuItem onClick={() => setShowSuspendDialog(true)}>
              <UserX className="h-4 w-4 mr-2" />
              Suspend User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setShowReactivateDialog(true)}>
              <UserCheck className="h-4 w-4 mr-2" />
              Reactivate User
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => setShowTerminateDialog(true)}>
            <ShieldOff className="h-4 w-4 mr-2" />
            Terminate Sessions
          </DropdownMenuItem>

          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Permanently
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Suspend Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend <strong>{userName}</strong>? This will deactivate
              all roles and sessions. The user can be reactivated later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspend} disabled={isLoading}>
              {isLoading ? 'Suspending...' : 'Suspend User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reactivate Dialog */}
      <AlertDialog open={showReactivateDialog} onOpenChange={setShowReactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reactivate <strong>{userName}</strong>? You will need to
              manually reactivate their roles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReactivate} disabled={isLoading}>
              {isLoading ? 'Reactivating...' : 'Reactivate User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Terminate Sessions Dialog */}
      <AlertDialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate All Sessions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to terminate all active sessions for <strong>{userName}</strong>
              ? They will be logged out of all devices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTerminateSessions} disabled={isLoading}>
              {isLoading ? 'Terminating...' : 'Terminate Sessions'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      {onDelete && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Permanently Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                <strong className="text-destructive">WARNING: This action is irreversible!</strong>
                <br />
                <br />
                Are you absolutely sure you want to permanently delete <strong>{userName}</strong>?
                All user data will be lost. This should only be done for GDPR compliance or legal
                requests.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isLoading}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isLoading ? 'Deleting...' : 'Delete Permanently'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
