'use client'

import { Card, CardContent } from '@/components/ui/card'
type Props = {
  message?: string
}

export function OrderItemsEmpty({ message = 'No items added yet. Click "Add Item" to get started.' }: Props) {
  return (
    <Card>
      <CardContent>
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  )
}
