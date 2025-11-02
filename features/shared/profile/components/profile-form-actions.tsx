'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'

interface ProfileFormActionsProps {
  isSubmitting: boolean
}

export function ProfileFormActions({ isSubmitting }: ProfileFormActionsProps) {
  const router = useRouter()

  return (
    <ButtonGroup>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner />
            <span>Saving...</span>
          </>
        ) : (
          <span>Save changes</span>
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => router.refresh()}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
    </ButtonGroup>
  )
}
