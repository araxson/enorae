'use client'

import { Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { OrderItem, Product } from '../../types'
import { formatOrderItemTotal } from '../../utils/order-calculations'
import { Button } from '@/components/ui/button'

const buildKey = (item: OrderItem, index: number) => `${item.productId}-${index}`

const toStringValue = (value: unknown) => (value == null ? '' : String(value))

type Props = {
  item: OrderItem
  index: number
  products: Product[]
  onRemove: (index: number) => void
  onUpdate: (index: number, field: keyof OrderItem, value: unknown) => void
}

export function OrderItemCard({ item, index, products, onRemove, onUpdate }: Props) {
  return (
    <Card key={buildKey(item, index)} className="p-4">
      <div className="grid gap-4 md:grid-cols-4 items-end">
        <div>
          <Label>Product</Label>
          <Select value={item.productId} onValueChange={(value) => onUpdate(index, 'productId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id!}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Quantity</Label>
          <Input
            type="number"
            min="1"
            value={toStringValue(item.quantity)}
            onChange={(event) => onUpdate(index, 'quantity', event.target.value)}
          />
        </div>

        <div>
          <Label>Unit Price</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={toStringValue(item.unitPrice)}
            onChange={(event) => onUpdate(index, 'unitPrice', event.target.value)}
          />
        </div>

        <div>
          <div className="flex gap-4 items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground text-xs">Total</p>
              <p className="leading-7 font-semibold">${formatOrderItemTotal(item)}</p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(index)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
