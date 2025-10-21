'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
type Props = {
  onAddItem: () => void
}

export function OrderItemsHeader({ onAddItem }: Props) {
  return (
    <div className="flex gap-4 items-center justify-between mb-2">
      <p className="leading-7 font-semibold">Order Items</p>
      <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
        <Plus className="h-4 w-4 mr-1" />
        Add Item
      </Button>
    </div>
  )
}
