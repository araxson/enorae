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
import { updateAppointmentService } from '../api/mutations'
import type { AppointmentServiceDetails } from '../api/queries/appointment-services'

interface EditServiceDialogProps {
  service: AppointmentServiceDetails
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type StaffOption = {
  id: string
  name: string
}

export function EditServiceDialog({
  service,
  isOpen,
  onClose,
  onSuccess,
}: EditServiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingStaff, setIsLoadingStaff] = useState(false)
  const [staff, setStaff] = useState<StaffOption[]>([])
  const [formData, setFormData] = useState({
    staffId: service.staff_id || '',
    startTime: service.start_time
      ? new Date(service.start_time).toTimeString().slice(0, 5)
      : '',
    endTime: service.end_time ? new Date(service.end_time).toTimeString().slice(0, 5) : '',
    durationMinutes: service.duration_minutes?.toString() || '',
    status: service.status || 'pending',
  })
  const { toast } = useToast()

  useEffect(() => {
    setFormData({
      staffId: service.staff_id || '',
      startTime: service.start_time ? new Date(service.start_time).toTimeString().slice(0, 5) : '',
      endTime: service.end_time ? new Date(service.end_time).toTimeString().slice(0, 5) : '',
      durationMinutes: service.duration_minutes?.toString() || '',
      status: service.status || 'pending',
    })
  }, [service])

  useEffect(() => {
    if (!isOpen || !service.appointment_id) {
      return
    }

    let isMounted = true

    const loadStaff = async () => {
      setIsLoadingStaff(true)
      try {
        const response = await fetch(
          `/api/business/appointments/${service.appointment_id}/service-options`
        )

        if (!response.ok) {
          throw new Error(`Failed to load staff options (${response.status})`)
        }

        const data: { staff?: StaffOption[] } = await response.json()
        if (!isMounted) return

        setStaff(data.staff ?? [])
      } catch (error) {
        console.error('Failed to load staff options:', error)
        if (isMounted) {
          toast({
            variant: 'destructive',
            title: 'Unable to load staff',
            description:
              error instanceof Error ? error.message : 'Please try again shortly.',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoadingStaff(false)
        }
      }
    }

    void loadStaff()

    return () => {
      isMounted = false
    }
  }, [isOpen, service.appointment_id, toast])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('appointmentServiceId', service.id || '')
      if (formData.staffId) data.append('staffId', formData.staffId)

      if (formData.startTime) {
        const startDate = service.start_time ? new Date(service.start_time) : new Date()
        const [hours, minutes] = formData.startTime.split(':')
        startDate.setHours(Number(hours), Number(minutes), 0, 0)
        data.append('startTime', startDate.toISOString())
      }

      if (formData.endTime) {
        const endDate = service.end_time ? new Date(service.end_time) : new Date()
        const [hours, minutes] = formData.endTime.split(':')
        endDate.setHours(Number(hours), Number(minutes), 0, 0)
        data.append('endTime', endDate.toISOString())
      }

      if (formData.durationMinutes) {
        data.append('durationMinutes', formData.durationMinutes)
      }

      if (formData.status) {
        data.append('status', formData.status)
      }

      const result = await updateAppointmentService(data)

      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Unable to update service',
          description: result.error,
        })
        return
      }

      toast({
        title: 'Service updated',
        description: 'Appointment service changes were saved.',
      })

      onSuccess()
    } catch (error) {
      console.error('Failed to update appointment service:', error)
      toast({
        variant: 'destructive',
        title: 'Failed to update service',
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
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Service</Label>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{service.service_name}</p>
              {service.category_name && (
                <p className="text-sm text-muted-foreground">{service.category_name}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff">Staff</Label>
            <Select
              value={formData.staffId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, staffId: value }))
              }
              disabled={isLoadingStaff}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingStaff ? 'Loading staff...' : 'Select staff member'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any available</SelectItem>
                {staff.length > 0 ? (
                  staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))
                ) : service.staff_name ? (
                  <SelectItem value={service.staff_id || ''}>
                    {service.staff_name}
                  </SelectItem>
                ) : (
                  <SelectItem value="no-staff" disabled>
                    {isLoadingStaff ? 'Loading staff...' : 'No staff available'}
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
