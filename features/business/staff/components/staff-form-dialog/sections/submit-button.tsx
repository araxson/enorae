'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

type SubmitButtonProps = {
  isEditMode: boolean
}

export function SubmitButton({ isEditMode }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="w-full"
    >
      {pending ? (
        <>
          <span className="sr-only">
            {isEditMode ? 'Updating staff member, please wait' : 'Creating staff member, please wait'}
          </span>
          <span aria-hidden="true">
            {isEditMode ? 'Updating...' : 'Creating...'}
          </span>
        </>
      ) : (
        isEditMode ? 'Update Staff Member' : 'Create Staff Member'
      )}
    </Button>
  )
}
