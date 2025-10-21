'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Edit2, Trash2, Package } from 'lucide-react'
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
import { deleteProductCategory } from '../api/mutations'
import type { ProductCategoryWithCounts } from '../api/queries'

type CategoryListProps = {
  categories: ProductCategoryWithCounts[]
  onEdit?: (category: ProductCategoryWithCounts) => void
}

export function CategoryList({ categories, onEdit }: CategoryListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const formData = new FormData()
    formData.append('id', deleteId)

    try {
      const result = await deleteProductCategory(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Category deleted')
        router.refresh()
      }
    } catch (error) {
      console.error('[CategoryList] delete error:', error)
      toast.error('Failed to delete category')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="py-10">
            <div className="flex flex-col gap-4 items-center text-center">
              <Package className="h-12 w-12 text-muted-foreground" />
              <p className="leading-7 text-muted-foreground">No product categories found</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex gap-4 items-start justify-between">
                <div className="flex-1 space-y-2">
                  <CardTitle>{category.name}</CardTitle>
                  {category.description && (
                    <CardDescription>{category.description}</CardDescription>
                  )}
                </div>
                <Badge variant="secondary">
                  {category.product_count || 0} products
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-center">
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
