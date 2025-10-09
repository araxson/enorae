'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { updateAppointmentService } from '../api/appointment-services.mutations'
import type { AppointmentServiceDetails } from '../api/appointment-services.queries'

interface EditServiceDialogProps {
  service: AppointmentServiceDetails
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditServiceDialog({
  service,
  isOpen,
  onClose,
  onSuccess,
}: EditServiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [staff, setStaff] = useState<any[]>([])
  const [formData, setFormData] = useState({
    staffId: service.staff_id || '',
    startTime: service.start_time
      ? new Date(service.start_time).toTimeString().slice(0, 5)
      : '',
    endTime: service.end_time ? new Date(service.end_time).toTimeString().slice(0, 5) : '',
    durationMinutes: service.duration_minutes?.toString() || '',
    status: service.status || 'pending',
  })

  useEffect(() => {
    // Reset form when service changes
    setFormData({
      staffId: service.staff_id || '',
      startTime: service.start_time
        ? new Date(service.start_time).toTimeString().slice(0, 5)
        : '',
      endTime: service.end_time ? new Date(service.end_time).toTimeString().slice(0, 5) : '',
      durationMinutes: service.duration_minutes?.toString() || '',
      status: service.status || 'pending',
    })
  }, [service])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      const data = new FormData()
      data.append('appointmentServiceId', service.id || '')
      if (formData.staffId) data.append('staffId', formData.staffId)
      if (formData.startTime) {
        // Convert time to full datetime
        const startDate = service.start_time
          ? new Date(service.start_time)
          : new Date()
        const [hours, minutes] = formData.startTime.split(':')
        startDate.setHours(parseInt(hours), parseInt(minutes))
        data.append('startTime', startDate.toISOString())
      }
      if (formData.endTime) {
        // Convert time to full datetime
        const endDate = service.end_time ? new Date(service.end_time) : new Date()
        const [hours, minutes] = formData.endTime.split(':')
        endDate.setHours(parseInt(hours), parseInt(minutes))
        data.append('endTime', endDate.toISOString())
      }
      if (formData.durationMinutes)
        data.append('durationMinutes', formData.durationMinutes)
      if (formData.status) data.append('status', formData.status)

      const result = await updateAppointmentService(data)

      if (result.error) {
        alert(result.error)
      } else {
        onSuccess()
      }
    } catch (error) {
      alert('Failed to update service')
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
            >
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any available</SelectItem>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
                {staff.length === 0 && service.staff_name && (
                  <SelectItem value={service.staff_id || ''}>
                    {service.staff_name}
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startTime: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endTime: e.target.value }))
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, durationMinutes: e.target.value }))
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
