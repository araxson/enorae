'use client'

import { useState } from 'react'
import { Edit2, Trash2, Scissors } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { deleteServiceCategory } from '../actions/service-categories.actions'
import type { ServiceCategoryWithCounts } from '../dal/service-categories.queries'

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
        alert(result.error)
      }
    } catch (error) {
      alert('Failed to delete category')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Scissors className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No service categories found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {/* TODO: Add icon_name field to database schema */}
                    {/* {category.icon_name && (
                      <span className="text-xl">{category.icon_name}</span>
                    )} */}
                    {category.name}
                  </CardTitle>
                  {/* TODO: Add description field to database schema */}
                  {/* {category.description && (
                    <CardDescription className="mt-1">
                      {category.description}
                    </CardDescription>
                  )} */}
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
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(category.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
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
