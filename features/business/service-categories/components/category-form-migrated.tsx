'use client'

import { useActionState, useEffect, useRef } from 'react'
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
  createServiceCategory,
  updateServiceCategory,
} from '@/features/business/service-categories/api/mutations'
import type { ServiceCategoryWithCounts } from '@/features/business/service-categories/api/queries'
import { CategoryFields, CategoryParentSelector } from './sections'

type CategoryFormProps = {
  category?: ServiceCategoryWithCounts | null
  categories: ServiceCategoryWithCounts[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  return (
    <Button type="submit">
      {isEdit ? 'Update Category' : 'Create Category'}
    </Button>
  )
}

export function CategoryFormMigrated({
  category,
  categories,
  open,
  onOpenChange,
}: CategoryFormProps) {
  const router = useRouter()
  const isEditMode = Boolean(category)

  // Use appropriate action based on edit mode
  const action = isEditMode ? updateServiceCategory : createServiceCategory
  const [state, formAction, isPending] = useActionState(action, {})

  const firstErrorRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Filter out current category and its descendants to prevent circular references
  const availableParents = categories.filter((c) => {
    if (!category) return true // Creating new, all categories available
    if (c['id'] === category['id']) return false // Can't be own parent
    return true
  })

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
      router.refresh()
    }
  }, [state?.success, onOpenChange, router])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open && formRef.current) {
      formRef.current.reset()
    }
  }, [open])

  const hasErrors = state?.errors && Object.keys(state.errors).length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Category' : 'Create Category'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the service category details'
              : 'Add a new service category to organize your services'}
          </DialogDescription>
        </DialogHeader>

        {/* Screen reader announcement for form status */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isPending && 'Form is submitting, please wait'}
          {state?.error && !isPending && state.error}
          {state?.success && 'Category saved successfully'}
        </div>

        {/* Error summary for accessibility */}
        {hasErrors && (
          <div
            role="alert"
            className="rounded-md bg-destructive/10 border border-destructive p-3 mb-4"
          >
            <h3 className="text-sm font-medium text-destructive mb-2">
              Please fix the following errors:
            </h3>
            <ul className="text-sm text-destructive list-disc list-inside">
              {Object.entries(state.errors || {}).map(([field, messages]) => (
                <li key={field}>
                  <a href={`#${field}`} className="underline hover:text-destructive/80">
                    {field}: {(messages as string[])[0]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Global error message */}
        {state?.error && !hasErrors && (
          <div
            role="alert"
            className="rounded-md bg-destructive/10 border border-destructive p-3 mb-4 text-sm text-destructive"
          >
            {state.error}
          </div>
        )}

        <form ref={formRef} action={formAction} className="space-y-6">
          {/* Hidden ID field for updates */}
          {isEditMode && category?.id && (
            <input type="hidden" name="id" value={category.id} />
          )}

          <CategoryFields
            nameError={state?.errors?.['name']?.[0]}
            defaultName={category?.name || ''}
          />

          <CategoryParentSelector
            availableParents={availableParents}
            defaultValue={category?.['parent_id']}
            parentError={state?.errors?.['parentId']?.[0]}
            isPending={isPending}
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
