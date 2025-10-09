'use client'

import { useState } from 'react'
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
import { addServiceToAppointment } from '../api/appointment-services.mutations'

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
  const [services, setServices] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  const [formData, setFormData] = useState({
    serviceId: '',
    staffId: '',
    startTime: '',
    endTime: '',
    durationMinutes: '',
  })

  // In a real implementation, fetch services and staff from the API
  // For now, this is a placeholder

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.serviceId) {
      alert('Please select a service')
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
      if (formData.durationMinutes)
        data.append('durationMinutes', formData.durationMinutes)

      const result = await addServiceToAppointment(data)

      if (result.error) {
        alert(result.error)
      } else {
        onSuccess()
      }
    } catch (error) {
      alert('Failed to add service')
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
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
                {services.length === 0 && (
                  <SelectItem value="no-services" disabled>
                    No services available
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
              placeholder="e.g., 60"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Service'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
