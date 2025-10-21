'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProductSelect } from './sections/product-select'
import { MovementTypeSelect } from './sections/movement-type-select'
import { LocationFields } from './sections/location-fields'
import { QuantityFields } from './sections/quantity-fields'
import { NotesField } from './sections/notes-field'
import { useCreateMovementForm } from './use-create-movement-form'
import type { CreateMovementDialogProps } from './types'

export function CreateMovementDialog({ open, onOpenChange, products, locations }: CreateMovementDialogProps) {
  const {
    state,
    isSubmitting,
    setMovementType,
    setProductId,
    setLocationId,
    setFromLocationId,
    setToLocationId,
    handleSubmit,
  } = useCreateMovementForm({
    onClose: () => onOpenChange(false),
  })

  const isTransfer = state.movementType === 'transfer'
  const isSubmitDisabled =
    isSubmitting ||
    !state.productId ||
    (isTransfer ? !state.fromLocationId || !state.toLocationId : !state.locationId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
            <DialogDescription>
              Manually record stock adjustments, transfers, damages, or other inventory movements
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 my-6">
            <ProductSelect products={products} value={state.productId} onChange={setProductId} />
            <MovementTypeSelect value={state.movementType} onChange={setMovementType} />
            <LocationFields
              movementType={state.movementType}
              locations={locations}
              locationId={state.locationId}
              fromLocationId={state.fromLocationId}
              toLocationId={state.toLocationId}
              onLocationChange={setLocationId}
              onFromLocationChange={setFromLocationId}
              onToLocationChange={setToLocationId}
            />
            <QuantityFields />
            <NotesField />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isSubmitting ? 'Recording...' : 'Record Movement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
