"use client"

import { Badge } from '@/components/ui/badge'

export type StockStatus = 'out' | 'low' | 'ok' | 'unknown'

export function getStockStatus(available: number | null, lowThreshold: number = 5): StockStatus {
  if (available === null) return 'unknown'
  if (available <= 0) return 'out'
  if (available <= lowThreshold) return 'low'
  return 'ok'
}

export function StockStatusBadge({ status }: { status: StockStatus }) {
  switch (status) {
    case 'out':
      return <Badge variant="destructive">Out of Stock</Badge>
    case 'low':
      return <Badge variant="secondary">Low Stock</Badge>
    case 'ok':
      return <Badge variant="default">In Stock</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}
