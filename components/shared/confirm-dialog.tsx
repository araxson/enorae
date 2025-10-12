'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export interface ConfirmDialogProps {
  children?: React.ReactNode
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  isOpen?: boolean
  onClose?: () => void
  isLoading?: boolean
}

export function ConfirmDialog({
  children,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
  onConfirm,
  onCancel,
  isOpen,
  onClose,
  isLoading = false,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.()
    onClose?.()
  }

  // Controlled mode (when isOpen is provided)
  if (isOpen !== undefined) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
              {cancelText}
            </AlertDialogCancel>
            {variant === 'destructive' ? (
              <AlertDialogAction asChild>
                <Button onClick={onConfirm} variant="destructive" disabled={isLoading}>
                  {confirmText}
                </Button>
              </AlertDialogAction>
            ) : (
              <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
                {confirmText}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  // Trigger mode (when children is provided)
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          {variant === 'destructive' ? (
            <AlertDialogAction asChild>
              <Button onClick={onConfirm} variant="destructive">
                {confirmText}
              </Button>
            </AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={onConfirm}>
              {confirmText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
