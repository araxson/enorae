'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { Database } from '@/lib/types/database.types'

type ProductCategory = Database['public']['Views']['product_categories']['Row']
type Supplier = Database['public']['Views']['suppliers']['Row']

interface ProductCategorizationSectionProps {
  categories: ProductCategory[]
  suppliers: Supplier[]
  categoryId: string
  supplierId: string
  onCategoryChange: (value: string) => void
  onSupplierChange: (value: string) => void
}

export function ProductCategorizationSection({
  categories,
  suppliers,
  categoryId,
  supplierId,
  onCategoryChange,
  onSupplierChange,
}: ProductCategorizationSectionProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories
              .filter((category) => category.id)
              .map((category) => (
                <SelectItem key={category.id!} value={category.id!}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier</Label>
        <Select value={supplierId} onValueChange={onSupplierChange}>
          <SelectTrigger id="supplier">
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers
              .filter((supplier) => supplier.id)
              .map((supplier) => (
                <SelectItem key={supplier.id!} value={supplier.id!}>
                  {supplier.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
