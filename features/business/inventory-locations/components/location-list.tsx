'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Edit2, Trash2, MapPin, Star } from 'lucide-react'
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
import { deleteStockLocation } from '../api/mutations'
import type { StockLocationWithCounts } from '../api/queries'

type LocationListProps = {
  locations: StockLocationWithCounts[]
  onEdit?: (location: StockLocationWithCounts) => void
}

export function LocationList({ locations, onEdit }: LocationListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const formData = new FormData()
    formData.append('id', deleteId)

    try {
      const result = await deleteStockLocation(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Location deleted')
        router.refresh()
      }
    } catch (error) {
      console.error('[LocationList] delete error:', error)
      toast.error('Failed to delete location')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (locations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No stock locations found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle>{location.name}</CardTitle>
                    {location.is_default && (
                      <Star className="h-4 w-4 text-warning" fill="currentColor" />
                    )}
                  </div>
                  {location.description && (
                    <CardDescription>{location.description}</CardDescription>
                  )}
                  <div>
                    <Badge variant="outline">
                      {location.product_count || 0} items
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(location)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(location.id)}
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
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this location? This action cannot be undone.
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
