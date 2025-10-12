import type { Database } from '@/lib/types/database.types'

export type ProductRow =
  Database['inventory']['Tables']['products']['Row']
export type ProductUpdate =
  Database['inventory']['Tables']['products']['Update']
export type StockMovementInsert =
  Database['inventory']['Tables']['stock_movements']['Insert']
export type StockLevelRow =
  Database['inventory']['Tables']['stock_levels']['Row']
