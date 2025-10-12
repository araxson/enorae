"use client"

import { FormEvent } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Stack } from '@/components/layout'
import { toast } from 'sonner'

import type { TransferSelection, StockLocation } from './types'

export type TransferFormSubmit = (
  formData: FormData,
) => Promise<{ success?: boolean; error?: string }>

type TransferStockDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selection: TransferSelection | null
  locations: StockLocation[]
  isSubmitting: boolean
  onSubmit?: TransferFormSubmit
}

export function TransferStockDialog({
  open,
  onOpenChange,
  selection,
  locations,
  isSubmitting,
  onSubmit,
}: TransferStockDialogProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const result = await onSubmit(formData)

    if (result.success) {
      toast.success('Stock transferred successfully')
      onOpenChange(false)
    } else if (result.error) {
      toast.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Transfer Stock</DialogTitle>
            <DialogDescription>
              Transfer {selection?.productName} from {selection?.fromLocationName}
            </DialogDescription>
          </DialogHeader>

          <Stack gap="md" className="my-4">
            <input type="hidden" name="productId" value={selection?.productId || ''} />
            <input type="hidden" name="fromLocationId" value={selection?.fromLocationId || ''} />

            <div>
              <Label htmlFor="toLocationId">To Location</Label>
              <Select name="toLocationId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {locations
                    .filter((location) => location.id !== selection?.fromLocationId)
                    .map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">
                Quantity (Available: {selection?.availableQuantity || 0})
              </Label>
              <Input
                type="number"
                name="quantity"
                id="quantity"
                min={1}
                max={selection?.availableQuantity || 0}
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea name="notes" id="notes" rows={3} />
            </div>
          </Stack>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Transferring...' : 'Transfer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
