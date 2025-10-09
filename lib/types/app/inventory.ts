import type { Database } from '../database.types'

export type Product = Database['public']['Views']['products']['Row']
export type ProductCategory = Database['public']['Views']['product_categories']['Row']
export type ProductUsage = Database['public']['Views']['product_usage']['Row']
export type PurchaseOrder = Database['public']['Views']['purchase_orders']['Row']
export type PurchaseOrderItem = Database['public']['Views']['purchase_order_items']['Row']
export type StockAlert = Database['public']['Views']['stock_alerts']['Row']
export type StockLevel = Database['public']['Views']['stock_levels']['Row']
export type StockLocation = Database['public']['Views']['stock_locations']['Row']
export type StockMovement = Database['public']['Views']['stock_movements']['Row']
export type Supplier = Database['public']['Views']['suppliers']['Row']
