'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

/**
 * Submit button using useFormStatus
 * MUST be a child of <form>
 */
export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <span className="sr-only">Saving address, please wait</span>
          <Spinner className="size-4" aria-hidden="true" />
          <span aria-hidden="true">Saving…</span>
        </>
      ) : (
        <span>Save Address</span>
      )}
    </Button>
  )
}
