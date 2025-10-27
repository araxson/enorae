'use client'

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

import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

export function FormFields({ service, formData, setFormData, isLoadingStaff, staff }: FormFieldsProps) {
  return (
    <FieldSet className="space-y-4">
      <Alert>
        <AlertDescription>
          Service ID: <span className="font-medium">{service['service_id']}</span>
        </AlertDescription>
      </Alert>

      <Field>
        <FieldLabel htmlFor="staff">Staff</FieldLabel>
        <FieldContent>
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
                    <SelectItem key={member['id']} value={member['id']}>
                      {member['name']}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-staff" disabled>
                    {isLoadingStaff ? 'Loading staff...' : 'No staff available'}
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <FieldGroup className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
          <FieldContent>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, startTime: event.target.value }))
              }
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="endTime">End Time</FieldLabel>
          <FieldContent>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, endTime: event.target.value }))
              }
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
        <FieldContent>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.durationMinutes}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, durationMinutes: event.target.value }))
            }
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="status">Status</FieldLabel>
        <FieldContent>
          <Select
            value={formData['status']}
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
        </FieldContent>
      </Field>
    </FieldSet>
  )
}
