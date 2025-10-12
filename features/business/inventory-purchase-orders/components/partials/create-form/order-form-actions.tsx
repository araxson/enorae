'use client'

import { Button } from '@/components/ui/button'
import { Flex } from '@/components/layout'

type Props = {
  onCancel: () => void
  isSubmitting: boolean
  canSubmit: boolean
}

export function OrderFormActions({ onCancel, isSubmitting, canSubmit }: Props) {
  return (
    <Flex justify="end" gap="sm">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting || !canSubmit}>
        {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
      </Button>
    </Flex>
  )
}
