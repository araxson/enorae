'use client'

import { useState } from 'react'
import { Edit2, Trash2, MapPin, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { Stack } from '@/components/layout'
import { Muted, Small } from '@/components/ui/typography'
import { deleteSalonLocation } from '../api/mutations'
import type { Database } from '@/lib/types/database.types'

type SalonLocation = Database['organization']['Tables']['salon_locations']['Row']

type LocationListProps = {
  locations: SalonLocation[]
  onEdit?: (location: SalonLocation) => void
}

export function LocationList({ locations, onEdit }: LocationListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const formData = new FormData()
    formData.append('id', deleteId)

    try {
      const result = await deleteSalonLocation(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Location deleted successfully')
      }
    } catch {
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
          <p className="text-muted-foreground">No salon locations found</p>
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
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {location.name}
                    {location.is_primary && (
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <Stack gap="xs">
                        <Muted>/{location.slug}</Muted>
                        {location.is_active ? (
                          <Small className="text-green-600">Active</Small>
                        ) : (
                          <Muted>Inactive</Muted>
                        )}
                      </Stack>
                    </div>
                  </CardDescription>
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
                {!location.is_primary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(location.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
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
