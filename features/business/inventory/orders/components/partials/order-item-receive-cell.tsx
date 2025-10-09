'use client'

import type { ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { TableCell } from '@/components/ui/table'

const sanitizeInput = (event: ChangeEvent<HTMLInputElement>, remaining: number) => {
  const value = parseInt(event.target.value, 10)
  if (Number.isNaN(value)) {
    return 0
  }
  return Math.min(value, remaining)
}

type Props = {
  remaining: number
  itemId: string
  receivingQuantity: number | ''
  onQuantityChange: (itemId: string, nextQuantity: number) => void
}

export function OrderItemReceiveCell({
  remaining,
  itemId,
  receivingQuantity,
  onQuantityChange,
}: Props) {
  if (remaining <= 0 || !itemId) {
    return <TableCell className="text-right text-muted-foreground">-</TableCell>
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onQuantityChange(itemId, sanitizeInput(event, remaining))
  }

  return (
    <TableCell className="text-right">
      <Input
        type="number"
        min={0}
        max={remaining}
        placeholder={String(remaining)}
        value={receivingQuantity}
        onChange={handleChange}
        className="w-20 h-8"
      />
    </TableCell>
  )
}
