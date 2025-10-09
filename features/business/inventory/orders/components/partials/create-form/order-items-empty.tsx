'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Muted } from '@/components/ui/typography'

type Props = {
  message?: string
}

export function OrderItemsEmpty({ message = 'No items added yet. Click "Add Item" to get started.' }: Props) {
  return (
    <Card>
      <CardContent>
        <div className="p-8 text-center">
          <Muted>{message}</Muted>
        </div>
      </CardContent>
    </Card>
  )
}
