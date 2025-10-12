import type { StockLevelWithLocation } from '../../api/stock-queries'

export type StockLocation = {
  id: string
  name: string
}

export type TransferSelection = {
  productId: string
  productName: string
  fromLocationId: string
  fromLocationName: string
  availableQuantity: number
}

export type AdjustSelection = {
  productId: string
  productName: string
  locationId: string
  locationName: string
  currentQuantity: number
}

export type StockLevelsTableProps = {
  stockLevels: StockLevelWithLocation[]
  locations?: StockLocation[]
  onTransfer?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onAdjust?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
}
