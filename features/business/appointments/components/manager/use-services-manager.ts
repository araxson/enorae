import { useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import { removeServiceFromAppointment } from '@/features/business/appointments/api/mutations'
import type { AppointmentServiceDetails } from './types'

export function useServicesManager(onUpdate: () => void) {
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
      formData.append('appointmentServiceId', deletingService.id || '')

      const result = await removeServiceFromAppointment(formData)

      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Unable to remove service',
          description: result.error,
        })
      } else {
        toast({
          title: 'Service removed',
          description: `${deletingService.service_name ?? 'Service'} was removed from the appointment.`,
        })
        onUpdate()
        setDeletingService(null)
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

  return {
    showAddDialog,
    setShowAddDialog,
    editingService,
    setEditingService,
    deletingService,
    setDeletingService,
    isDeleting,
    handleDelete,
  }
}
