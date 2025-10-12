'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LocationList } from './location-list'
import { LocationForm } from './location-form'
import type { StockLocationWithCounts } from '../api/queries'

type StockLocationsClientProps = {
  initialLocations: StockLocationWithCounts[]
}

export function StockLocationsClient({ initialLocations }: StockLocationsClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<StockLocationWithCounts | null>(null)

  const handleEdit = (location: StockLocationWithCounts) => {
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
