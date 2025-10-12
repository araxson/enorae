import type { Database } from '@/lib/types/database.types'

export type ProductUsage = Database['public']['Views']['product_usage']['Row']
export type Product = Database['public']['Views']['products']['Row']
export type ServiceProductUsage = Database['public']['Views']['service_product_usage']['Row']
