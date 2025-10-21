'use client'

import { Button } from '@/components/ui/button'
type Props = {
  onCancel: () => void
  isSubmitting: boolean
  canSubmit: boolean
}

export function OrderFormActions({ onCancel, isSubmitting, canSubmit }: Props) {
  return (
    <div className="flex gap-3 justify-end">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting || !canSubmit}>
        {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
      </Button>
    </div>
  )
}
