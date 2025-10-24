'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries/appointment-services'
import type { StaffOption, ServiceFormData } from './types'

interface FormFieldsProps {
  service: AppointmentServiceDetails
  formData: ServiceFormData
  setFormData: React.Dispatch<React.SetStateAction<ServiceFormData>>
  isLoadingStaff: boolean
  staff: StaffOption[]
}

export function FormFields({ service, formData, setFormData, isLoadingStaff, staff }: FormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Service</Label>
        <div className="p-3 bg-muted rounded-md">
          <p className="text-base font-medium">{service.service_name}</p>
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
            <SelectGroup>
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
            </SelectGroup>
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
            <SelectGroup>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
