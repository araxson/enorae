'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import {
  StaffSelector,
  TimeRangeFields,
  DurationField,
} from './shared/service-form-fields'

interface AddServiceFormFieldsProps {
  formData: {
    serviceId: string
    staffId: string
    startTime: string
    endTime: string
    durationMinutes: string
  }
  onFormDataChange: (data: Partial<AddServiceFormFieldsProps['formData']>) => void
  services: Array<{ id: string; name: string }>
  staff: Array<{ id: string; name: string }>
  isLoading: boolean
}

export function AddServiceFormFields({
  formData,
  onFormDataChange,
  services,
  staff,
  isLoading,
}: AddServiceFormFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="service">Service *</FieldLabel>
        <FieldContent>
          <Select
            value={formData.serviceId}
            onValueChange={(value) => onFormDataChange({ serviceId: value })}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isLoading ? 'Loading services...' : 'Select a service'
                }
              />
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
                  {isLoading ? 'Loading services...' : 'No services available'}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <StaffSelector
        value={formData.staffId}
        onChange={(value) => onFormDataChange({ staffId: value })}
        staff={staff}
        isLoading={isLoading}
      />

      <TimeRangeFields
        startTime={formData.startTime}
        endTime={formData.endTime}
        onStartChange={(value) => onFormDataChange({ startTime: value })}
        onEndChange={(value) => onFormDataChange({ endTime: value })}
      />

      <DurationField
        value={formData.durationMinutes}
        onChange={(value) => onFormDataChange({ durationMinutes: value })}
      />
    </>
  )
}
