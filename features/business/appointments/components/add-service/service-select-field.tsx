'use client'

import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ServiceOption } from '@/features/business/appointments/api/queries/service-options'

type ServiceSelectFieldProps = {
  value: string
  onChange: (value: string) => void
  services: ServiceOption[]
}

export function ServiceSelectField({ value, onChange, services }: ServiceSelectFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="service">Service *</FieldLabel>
      <FieldContent>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a service" />
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
                No services available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </FieldContent>
    </Field>
  )
}
