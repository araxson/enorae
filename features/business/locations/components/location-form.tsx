'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createSalonLocation, updateSalonLocation } from '@/features/business/locations/api/mutations/location'
import type { SalonLocation } from '@/features/business/locations'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

type LocationFormProps = {
  location?: SalonLocation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LocationForm({ location, open, onOpenChange }: LocationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPrimary, setIsPrimary] = useState(location?.['is_primary'] || false)

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

          <FieldSet>
            <FieldGroup className="grid gap-4 py-4">
              {location ? <input type="hidden" name="id" value={location['id'] || ''} /> : null}

              <Field>
                <FieldLabel htmlFor="name">Location Name *</FieldLabel>
                <FieldContent>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={location?.['name'] ?? ''}
                    required
                    maxLength={200}
                    placeholder="Main Branch"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="slug">URL Slug *</FieldLabel>
                <FieldContent>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={location?.['slug'] ?? ''}
                    required
                    maxLength={200}
                    placeholder="main-branch"
                    pattern="[a-z0-9-]+"
                  />
                  <FieldDescription>Use lowercase letters, numbers, and dashes only.</FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="isPrimary">Set as primary location</FieldLabel>
                <FieldContent>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isPrimary"
                      checked={isPrimary}
                      onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
                    />
                    <FieldDescription>Mark as the default location for the business.</FieldDescription>
                  </div>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <ButtonGroup>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>{location ? 'Update' : 'Create'}</span>
                )}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
