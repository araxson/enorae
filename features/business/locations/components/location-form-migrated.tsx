'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  createSalonLocation,
  updateSalonLocation,
} from '@/features/business/locations/api/mutations'
import type { SalonLocation } from '@/features/business/locations'
import {
  LocationNameField,
  UrlSlugField,
  PrimaryLocationField,
  LocationFormStatus,
} from './sections'

type LocationFormProps = {
  location?: SalonLocation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  return <Button type="submit">{isEdit ? 'Update Location' : 'Create Location'}</Button>
}

export function LocationFormMigrated({ location, open, onOpenChange }: LocationFormProps) {
  const router = useRouter()
  const [isPrimary, setIsPrimary] = useState(location?.['is_primary'] || false)

  const isEditMode = Boolean(location)
  const action = isEditMode ? updateSalonLocation : createSalonLocation
  const [state, formAction, isPending] = useActionState(action, {})

  const firstErrorRef = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  // Close dialog and refresh on success
  useEffect(() => {
    if (state?.success) {
      onOpenChange(false)
      formRef.current?.reset()
      setIsPrimary(false)
      router.refresh()
    }
  }, [state?.success, onOpenChange, router])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open && formRef.current) {
      formRef.current.reset()
      setIsPrimary(location?.['is_primary'] || false)
    }
  }, [open, location])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Location' : 'Add Location'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the salon location details' : 'Add a new salon location'}
          </DialogDescription>
        </DialogHeader>

        <LocationFormStatus
          isPending={isPending}
          success={state?.success}
          error={state?.error}
          errors={state?.errors}
        />

        <form ref={formRef} action={formAction} className="grid gap-4 py-4">
          {/* Hidden fields */}
          {isEditMode && location?.id && <input type="hidden" name="id" value={location.id} />}
          <input type="hidden" name="isPrimary" value={isPrimary ? 'true' : 'false'} />

          <LocationNameField
            defaultValue={location?.['name'] ?? ''}
            isPending={isPending}
            errors={state?.errors?.['name']}
            firstErrorRef={firstErrorRef}
          />

          <UrlSlugField
            defaultValue={location?.['slug'] ?? ''}
            isPending={isPending}
            errors={state?.errors?.['slug']}
          />

          <PrimaryLocationField
            isPrimary={isPrimary}
            onIsPrimaryChange={setIsPrimary}
            isPending={isPending}
            errors={state?.errors?.['isPrimary']}
          />

          <DialogFooter>
            <ButtonGroup>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <SubmitButton isEdit={isEditMode} />
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
