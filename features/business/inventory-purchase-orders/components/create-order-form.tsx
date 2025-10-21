'use client'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Supplier, Product } from './types'
import { OrderMetadataFields } from './partials/create-form/order-metadata-fields'
import { OrderItemsList } from './partials/create-form/order-items-list'
import { OrderTotalCard } from './partials/create-form/order-total-card'
import { OrderFormActions } from './partials/create-form/order-form-actions'
import { useCreateOrderForm } from './hooks/use-create-order-form'

export type CreateOrderFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  suppliers: Supplier[]
  products: Product[]
}

export function CreateOrderForm({ open, onOpenChange, suppliers, products }: CreateOrderFormProps) {
  const router = useRouter()

  const handleClose = () => onOpenChange(false)

  const {
    items,
    isSubmitting,
    totalAmount,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
    handleSubmit,
  } = useCreateOrderForm({
    products,
    onClose: handleClose,
    onSuccess: () => router.refresh(),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <OrderMetadataFields suppliers={suppliers} />

            <OrderItemsList
              items={items}
              products={products}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onUpdateItem={handleUpdateItem}
            />

            <OrderTotalCard totalAmount={totalAmount} />

            <OrderFormActions
              onCancel={handleClose}
              isSubmitting={isSubmitting}
              canSubmit={items.length > 0}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
