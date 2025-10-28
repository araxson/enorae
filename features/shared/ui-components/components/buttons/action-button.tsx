'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

interface ActionButtonProps extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
  /**
   * Async action to perform on click
   */
  onAction: () => Promise<void>
  /**
   * Success message to show
   */
  successMessage?: string
  /**
   * Error message to show (or use error.message)
   */
  errorMessage?: string
  /**
   * Loading text to show
   */
  loadingText?: string
}

/**
 * ActionButton Component
 *
 * Button that handles async actions with loading state and toast feedback.
 * Automatically shows loading spinner and disables during action.
 *
 * @example
 * ```tsx
 * <ActionButton
 *   onAction={async () => await saveData()}
 *   successMessage="Data saved successfully"
 *   loadingText="Saving..."
 * >
 *   Save Changes
 * </ActionButton>
 * ```
 */
export function ActionButton({
  onAction,
  successMessage,
  errorMessage,
  loadingText,
  children,
  disabled,
  ...props
}: ActionButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await onAction()
      if (successMessage) {
        toast.success(successMessage)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      toast.error(errorMessage || message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? (
        <>
          <Spinner aria-hidden="true" />
          <span>{loadingText ?? children}</span>
        </>
      ) : (
        children
      )}
    </Button>
  )
}
