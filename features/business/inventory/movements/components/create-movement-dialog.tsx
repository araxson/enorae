'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack } from '@/components/layout'
import { createStockMovement } from '../api/mutations'

interface CreateMovementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Array<{ id: string; name: string | null; sku: string | null }>
  locations: Array<{ id: string; name: string | null }>
}

export function CreateMovementDialog({
  open,
  onOpenChange,
  products,
  locations,
}: CreateMovementDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [movementType, setMovementType] = useState<string>('adjustment')
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [fromLocation, setFromLocation] = useState<string>('')
  const [toLocation, setToLocation] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append('movementType', movementType)
    formData.append('productId', selectedProduct)

    // Set location based on movement type
    if (movementType === 'transfer') {
      formData.append('locationId', fromLocation) // Use from location as primary
      formData.append('fromLocationId', fromLocation)
      formData.append('toLocationId', toLocation)
    } else {
      formData.append('locationId', selectedLocation)
      if (movementType === 'in' || movementType === 'return') {
        formData.append('toLocationId', selectedLocation)
      } else if (movementType === 'out' || movementType === 'damage' || movementType === 'theft') {
        formData.append('fromLocationId', selectedLocation)
      }
    }

    const result = await createStockMovement(formData)

    if (result.success) {
      toast.success('Stock movement recorded successfully')
      onOpenChange(false)
      ;(e.target as HTMLFormElement).reset()
      setMovementType('adjustment')
      setSelectedProduct('')
      setSelectedLocation('')
      setFromLocation('')
      setToLocation('')
    } else {
      toast.error(result.error || 'Failed to record movement')
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
            <DialogDescription>
              Manually record stock adjustments, transfers, damages, or other inventory movements
            </DialogDescription>
          </DialogHeader>

          <Stack gap="lg" className="my-6">
            {/* Product Selection */}
            <Stack gap="sm">
              <Label htmlFor="productId">Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} {product.sku ? `(${product.sku})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Stack>

            {/* Movement Type */}
            <Stack gap="sm">
              <Label htmlFor="movementType">Movement Type</Label>
              <Select value={movementType} onValueChange={setMovementType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In (Receive)</SelectItem>
                  <SelectItem value="out">Stock Out (Issue)</SelectItem>
                  <SelectItem value="adjustment">Adjustment (Count)</SelectItem>
                  <SelectItem value="transfer">Transfer (Between Locations)</SelectItem>
                  <SelectItem value="return">Return (From Customer)</SelectItem>
                  <SelectItem value="damage">Damage/Spoilage</SelectItem>
                  <SelectItem value="theft">Theft/Loss</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Stack>

            {/* Location(s) */}
            {movementType === 'transfer' ? (
              <div className="grid grid-cols-2 gap-4">
                <Stack gap="sm">
                  <Label htmlFor="fromLocationId">From Location</Label>
                  <Select value={fromLocation} onValueChange={setFromLocation} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Stack>

                <Stack gap="sm">
                  <Label htmlFor="toLocationId">To Location</Label>
                  <Select value={toLocation} onValueChange={setToLocation} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Stack>
              </div>
            ) : (
              <Stack gap="sm">
                <Label htmlFor="locationId">Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Stack>
            )}

            {/* Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <Stack gap="sm">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  type="number"
                  id="quantity"
                  name="quantity"
                  required
                  min="1"
                  placeholder="e.g., 10"
                />
              </Stack>

              {/* Cost Price (optional) */}
              <Stack gap="sm">
                <Label htmlFor="costPrice">Cost Price (optional)</Label>
                <Input
                  type="number"
                  id="costPrice"
                  name="costPrice"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 25.50"
                />
              </Stack>
            </div>

            {/* Notes */}
            <Stack gap="sm">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional details about this movement..."
                rows={3}
              />
            </Stack>
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
            <Button type="submit" disabled={isSubmitting || !selectedProduct || (movementType === 'transfer' ? (!fromLocation || !toLocation) : !selectedLocation)}>
              {isSubmitting ? 'Recording...' : 'Record Movement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
