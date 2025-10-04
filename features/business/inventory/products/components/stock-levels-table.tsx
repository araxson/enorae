'use client'

import { useState } from 'react'
import { Package, MapPin, AlertTriangle, ArrowRightLeft, Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Stack } from '@/components/layout'
import { P } from '@/components/ui/typography'
import { toast } from 'sonner'

// Extended type for stock levels with product and location data
// Note: Database types may be out of sync - this reflects actual view structure
type StockLevelWithLocation = {
  id: string
  product_id: string | null
  location_id: string | null
  current_stock: number | null
  reorder_point: number | null
  min_stock_level: number | null
  max_stock_level: number | null
  product_name: string | null
  sku: string | null
  location_name: string | null
}

type StockLocation = {
  id: string
  name: string
}

type StockLevelsTableProps = {
  stockLevels: StockLevelWithLocation[]
  locations?: StockLocation[]
  onTransfer?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onAdjust?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
}

export function StockLevelsTable({
  stockLevels,
  locations = [],
  onTransfer,
  onAdjust,
}: StockLevelsTableProps) {
  const [selectedTransfer, setSelectedTransfer] = useState<{
    productId: string
    productName: string
    fromLocationId: string
    fromLocationName: string
    availableQuantity: number
  } | null>(null)

  const [selectedAdjust, setSelectedAdjust] = useState<{
    productId: string
    productName: string
    locationId: string
    locationName: string
    currentQuantity: number
  } | null>(null)

  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isAdjustOpen, setIsAdjustOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!onTransfer || !selectedTransfer) return

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const result = await onTransfer(formData)
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Stock transferred successfully')
      setIsTransferOpen(false)
      setSelectedTransfer(null)
    } else {
      toast.error(result.error || 'Failed to transfer stock')
    }
  }

  const handleAdjust = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!onAdjust || !selectedAdjust) return

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const result = await onAdjust(formData)
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Stock adjusted successfully')
      setIsAdjustOpen(false)
      setSelectedAdjust(null)
    } else {
      toast.error(result.error || 'Failed to adjust stock')
    }
  }

  const getStockStatus = (current: number | null, reorder: number | null) => {
    if (current === null) return 'unknown'
    if (reorder === null) return 'ok'
    if (current === 0) return 'out'
    if (current <= reorder) return 'low'
    return 'ok'
  }

  const getStatusBadge = (status: string) => {
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

  if (stockLevels.length === 0) {
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

  const showActions = onTransfer && onAdjust && locations.length > 0

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Current Stock</TableHead>
            <TableHead className="text-right">Reorder Point</TableHead>
            <TableHead className="text-right">Min Level</TableHead>
            <TableHead className="text-right">Max Level</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-center">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockLevels.map((level) => {
            const status = getStockStatus(level.current_stock, level.reorder_point)

            return (
              <TableRow key={level.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {status === 'low' || status === 'out' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : null}
                    <div>
                      <p className="font-medium">{level.product_name}</p>
                      {level.sku && (
                        <p className="text-xs text-muted-foreground">SKU: {level.sku}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{level.location_name || 'Unknown Location'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {level.current_stock ?? 0}
                </TableCell>
                <TableCell className="text-right">{level.reorder_point ?? 'Not set'}</TableCell>
                <TableCell className="text-right">
                  {level.min_stock_level ?? 'Not set'}
                </TableCell>
                <TableCell className="text-right">
                  {level.max_stock_level ?? 'Not set'}
                </TableCell>
                <TableCell>{getStatusBadge(status)}</TableCell>
                {showActions && (
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTransfer({
                            productId: level.product_id || '',
                            productName: level.product_name || '',
                            fromLocationId: level.location_id || '',
                            fromLocationName: level.location_name || '',
                            availableQuantity: level.current_stock || 0,
                          })
                          setIsTransferOpen(true)
                        }}
                        disabled={(level.current_stock || 0) === 0}
                        title="Transfer stock"
                      >
                        <ArrowRightLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAdjust({
                            productId: level.product_id || '',
                            productName: level.product_name || '',
                            locationId: level.location_id || '',
                            locationName: level.location_name || '',
                            currentQuantity: level.current_stock || 0,
                          })
                          setIsAdjustOpen(true)
                        }}
                        title="Adjust stock"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Transfer Dialog */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent>
          <form onSubmit={handleTransfer}>
            <DialogHeader>
              <DialogTitle>Transfer Stock</DialogTitle>
              <DialogDescription>
                Transfer {selectedTransfer?.productName} from {selectedTransfer?.fromLocationName}
              </DialogDescription>
            </DialogHeader>

            <Stack gap="md" className="my-4">
              <input type="hidden" name="productId" value={selectedTransfer?.productId || ''} />
              <input
                type="hidden"
                name="fromLocationId"
                value={selectedTransfer?.fromLocationId || ''}
              />

              <div>
                <Label htmlFor="toLocationId">To Location</Label>
                <Select name="toLocationId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations
                      .filter((loc) => loc.id !== selectedTransfer?.fromLocationId)
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
                  Quantity (Available: {selectedTransfer?.availableQuantity || 0})
                </Label>
                <Input
                  type="number"
                  name="quantity"
                  id="quantity"
                  min={1}
                  max={selectedTransfer?.availableQuantity || 0}
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
                onClick={() => setIsTransferOpen(false)}
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

      {/* Adjust Dialog */}
      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogContent>
          <form onSubmit={handleAdjust}>
            <DialogHeader>
              <DialogTitle>Adjust Stock</DialogTitle>
              <DialogDescription>
                Adjust {selectedAdjust?.productName} at {selectedAdjust?.locationName}
              </DialogDescription>
            </DialogHeader>

            <Stack gap="md" className="my-4">
              <input type="hidden" name="productId" value={selectedAdjust?.productId || ''} />
              <input type="hidden" name="locationId" value={selectedAdjust?.locationId || ''} />

              <div>
                <P className="text-sm mb-2">
                  Current Quantity:{' '}
                  <span className="font-semibold">{selectedAdjust?.currentQuantity || 0}</span>
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
                onClick={() => setIsAdjustOpen(false)}
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
    </>
  )
}
