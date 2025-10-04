'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createStockLocation, updateStockLocation } from '../api/mutations'
import type { StockLocationWithCounts } from '../api/queries'

type LocationFormProps = {
  location?: StockLocationWithCounts | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LocationForm({ location, open, onOpenChange }: LocationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDefault, setIsDefault] = useState(location?.is_default || false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('isDefault', isDefault.toString())

    try {
      const result = location
        ? await updateStockLocation(formData)
        : await createStockLocation(formData)

      if (result.error) {
        alert(result.error)
      } else {
        onOpenChange(false)
      }
    } catch {
      alert('Failed to save location')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {location ? 'Edit Location' : 'Create Location'}
            </DialogTitle>
            <DialogDescription>
              {location
                ? 'Update the stock location details'
                : 'Add a new stock location for inventory organization'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {location && (
              <input type="hidden" name="id" value={location.id || ''} />
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={location?.name || ''}
                required
                maxLength={100}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={location?.description || ''}
                maxLength={500}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isDefault"
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(checked === true)}
              />
              <Label htmlFor="isDefault">
                Set as default location
              </Label>
            </div>
          </div>

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
              {isSubmitting ? 'Saving...' : location ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
