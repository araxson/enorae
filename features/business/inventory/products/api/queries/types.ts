import type { Database } from '@/lib/types/database.types'

export type ProductRow = Database['public']['Views']['products']['Row']
export type ProductCategoryRow = Database['public']['Views']['product_categories']['Row']
export type StockLevelRow = Database['public']['Views']['stock_levels']['Row']
export type StockAlertRow = Database['public']['Views']['stock_alerts']['Row']
export type SupplierRow = Database['public']['Views']['suppliers']['Row']
export type PurchaseOrderRow = Database['public']['Views']['purchase_orders']['Row']

export type ProductWithRelations = ProductRow & {
  category: ProductCategoryRow | null
  supplier: SupplierRow | null
  stock_levels: StockLevelRow[]
}

export type StockLevelWithProduct = StockLevelRow & {
  product: ProductRow | null
  current_stock?: number | null
  available_stock?: number | null
  product_id?: string | null
}

export type StockAlertWithProduct = StockAlertRow & {
  product: ProductRow | null
}

export type PurchaseOrderWithSupplier = PurchaseOrderRow & {
  supplier: SupplierRow | null
  purchase_order_items: Array<{
    id: string
    product_id: string
    quantity_ordered: number
    quantity_received: number | null
    unit_price: number
    total_price: number | null
    product: ProductRow | null
  }>
}
