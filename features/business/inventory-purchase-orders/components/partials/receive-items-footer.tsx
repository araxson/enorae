'use client'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'

type Props = {
  onSubmit: () => void
  isSubmitting: boolean
}

export function ReceiveItemsFooter({ onSubmit, isSubmitting }: Props) {
  return (
    <DialogFooter>
      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Receiving...' : 'Receive Items'}
      </Button>
    </DialogFooter>
  )
}
