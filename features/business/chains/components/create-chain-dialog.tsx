'use client'

import { useActionState, useEffect, useRef } from 'react'
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
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { createSalonChain, updateSalonChain } from '@/features/business/chains/api/mutations'
import type { SalonChainWithCounts } from '@/features/business/chains/api/queries'
import {
  Field,
  FieldContent,
  FieldDescription,
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
  const isEditing = !!chain
  const firstErrorRef = useRef<HTMLInputElement>(null)

  const [state, formAction, isPending] = useActionState(
    isEditing ? updateSalonChain : createSalonChain,
    null
  )

  // Focus first error field after validation
  useEffect(() => {
    if (state?.error && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.error])

  // Handle success
  useEffect(() => {
    if (state?.success) {
      toast.success(
        isEditing
          ? 'Salon chain updated successfully'
          : 'Salon chain created successfully'
      )
      onOpenChange(false)
      router.refresh()
    }
  }, [state?.success, isEditing, onOpenChange, router])

  // Handle error
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state?.error])

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

        <form action={formAction} noValidate>
          {/* Screen reader announcement */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {isPending && 'Form is submitting, please wait'}
            {state?.error && !isPending && state.error}
          </div>

          {/* Error message */}
          {state?.error && (
            <Alert variant="destructive" role="alert" className="mb-4">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {isEditing && <input type="hidden" name="id" value={chain?.['id'] ?? ''} />}

          <FieldSet>
            <Field>
              <FieldLabel htmlFor="name">
                Chain Name
                <span className="text-destructive" aria-label="required"> *</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  ref={state?.error ? firstErrorRef : null}
                  id="name"
                  name="name"
                  defaultValue={chain?.['name'] ?? ''}
                  placeholder="e.g., Luxury Salons Group"
                  required
                  aria-required="true"
                  aria-invalid={!!state?.error}
                  aria-describedby={state?.error ? 'name-error' : 'name-description'}
                  disabled={isPending}
                />
                <FieldDescription id="name-description">
                  A memorable name for your salon chain
                </FieldDescription>
                {state?.error && (
                  <p id="name-error" className="text-sm text-destructive mt-1" role="alert">
                    {state.error}
                  </p>
                )}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="legal_name">Legal Name</FieldLabel>
              <FieldContent>
                <Input
                  id="legal_name"
                  name="legal_name"
                  defaultValue={chain?.['legal_name'] ?? ''}
                  placeholder="e.g., Luxury Salons Inc."
                  aria-describedby="legal-name-description"
                  disabled={isPending}
                />
                <FieldDescription id="legal-name-description">
                  Optional: Official legal business name
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldSet>

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
              <Button type="submit" disabled={isPending} aria-busy={isPending}>
                {isPending ? (
                  <>
                    <Spinner className="size-4" />
                    <span aria-hidden="true">
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </span>
                    <span className="sr-only">
                      {isEditing ? 'Updating chain, please wait' : 'Creating chain, please wait'}
                    </span>
                  </>
                ) : (
                  <span>{isEditing ? 'Update' : 'Create'}</span>
                )}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
