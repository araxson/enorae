'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ServicesGrid } from './services-grid'
import { ServiceFormDialog } from './service-form-dialog'
import { SearchInput } from '@/features/shared/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Service, ServicesManagementClientProps } from '@/features/business/services/api/types'
import { ButtonGroup } from '@/components/ui/button-group'

export function ServicesManagementClient({ salon, services }: ServicesManagementClientProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const handleAddClick = () => {
    setEditingService(null)
    setIsDialogOpen(true)
  }

  const handleEditClick = (service: Service) => {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingService(null)
  }

  const handleSuccess = () => {
    router.refresh()
  }

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Status filter
      if (statusFilter === 'active' && !service['is_active']) return false
      if (statusFilter === 'inactive' && service['is_active']) return false

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const nameMatch = service['name']?.toLowerCase().includes(query)
        const descriptionMatch = service['description']?.toLowerCase().includes(query)
        const categoryMatch = service['category_name']?.toLowerCase().includes(query)

        return nameMatch || descriptionMatch || categoryMatch
      }

      return true
    })
  }, [services, searchQuery, statusFilter])

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 items-start justify-end">
          <ButtonGroup>
            <Button onClick={handleAddClick}>
              <Plus className="mr-2 size-4" />
              Add Service
            </Button>
          </ButtonGroup>
        </div>

        <div>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, description, or category..."
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ServicesGrid
          services={filteredServices}
          onEditService={handleEditClick}
          isFiltered={searchQuery.length > 0 || statusFilter !== 'all'}
        />

        <ServiceFormDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          salonId={salon['id']}
          service={editingService}
          onSuccess={handleSuccess}
        />
      </div>
    </section>
  )
}
