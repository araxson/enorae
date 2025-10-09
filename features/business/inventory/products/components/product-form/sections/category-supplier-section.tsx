"use client"

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Grid } from '@/components/layout'

import type { ProductFormState, ProductCategory, Supplier } from '../types'

type CategorySupplierSectionProps = {
  formState: ProductFormState
  onChange: (state: ProductFormState) => void
  categories: ProductCategory[]
  suppliers: Supplier[]
}

export function CategorySupplierSection({
  formState,
  onChange,
  categories,
  suppliers,
}: CategorySupplierSectionProps) {
  return (
    <Grid cols={{ base: 1, md: 2 }} gap="md">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formState.category_id}
          onValueChange={(value) => onChange({ ...formState, category_id: value })}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories
              .filter((category): category is ProductCategory & { id: string } => Boolean(category.id))
              .map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier</Label>
        <Select
          value={formState.supplier_id}
          onValueChange={(value) => onChange({ ...formState, supplier_id: value })}
        >
          <SelectTrigger id="supplier">
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers
              .filter((supplier): supplier is Supplier & { id: string } => Boolean(supplier.id))
              .map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </Grid>
  )
}
