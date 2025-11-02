'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { useToast } from '@/lib/hooks/use-toast'

import { ConfirmDialog } from '@/features/shared/ui-components'
import { removeServiceFromAppointment } from '@/features/business/appointments/api/mutations'
import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries/appointment-services'
import { AddServiceDialog } from './add-service-dialog'
import { EditServiceDialog } from './edit-service-dialog'
import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { ServicesTable } from './services-table'
import { ServicesSummary } from './services-summary'

interface AppointmentServicesManagerProps {
  appointmentId: string
  services: AppointmentServiceDetails[]
  onUpdate: () => void
  isLoading: boolean
}

export function AppointmentServicesManager({
  appointmentId,
  services,
  onUpdate,
  isLoading,
}: AppointmentServicesManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingService, setEditingService] = useState<AppointmentServiceDetails | null>(null)
  const [deletingService, setDeletingService] = useState<AppointmentServiceDetails | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deletingService) return

    setIsDeleting(true)
    try {
      const formData = new FormData()
      formData.append('appointmentServiceId', deletingService['id'] || '')

      try {
        await removeServiceFromAppointment(formData)

        toast({
          title: 'Service removed',
          description: 'Service was removed from the appointment.',
        })
        onUpdate()
        setDeletingService(null)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to remove service',
          description: error instanceof Error ? error.message : 'An error occurred',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to remove service',
        description: 'Please try again in a moment.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item className="items-center justify-between gap-3">
              <ItemContent>
                <ItemTitle>Services</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ButtonGroup aria-label="Service actions">
                  <Button onClick={() => setShowAddDialog(true)} size="sm">
                    <Plus className="size-4 mr-2" />
                    Add Service
                  </Button>
                </ButtonGroup>
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Spinner className="size-6" />
                </EmptyMedia>
                <EmptyTitle>Loading services</EmptyTitle>
                <EmptyDescription>Fetching appointment service details…</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : services.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No services added</EmptyTitle>
                <EmptyDescription>Add services to this appointment to track work.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <ServicesTable
                services={services}
                onEdit={setEditingService}
                onDelete={setDeletingService}
              />
              <ServicesSummary services={services} />
            </>
          )}
        </CardContent>
      </Card>

      <AddServiceDialog
        appointmentId={appointmentId}
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={() => {
          setShowAddDialog(false)
          onUpdate()
        }}
      />

      {editingService && (
        <EditServiceDialog
          service={editingService}
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          onSuccess={() => {
            setEditingService(null)
            onUpdate()
          }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingService}
        onClose={() => setDeletingService(null)}
        onConfirm={handleDelete}
        title="Remove Service"
        description="Are you sure you want to remove this service from the appointment?"
        isLoading={isDeleting}
      />
    </>
  )
}
