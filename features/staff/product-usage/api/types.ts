// Feature types
export type ProductUsage = {
  id: string
  productId: string
  productName: string
  quantity: number
  usedAt: string
}

export type ProductUsageFilters = {
  dateFrom?: string
  dateTo?: string
  productId?: string
}
