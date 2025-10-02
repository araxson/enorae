'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createServiceCategory, updateServiceCategory } from '../actions/service-categories.actions'
import type { ServiceCategoryWithCounts } from '../dal/service-categories.queries'

type CategoryFormProps = {
  category?: ServiceCategoryWithCounts | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryForm({ category, open, onOpenChange }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = category
        ? await updateServiceCategory(formData)
        : await createServiceCategory(formData)

      if (result.error) {
        alert(result.error)
      } else {
        onOpenChange(false)
      }
    } catch (error) {
      alert('Failed to save category')
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
              <input type="hidden" name="id" value={category.id} />
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={category?.name}
                required
                maxLength={100}
              />
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
