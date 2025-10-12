import type { ProductWithRelations } from '../../api/queries'
import type { Database } from '@/lib/types/database.types'

export type ProductCategory = Database['public']['Views']['product_categories']['Row']
export type Supplier = Database['public']['Views']['suppliers']['Row']

export type ProductFormState = {
  name: string
  description: string
  sku: string
  category_id: string
  supplier_id: string
  cost_price: string
  retail_price: string
  reorder_point: string
  reorder_quantity: string
  unit_of_measure: string
  is_active: boolean
  is_tracked: boolean
}

export type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  salonId: string
  categories: ProductCategory[]
  suppliers: Supplier[]
  editProduct?: ProductWithRelations | null
}
