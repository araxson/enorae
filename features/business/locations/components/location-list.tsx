'use client'

import { useState } from 'react'
import { Edit2, Trash2, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { deleteSalonLocation } from '@/features/business/locations/api/mutations/location'
import type { SalonLocation } from '@/features/business/locations'

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
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPin className="h-8 w-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No salon locations found</EmptyTitle>
          <EmptyDescription>Add your first location to manage scheduling and staff.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Launch the location wizard to configure hours, services, and teams.</EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Item key={location['id']} variant="outline" className="flex flex-col items-start gap-4">
            <ItemHeader>
              <ItemTitle>{location['name']}</ItemTitle>
              {location['is_primary'] ? (
                <Badge variant="secondary">Primary</Badge>
              ) : null}
            </ItemHeader>
            <ItemContent>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col gap-2">
                  <ItemDescription>/{location['slug']}</ItemDescription>
                  <span className={location['is_active'] ? 'font-medium text-primary' : ''}>
                    {location['is_active'] ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </ItemContent>
            <ItemActions>
              <ButtonGroup>
                {onEdit ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(location)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : null}
                {!location['is_primary'] ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(location['id'])}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                ) : null}
              </ButtonGroup>
            </ItemActions>
          </Item>
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
