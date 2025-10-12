'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, Stack, Flex, Box, Group } from '@/components/layout'
import { ServicesGrid } from './services-grid'
import { ServiceFormDialog } from './service-form-dialog'
import { SearchInput } from '@/components/shared/search-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Service, ServicesManagementClientProps } from '../types'

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
      if (statusFilter === 'active' && !service.is_active) return false
      if (statusFilter === 'inactive' && service.is_active) return false

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const nameMatch = service.name?.toLowerCase().includes(query)
        const descriptionMatch = service.description?.toLowerCase().includes(query)
        const categoryMatch = service.category_name?.toLowerCase().includes(query)

        return nameMatch || descriptionMatch || categoryMatch
      }

      return true
    })
  }, [services, searchQuery, statusFilter])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Flex justify="end" align="start">
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </Flex>

        <Box>
          <Group gap="md" className="flex-col sm:flex-row">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, description, or category..."
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </Group>
        </Box>

        <ServicesGrid
          services={filteredServices}
          onEditService={handleEditClick}
          isFiltered={searchQuery.length > 0 || statusFilter !== 'all'}
        />

        <ServiceFormDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          salonId={salon.id}
          service={editingService}
          onSuccess={handleSuccess}
        />
      </Stack>
    </Section>
  )
}
