'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LocationList } from './location-list'
import { LocationForm } from './location-form'
import type { SalonLocation } from '@/features/business/locations'

type SalonLocationsClientProps = {
  initialLocations: SalonLocation[]
}

export function SalonLocationsClient({ initialLocations }: SalonLocationsClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<SalonLocation | null>(null)

  const handleEdit = (location: SalonLocation) => {
    setEditingLocation(location)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingLocation(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="size-4 mr-2" />
          Add Location
        </Button>
      </div>

      <LocationList locations={initialLocations} onEdit={handleEdit} />

      <LocationForm
        location={editingLocation}
        open={isFormOpen}
        onOpenChange={handleCloseForm}
      />
    </div>
  )
}
