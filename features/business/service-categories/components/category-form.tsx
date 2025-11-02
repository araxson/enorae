'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Form } from '@/components/ui/form'
import { categorySchema, type CategorySchema } from '@/features/business/service-categories/api/schema'
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
  const isEditMode = Boolean(category)

  // Filter out current category and its descendants to prevent circular references
  const availableParents = categories.filter((c) => {
    if (!category) return true // Creating new, all categories available
    if (c['id'] === category['id']) return false // Can't be own parent
    return true
  })

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      parentId: category?.['parent_id'] || null,
    },
  })

  const handleSubmit = async (values: CategorySchema) => {
    try {
      const formData = new FormData()
      formData.set('name', values.name)
      if (values.parentId) formData.set('parentId', values.parentId)

      if (isEditMode && category?.id) {
        formData.set('id', category.id)
      }

      const result = isEditMode
        ? await updateServiceCategory(formData)
        : await createServiceCategory(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(isEditMode ? 'Category updated' : 'Category created')
        onOpenChange(false)
        form.reset()
      }
    } catch {
      toast.error('Failed to save category')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? 'Edit Category' : 'Create Category'}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? 'Update the service category details'
                    : 'Add a new service category to organize your services'}
                </DialogDescription>
              </DialogHeader>

              <CategoryFormFields
                form={form}
                availableParents={availableParents}
              />
            </div>

            <DialogFooter>
              <ButtonGroup>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Spinner className="size-4" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{isEditMode ? 'Update' : 'Create'}</span>
                  )}
                </Button>
              </ButtonGroup>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
