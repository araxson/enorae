'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { H2, Muted } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { LocationList } from './components/location-list'
import { LocationForm } from './components/location-form'
import type { StockLocationWithCounts } from './dal/stock-locations.queries'

type StockLocationsProps = {
  initialLocations: StockLocationWithCounts[]
}

export function StockLocations({ initialLocations }: StockLocationsProps) {
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
      <div className="flex items-center justify-between">
        <div>
          <H2>Stock Locations</H2>
          <Muted className="mt-1">
            Organize inventory across different storage locations
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
