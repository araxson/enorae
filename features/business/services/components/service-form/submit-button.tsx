'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type SubmitButtonProps = {
  isEditMode: boolean
}

/**
 * Submit button component using useFormStatus
 * MUST be a child of <form> element to work correctly
 */
export function SubmitButton({ isEditMode }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? (
        <>
          <span className="sr-only">
            {isEditMode ? 'Updating service, please wait' : 'Creating service, please wait'}
          </span>
          <Spinner className="mr-2" aria-hidden="true" />
          <span aria-hidden="true">
            {isEditMode ? 'Updating...' : 'Creating...'}
          </span>
        </>
      ) : (
        isEditMode ? 'Update Service' : 'Create Service'
      )}
    </Button>
  )
}
