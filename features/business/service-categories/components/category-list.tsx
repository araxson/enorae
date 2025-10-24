'use client'

import { useState } from 'react'
import { Edit2, Trash2, Scissors } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteServiceCategory } from '@/features/business/service-categories/api/mutations'
import type { ServiceCategoryWithCounts } from '@/features/business/service-categories/api/queries'

type CategoryListProps = {
  categories: ServiceCategoryWithCounts[]
  onEdit?: (category: ServiceCategoryWithCounts) => void
}

export function CategoryList({ categories, onEdit }: CategoryListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const formData = new FormData()
    formData.append('id', deleteId)

    try {
      const result = await deleteServiceCategory(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Category deleted successfully')
      }
    } catch {
      toast.error('Failed to delete category')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <CardTitle>No service categories found</CardTitle>
          <CardDescription>Create a category to organize your services.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Scissors className="h-12 w-12 text-muted-foreground mb-4" />
        </CardContent>
      </Card>
    )
  }

  // Organize categories hierarchically
  const topLevelCategories = categories.filter((c) => !c.parent_id)
  const subcategories = categories.filter((c) => c.parent_id)

  const renderCategory = (category: ServiceCategoryWithCounts, isSubcategory = false) => (
    <div
      key={category.id}
      className={isSubcategory ? 'ml-8 border-l-4 border-l-primary/30 pl-4' : ''}
    >
      <Card>
        <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-center gap-2">
                {isSubcategory && <span className="text-muted-foreground">↳</span>}
                <CardTitle>{category.name}</CardTitle>
              </div>
              <Badge variant="secondary">
                {category.service_count || 0} services
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(category)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteId(category.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topLevelCategories.map((category) => (
          <div key={category.id} className="space-y-4">
            {renderCategory(category)}
            {subcategories
              .filter((sub) => sub.parent_id === category.id)
              .map((sub) => renderCategory(sub, true))}
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
