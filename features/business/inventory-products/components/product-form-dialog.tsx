'use client'

import { Dialog } from '@/components/ui/dialog'

import { ProductFormContent } from './product-form/product-form-content'
import { useProductForm } from './product-form/use-product-form'
import type { Database } from '@/lib/types/database.types'
import type { ProductWithRelations } from '../api/queries'

type ProductCategory = Database['public']['Views']['product_categories']['Row']
type Supplier = Database['public']['Views']['suppliers']['Row']

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  salonId: string
  categories: ProductCategory[]
  suppliers: Supplier[]
  editProduct?: ProductWithRelations | null
}

export function ProductFormDialog({
  open,
  onOpenChange,
  salonId,
  categories,
  suppliers,
  editProduct,
}: ProductFormDialogProps) {
  const form = useProductForm({
    open,
    salonId,
    editProduct: editProduct ?? null,
    onOpenChange,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ProductFormContent
        categories={categories}
        suppliers={suppliers}
        editProduct={editProduct ?? null}
        {...form}
      />
    </Dialog>
  )
}
