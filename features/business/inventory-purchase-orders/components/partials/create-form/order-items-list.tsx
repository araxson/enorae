'use client'

import { Stack } from '@/components/layout'
import type { OrderItem, Product } from '../../types'
import { OrderItemCard } from './order-item-card'
import { OrderItemsEmpty } from './order-items-empty'
import { OrderItemsHeader } from './order-items-header'
type Props = {
  items: OrderItem[]
  products: Product[]
  onAddItem: () => void
  onRemoveItem: (index: number) => void
  onUpdateItem: (index: number, field: keyof OrderItem, value: unknown) => void
}

export function OrderItemsList({ items, products, onAddItem, onRemoveItem, onUpdateItem }: Props) {
  const hasItems = items.length > 0

  return (
    <div>
      <OrderItemsHeader onAddItem={onAddItem} />

      {hasItems ? (
        <Stack gap="sm">
          {items.map((item, index) => (
            <OrderItemCard
              key={`${item.productId}-${index}`}
              item={item}
              index={index}
              products={products}
              onRemove={onRemoveItem}
              onUpdate={onUpdateItem}
            />
          ))}
        </Stack>
      ) : (
        <OrderItemsEmpty />
      )}
    </div>
  )
}
