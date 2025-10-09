'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
import { createServiceCategory, updateServiceCategory } from '../api/mutations'
import type { ServiceCategoryWithCounts } from '../api/queries'

type CategoryFormProps = {
  category?: ServiceCategoryWithCounts | null
  categories: ServiceCategoryWithCounts[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryForm({ category, categories, open, onOpenChange }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentId, setParentId] = useState<string>(category?.parent_id || '')

  // Filter out current category and its descendants to prevent circular references
  const availableParents = categories.filter((c) => {
    if (!category) return true // Creating new, all categories available
    if (c.id === category.id) return false // Can't be own parent
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

          <div className="grid gap-4 py-4">
            {category && (
              <input type="hidden" name="id" value={category.id || ''} />
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={category?.name || ''}
                required
                maxLength={100}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parentId">Parent Category</Label>
              <Select value={parentId || 'none'} onValueChange={(v) => setParentId(v === 'none' ? '' : v)}>
                <SelectTrigger id="parentId">
                  <SelectValue placeholder="None (Top Level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {availableParents.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id || ''}>
                      {cat.parent_id ? `↳ ${cat.name}` : cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Optional: Create a subcategory under an existing category
              </p>
            </div>

            {/* TODO: Add description field to database schema */}
            {/* <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={category?.description || ''}
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : category ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
