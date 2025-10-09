'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stack } from '@/components/layout'
import { Label } from '@/components/ui/label'
import type { InventoryProductOption } from '../types'

type Props = {
  products: InventoryProductOption[]
  value: string
  onChange: (value: string) => void
}

export function ProductSelect({ products, value, onChange }: Props) {
  return (
    <Stack gap="sm">
      <Label htmlFor="productId">Product</Label>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger>
          <SelectValue placeholder="Select product" />
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              {product.name} {product.sku ? `(${product.sku})` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Stack>
  )
}
