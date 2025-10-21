'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MovementList } from './movement-list'
import { CreateMovementDialog } from './create-movement-dialog'
import type { StockMovementWithDetails } from '../api/queries'

interface MovementsClientProps {
  movements: StockMovementWithDetails[]
  products: Array<{ id: string; name: string | null; sku: string | null }>
  locations: Array<{ id: string; name: string | null }>
}

export function MovementsClient({ movements, products, locations }: MovementsClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-start justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Record Movement
        </Button>
      </div>

      <MovementList movements={movements} />

      <CreateMovementDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        products={products}
        locations={locations}
      />
    </div>
  )
}
