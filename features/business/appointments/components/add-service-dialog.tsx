'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { addServiceToAppointment } from '../api/mutations'

interface AddServiceDialogProps {
  appointmentId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type ServiceOption = {
  id: string
  name: string
}

type StaffOption = {
  id: string
  name: string
}

export function AddServiceDialog({
  appointmentId,
  isOpen,
  onClose,
  onSuccess,
}: AddServiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [services, setServices] = useState<ServiceOption[]>([])
  const [staff, setStaff] = useState<StaffOption[]>([])
  const [formData, setFormData] = useState({
    serviceId: '',
    staffId: '',
    startTime: '',
    endTime: '',
    durationMinutes: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    if (!isOpen || !appointmentId) {
      return
    }

    let isMounted = true

    const loadOptions = async () => {
      setIsLoadingOptions(true)
      try {
        const response = await fetch(
          `/api/business/appointments/${appointmentId}/service-options`
        )

        if (!response.ok) {
          throw new Error(`Failed to load options (${response.status})`)
        }

        const data: { services?: ServiceOption[]; staff?: StaffOption[] } =
          await response.json()

        if (!isMounted) return

        setServices(data.services ?? [])
        setStaff(data.staff ?? [])
      } catch (error) {
        console.error('Failed to load appointment service options:', error)
        if (isMounted) {
          toast({
            variant: 'destructive',
            title: 'Unable to load service options',
            description:
              error instanceof Error
                ? error.message
                : 'Please try again in a moment.',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoadingOptions(false)
        }
      }
    }

    void loadOptions()

    return () => {
      isMounted = false
    }
  }, [appointmentId, isOpen, toast])

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

      const result = await addServiceToAppointment(data)

      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Unable to add service',
          description: result.error,
        })
        return
      }

      toast({
        title: 'Service added',
        description: 'The service was added to the appointment.',
      })

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
          <div className="space-y-2">
            <Label htmlFor="service">Service *</Label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, serviceId: value }))
              }
              disabled={isLoadingOptions}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingOptions ? 'Loading services...' : 'Select a service'} />
              </SelectTrigger>
              <SelectContent>
                {services.length > 0 ? (
                  services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-services" disabled>
                    {isLoadingOptions ? 'Loading services...' : 'No services available'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff">Staff (Optional)</Label>
            <Select
              value={formData.staffId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, staffId: value }))
              }
              disabled={isLoadingOptions}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingOptions ? 'Loading staff...' : 'Select staff member'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any available</SelectItem>
                {staff.length > 0 ? (
                  staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-staff" disabled>
                    {isLoadingOptions ? 'Loading staff...' : 'No staff available'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, startTime: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, endTime: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.durationMinutes}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, durationMinutes: event.target.value }))
              }
              placeholder="e.g., 60"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingOptions}>
              {isSubmitting ? 'Adding...' : 'Add Service'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
