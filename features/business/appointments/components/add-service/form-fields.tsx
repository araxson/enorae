'use client'

import { useCallback } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import type { ServiceOption, StaffOption, ServiceFormData } from '../../api/types'

interface FormFieldsProps {
  formData: ServiceFormData
  setFormData: React.Dispatch<React.SetStateAction<ServiceFormData>>
  isLoadingOptions: boolean
  services: ServiceOption[]
  staff: StaffOption[]
}

export function FormFields({
  formData,
  setFormData,
  isLoadingOptions,
  services,
  staff,
}: FormFieldsProps) {
  const handleServiceChange = useCallback((value: string) => {
    setFormData((prev: ServiceFormData) => ({ ...prev, serviceId: value }))
  }, [setFormData])

  const handleStaffChange = useCallback((value: string) => {
    setFormData((prev: ServiceFormData) => ({ ...prev, staffId: value }))
  }, [setFormData])

  const handleStartTimeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: ServiceFormData) => ({ ...prev, startTime: event.target.value }))
  }, [setFormData])

  const handleEndTimeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: ServiceFormData) => ({ ...prev, endTime: event.target.value }))
  }, [setFormData])

  const handleDurationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: ServiceFormData) => ({ ...prev, durationMinutes: event.target.value }))
  }, [setFormData])

  return (
    <FieldSet className="space-y-4">
      <Field>
        <FieldLabel htmlFor="service">Service *</FieldLabel>
        <FieldContent>
          <Select
            value={formData.serviceId}
            onValueChange={handleServiceChange}
            disabled={isLoadingOptions}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingOptions ? 'Loading services...' : 'Select a service'} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
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
              </SelectGroup>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="staff">Staff (Optional)</FieldLabel>
        <FieldContent>
          <Select
            value={formData.staffId}
            onValueChange={handleStaffChange}
            disabled={isLoadingOptions}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingOptions ? 'Loading staff...' : 'Select staff member'} />
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
                ) : (
                  <SelectItem value="no-staff" disabled>
                    {isLoadingOptions ? 'Loading staff...' : 'No staff available'}
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
              onChange={handleStartTimeChange}
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
              onChange={handleEndTimeChange}
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
            onChange={handleDurationChange}
            placeholder="e.g., 60"
          />
        </FieldContent>
      </Field>
    </FieldSet>
  )
}
