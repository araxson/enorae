'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'
import { addServiceToAppointment } from '@/features/business/appointments/api/mutations'
import { useServiceFormOptions } from '../hooks/use-service-form-data'
import { Spinner } from '@/components/ui/spinner'
import { AddServiceFormFields } from './add-service-form-fields'

interface AddServiceDialogProps {
  appointmentId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddServiceDialog({
  appointmentId,
  isOpen,
  onClose,
  onSuccess,
}: AddServiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    serviceId: '',
    staffId: '',
    startTime: '',
    endTime: '',
    durationMinutes: '',
  })
  const { toast } = useToast()
  const { options, isLoading: isLoadingOptions } = useServiceFormOptions(
    appointmentId,
    isOpen
  )

  const resetForm = () => {
    setFormData({
      serviceId: '',
      staffId: '',
      startTime: '',
      endTime: '',
      durationMinutes: '',
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.serviceId) {
      toast({
        variant: 'destructive',
        title: 'Missing service',
        description: 'Please select a service before adding it to the appointment.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('appointmentId', appointmentId)
      data.append('serviceId', formData.serviceId)
      if (formData.staffId) data.append('staffId', formData.staffId)
      if (formData.startTime) data.append('startTime', formData.startTime)
      if (formData.endTime) data.append('endTime', formData.endTime)
      if (formData.durationMinutes) data.append('durationMinutes', formData.durationMinutes)

      try {
        await addServiceToAppointment(data)

        toast({
          title: 'Service added',
          description: 'The service was added to the appointment.',
        })
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to add service',
          description: error instanceof Error ? error.message : 'An error occurred',
        })
        return
      }

      resetForm()
      onSuccess()
    } catch (error) {
      console.error('Failed to add appointment service:', error)
      toast({
        variant: 'destructive',
        title: 'Failed to add service',
        description: 'Please try again in a moment.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Service to Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AddServiceFormFields
            formData={formData}
            onFormDataChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
            services={options.services}
            staff={options.staff}
            isLoading={isLoadingOptions}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingOptions}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Adding
                </>
              ) : (
                'Add Service'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
