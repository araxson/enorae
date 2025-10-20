'use client'

import { useState } from 'react'

import { Package } from 'lucide-react'

import type { StockLevelsTableProps, TransferSelection, AdjustSelection } from './types'
import { StockLevelsTableView } from './stock-levels-table-view'
import { TransferStockDialog } from './transfer-stock-dialog'
import { AdjustStockDialog } from './adjust-stock-dialog'

export function StockLevelsTable({
  stockLevels,
  locations = [],
  onTransfer,
  onAdjust,
}: StockLevelsTableProps) {
  const [transferSelection, setTransferSelection] = useState<TransferSelection | null>(null)
  const [adjustSelection, setAdjustSelection] = useState<AdjustSelection | null>(null)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isAdjustOpen, setIsAdjustOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showActions = Boolean(onTransfer && onAdjust && locations.length > 0)

  const handleTransferSubmit = async (formData: FormData) => {
    if (!onTransfer) return { success: false, error: 'Transfer not supported' }
    setIsSubmitting(true)
    try {
      const result = await onTransfer(formData)
      if (!result.success) {
        return result
      }
      setTransferSelection(null)
      return result
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdjustSubmit = async (formData: FormData) => {
    if (!onAdjust) return { success: false, error: 'Adjustment not supported' }
    setIsSubmitting(true)
    try {
      const result = await onAdjust(formData)
      if (!result.success) {
        return result
      }
      setAdjustSelection(null)
      return result
    } finally {
      setIsSubmitting(false)
    }
  }

  const noStock = stockLevels.length === 0

  if (noStock) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No stock levels found</p>
        <p className="text-sm text-muted-foreground">
          Stock levels will appear here once products are added to locations
        </p>
      </div>
    )
  }

  return (
    <>
      <StockLevelsTableView
        stockLevels={stockLevels}
        showActions={showActions}
        onTransferClick={(selection) => {
          setTransferSelection(selection)
          setIsTransferOpen(true)
        }}
        onAdjustClick={(selection) => {
          setAdjustSelection(selection)
          setIsAdjustOpen(true)
        }}
      />

      <TransferStockDialog
        open={isTransferOpen}
        onOpenChange={(open) => {
          setIsTransferOpen(open)
          if (!open) setTransferSelection(null)
        }}
        selection={transferSelection}
        locations={locations}
        isSubmitting={isSubmitting}
        onSubmit={onTransfer ? handleTransferSubmit : undefined}
      />

      <AdjustStockDialog
        open={isAdjustOpen}
        onOpenChange={(open) => {
          setIsAdjustOpen(open)
          if (!open) setAdjustSelection(null)
        }}
        selection={adjustSelection}
        isSubmitting={isSubmitting}
        onSubmit={onAdjust ? handleAdjustSubmit : undefined}
      />
    </>
  )
}
