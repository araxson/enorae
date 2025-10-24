'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createSalonLocation, updateSalonLocation } from '../api/mutations'
import type { SalonLocation } from '@/features/business/locations'

type LocationFormProps = {
  location?: SalonLocation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LocationForm({ location, open, onOpenChange }: LocationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPrimary, setIsPrimary] = useState(location?.is_primary || false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('isPrimary', isPrimary.toString())

    try {
      const result = location
        ? await updateSalonLocation(formData)
        : await createSalonLocation(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Location ${location ? 'updated' : 'created'} successfully!`)
        onOpenChange(false)
      }
    } catch {
      toast.error('Failed to save location')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {location ? 'Edit Location' : 'Add Location'}
            </DialogTitle>
            <DialogDescription>
              {location
                ? 'Update the salon location details'
                : 'Add a new salon location'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {location && (
              <input type="hidden" name="id" value={location.id || ''} />
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={location?.name ?? ''}
                required
                maxLength={200}
                placeholder="Main Branch"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={location?.slug ?? ''}
                required
                maxLength={200}
                placeholder="main-branch"
                pattern="[a-z0-9-]+"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrimary"
                checked={isPrimary}
                onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
              />
              <Label htmlFor="isPrimary">
                Set as primary location
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
