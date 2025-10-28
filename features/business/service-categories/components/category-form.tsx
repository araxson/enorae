'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createServiceCategory, updateServiceCategory } from '@/features/business/service-categories/api/mutations'
import type { ServiceCategoryWithCounts } from '@/features/business/service-categories/api/queries'
import { ButtonGroup } from '@/components/ui/button-group'
import { CategoryFormFields } from './category-form-fields'

type CategoryFormProps = {
  category?: ServiceCategoryWithCounts | null
  categories: ServiceCategoryWithCounts[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryForm({ category, categories, open, onOpenChange }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentId, setParentId] = useState<string>(category?.['parent_id'] || '')

  // Filter out current category and its descendants to prevent circular references
  const availableParents = categories.filter((c) => {
    if (!category) return true // Creating new, all categories available
    if (c['id'] === category['id']) return false // Can't be own parent
    // TODO: Also filter out descendants when path field is available
    return true
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    // Add parentId to formData
    if (parentId) {
      formData.set('parentId', parentId)
    }

    try {
      const result = category
        ? await updateServiceCategory(formData)
        : await createServiceCategory(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(category ? 'Category updated' : 'Category created')
        onOpenChange(false)
      }
    } catch {
      toast.error('Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
          <DialogHeader>
            <DialogTitle>
              {category ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogDescription>
              {category
                ? 'Update the service category details'
                : 'Add a new service category to organize your services'}
            </DialogDescription>
          </DialogHeader>

          <CategoryFormFields
            category={category}
            availableParents={availableParents}
            parentId={parentId}
            onParentIdChange={setParentId}
          />
          </div>

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
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{category ? 'Update' : 'Create'}</span>
                )}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
