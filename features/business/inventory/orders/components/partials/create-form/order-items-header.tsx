'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Flex } from '@/components/layout'
import { P } from '@/components/ui/typography'

type Props = {
  onAddItem: () => void
}

export function OrderItemsHeader({ onAddItem }: Props) {
  return (
    <Flex justify="between" align="center" className="mb-2">
      <P className="font-semibold">Order Items</P>
      <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
        <Plus className="h-4 w-4 mr-1" />
        Add Item
      </Button>
    </Flex>
  )
}
