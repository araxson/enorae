'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

/**
 * Submit button using useFormStatus
 * MUST be a child of <form> element to work correctly
 *
 * CRITICAL FIX: Use useFormStatus instead of passing isPending prop
 * This is the React 19 pattern for form pending states
 */
export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? (
        <>
          <Spinner className="mr-2 size-4" />
          <span aria-hidden="true">Sending...</span>
          <span className="sr-only">Sending message, please wait</span>
        </>
      ) : (
        'Send Message'
      )}
    </Button>
  )
}
