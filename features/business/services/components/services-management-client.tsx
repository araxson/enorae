'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, Stack, Flex } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { ServicesGrid } from './services-grid'
import { ServiceFormDialog } from './service-form-dialog'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services']['Row']

interface ServicesManagementClientProps {
  salon: { id: string }
  services: Service[]
}

export function ServicesManagementClient({ salon, services }: ServicesManagementClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

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
    // Dialog will close and page will revalidate automatically via server action
    window.location.reload()
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Flex justify="between" align="start">
          <div>
            <H1>Services</H1>
            <Lead>Manage your salon services and pricing</Lead>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </Flex>

        <ServicesGrid services={services} onEditService={handleEditClick} />

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
