'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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
import { createProductCategory, updateProductCategory } from '../api/mutations'
import type { ProductCategoryWithCounts } from '../api/queries'

type CategoryFormProps = {
  category?: ProductCategoryWithCounts | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryForm({ category, open, onOpenChange }: CategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = category
        ? await updateProductCategory(formData)
        : await createProductCategory(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(category ? 'Category updated' : 'Category created')
        router.refresh()
        onOpenChange(false)
      }
    } catch (error) {
      console.error('[CategoryForm] submit error:', error)
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
                ? 'Update the product category details'
                : 'Add a new product category to organize your inventory'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-col gap-4">
              {category?.id && (
                <input type="hidden" name="id" value={category.id} />
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={category?.name || ''}
                  required
                  maxLength={100}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={category?.description || ''}
                  maxLength={500}
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  min="0"
                  defaultValue={category?.display_order || 0}
                />
                <small className="text-sm font-medium text-muted-foreground">
                  Lower numbers appear first in lists
                </small>
              </div>
            </div>
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
