'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { H2, Muted } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { LocationList } from './components/location-list'
import { LocationForm } from './components/location-form'
import type { Database } from '@/lib/types/database.types'

type SalonLocation = Database['organization']['Tables']['salon_locations']['Row']

type SalonLocationsProps = {
  initialLocations: SalonLocation[]
}

export function SalonLocations({ initialLocations }: SalonLocationsProps) {
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
      <div className="flex items-center justify-between">
        <div>
          <H2>Salon Locations</H2>
          <Muted className="mt-1">
            Manage multiple salon locations and addresses
          </Muted>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
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
