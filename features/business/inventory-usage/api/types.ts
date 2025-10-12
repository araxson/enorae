import type { Database } from '@/lib/types/database.types'

export type ProductUsageRow = Database['public']['Views']['product_usage']['Row']

export type ProductRow = Database['inventory']['Tables']['products']['Row']
export type AppointmentRow = Pick<
  Database['public']['Views']['appointments']['Row'],
  'id' | 'start_time'
>
export type ProfileRow = Pick<Database['public']['Views']['profiles']['Row'], 'id' | 'full_name'>
export type ServiceRow = Pick<Database['public']['Views']['services']['Row'], 'id' | 'name'>
export type StockLevelRow = Pick<
  Database['public']['Views']['stock_levels']['Row'],
  'quantity' | 'reserved_quantity'
>

export type ProductUsageWithDetails = ProductUsageRow & {
  product?: Pick<ProductRow, 'id' | 'name' | 'sku'> | null
  appointment?: Pick<AppointmentRow, 'id' | 'start_time'> | null
  staff?: Pick<ProfileRow, 'id' | 'full_name'> | null
}

export interface UsageAnalytics {
  totalUsage: number
  totalCost: number
  uniqueProducts: number
  avgCostPerUse: number
  topProducts: {
    product_id: string
    product_name: string
    total_quantity: number
    total_cost: number
    usage_count: number
  }[]
}

export interface UsageTrend {
  date: string
  total_quantity: number
  total_cost: number
  product_count: number
}

export interface ServiceCostAnalysis {
  service_id: string
  service_name: string
  total_appointments: number
  total_product_cost: number
  avg_cost_per_service: number
}

export interface HighUsageProduct {
  product_id: string
  product_name: string
  product_sku: string | null
  product_unit: string | null
  total_quantity: number
  total_cost: number
  usage_count: number
  daily_average: number
  current_stock: number
  minimum_stock: number
  days_until_reorder: number
}

export type UsageTrendRow = Pick<ProductUsageRow, 'quantity_used' | 'cost_at_time' | 'product_id'> & {
  used_at: string | null
}

export type ServiceSummary = Pick<ServiceRow, 'name'>
export type StockLevelSummary = Pick<StockLevelRow, 'quantity' | 'reserved_quantity'>

export type ProductSummary = Pick<ProductRow, 'id' | 'name' | 'sku'>
export type AppointmentSummary = Pick<AppointmentRow, 'id' | 'start_time'>
export type StaffSummary = Pick<ProfileRow, 'id' | 'full_name'>
