'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function PasswordFormSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <Spinner className="size-4" />
          <span>Updating...</span>
        </>
      ) : (
        <span>Update Password</span>
      )}
    </Button>
  )
}
