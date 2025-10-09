import type { Database } from '@/lib/types/database.types'

export type AdminInventory = Database['public']['Views']['admin_inventory_overview']['Row']

export type InventorySummary = {
  totalProducts: number
  totalStockValue: number
  lowStockAlerts: number
  criticalStockAlerts: number
  activeSalons: number
}

export type LowStockAlert = {
  productId: string
  productName: string
  productSku: string | null
  salonId: string
  salonName: string
  locationName: string
  currentQuantity: number
  lowThreshold: number | null
  criticalThreshold: number | null
  alertLevel: 'low' | 'critical'
}

export type SalonInventoryValue = {
  salonId: string
  salonName: string
  totalProducts: number
  totalQuantity: number
  estimatedValue: number
}

export type TopProduct = {
  productId: string
  productName: string
  productSku: string | null
  totalQuantity: number
  salonsCount: number
}

export type ProductCatalogItem = {
  productId: string
  productName: string
  productSku: string | null
  categoryName: string | null
  supplierName: string | null
  isActive: boolean
  isTracked: boolean
  salonCount: number
  totalQuantity: number
  totalAvailable: number
  lowStockLocations: number
  activeAlerts: number
  stockValue: number
  retailValue: number
  reorderPoint: number | null
}

export type SupplierOverviewItem = {
  supplierName: string
  productCount: number
  salonCount: number
  totalQuantity: number
  stockValue: number
  activeAlerts: number
}

export type InventoryValuationCategory = {
  categoryName: string
  productCount: number
  salonCount: number
  stockValue: number
  retailValue: number
  contribution: number
}

export type InventoryValuationSummary = {
  totalStockValue: number
  totalRetailValue: number
  categories: InventoryValuationCategory[]
}
