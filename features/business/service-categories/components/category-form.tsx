'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

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

          <FieldSet>
            <FieldGroup className="grid gap-4 py-4">
              {category ? <input type="hidden" name="id" value={category['id'] || ''} /> : null}

              <Field>
                <FieldLabel htmlFor="name">Name *</FieldLabel>
                <FieldContent>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={category?.['name'] || ''}
                    required
                    maxLength={100}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="parentId">Parent Category</FieldLabel>
                <FieldContent>
                  <Select value={parentId || 'none'} onValueChange={(v) => setParentId(v === 'none' ? '' : v)}>
                    <SelectTrigger id="parentId">
                      <SelectValue placeholder="None (Top Level)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {availableParents.map((cat) => (
                        <SelectItem key={cat['id']} value={cat['id'] || ''}>
                          {cat['parent_id'] ? `↳ ${cat['name']}` : cat['name']}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Optional: Create a subcategory under an existing category
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>

            {/* TODO: Add description field to database schema */}
            {/* <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={category?.['description'] || ''}
                maxLength={500}
                rows={3}
              />
            </div> */}

            {/* TODO: Add icon_name field to database schema */}
            {/* <div className="grid gap-2">
              <Label htmlFor="iconName">Icon (emoji)</Label>
              <Input
                id="iconName"
                name="iconName"
                defaultValue={category?.icon_name || ''}
                maxLength={50}
                placeholder="✂️"
              />
              <p className="text-sm text-muted-foreground">
                Optional emoji to display with the category
              </p>
            </div> */}

            {/* TODO: Add display_order field to database schema */}
            {/* <div className="grid gap-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                min="0"
                defaultValue={category?.display_order || 0}
              />
              <p className="text-sm text-muted-foreground">
                Lower numbers appear first in lists
              </p>
            </div> */}
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
