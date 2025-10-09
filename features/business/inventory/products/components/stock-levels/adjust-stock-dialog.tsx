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
import { P } from '@/components/ui/typography'
import { toast } from 'sonner'

import type { AdjustSelection } from './types'

export type AdjustFormSubmit = (
  formData: FormData,
) => Promise<{ success?: boolean; error?: string }>

type AdjustStockDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selection: AdjustSelection | null
  isSubmitting: boolean
  onSubmit?: AdjustFormSubmit
}

export function AdjustStockDialog({
  open,
  onOpenChange,
  selection,
  isSubmitting,
  onSubmit,
}: AdjustStockDialogProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return

    const formData = new FormData(event.currentTarget)
    const result = await onSubmit(formData)

    if (result.success) {
      toast.success('Stock adjusted successfully')
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
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Adjust {selection?.productName} at {selection?.locationName}
            </DialogDescription>
          </DialogHeader>

          <Stack gap="md" className="my-4">
            <input type="hidden" name="productId" value={selection?.productId || ''} />
            <input type="hidden" name="locationId" value={selection?.locationId || ''} />

            <div>
              <P className="text-sm mb-2">
                Current Quantity:{' '}
                <span className="font-semibold">{selection?.currentQuantity || 0}</span>
              </P>
            </div>

            <div>
              <Label htmlFor="adjustmentType">Adjustment Type</Label>
              <Select name="adjustmentType" required defaultValue="add">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add to current</SelectItem>
                  <SelectItem value="subtract">Subtract from current</SelectItem>
                  <SelectItem value="set">Set exact amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input type="number" name="quantity" id="quantity" min={0} required />
            </div>

            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                name="reason"
                id="reason"
                rows={3}
                placeholder="Required: Explain the reason for this adjustment"
                required
              />
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
              {isSubmitting ? 'Adjusting...' : 'Adjust'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
