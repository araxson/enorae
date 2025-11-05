'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'

interface ProfileFormActionsProps {
  isPending: boolean
}

export function ProfileFormActions({ isPending }: ProfileFormActionsProps) {
  const router = useRouter()

  return (
    <ButtonGroup>
      <Button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
      >
        {isPending ? (
          <>
            <Spinner />
            <span className="sr-only">Saving changes, please wait</span>
            <span aria-hidden="true">Saving...</span>
          </>
        ) : (
          <span>Save changes</span>
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => router.refresh()}
        disabled={isPending}
      >
        Cancel
      </Button>
    </ButtonGroup>
  )
}
