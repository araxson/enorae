'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { createSalonChain, updateSalonChain } from '@/features/business/chains/api/mutations'
import type { SalonChainWithCounts } from '@/features/business/chains/api/queries'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

type CreateChainDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  chain?: SalonChainWithCounts | null
}

export function CreateChainDialog({
  open,
  onOpenChange,
  chain,
}: CreateChainDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!chain

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = isEditing
        ? await updateSalonChain(formData)
        : await createSalonChain(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(
          isEditing
            ? 'Salon chain updated successfully'
            : 'Salon chain created successfully'
        )
        onOpenChange(false)
        router.refresh()
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Salon Chain' : 'Create Salon Chain'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your salon chain information.'
              : 'Create a new salon chain to manage multiple locations.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {isEditing && <input type="hidden" name="id" value={chain?.['id'] ?? ''} />}

          <FieldSet>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="name">Chain Name</FieldLabel>
                <FieldContent>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={chain?.['name'] ?? ''}
                    placeholder="e.g., Luxury Salons Group"
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="legal_name">Legal Name (Optional)</FieldLabel>
                <FieldContent>
                  <Input
                    id="legal_name"
                    name="legal_name"
                    defaultValue={chain?.['legal_name'] ?? ''}
                    placeholder="e.g., Luxury Salons Inc."
                  />
                  <FieldDescription>Optional legal entity name</FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="mt-6">
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
                {isSubmitting
                  ? isEditing
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditing
                  ? 'Update Chain'
                  : 'Create Chain'}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
