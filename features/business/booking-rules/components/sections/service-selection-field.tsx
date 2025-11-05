'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ServiceSelectionFieldProps {
  services: Array<{ id: string; name: string }>
  defaultValue?: string
  isEditMode: boolean
  isPending: boolean
  errors?: string[]
}

export function ServiceSelectionField({
  services,
  defaultValue = '',
  isEditMode,
  isPending,
  errors,
}: ServiceSelectionFieldProps) {
  return (
    <div>
      <Label htmlFor="serviceId">
        Service
        <span className="text-destructive" aria-label="required"> *</span>
      </Label>
      <Select
        name="serviceId"
        defaultValue={defaultValue}
        disabled={isEditMode || isPending}
        required
      >
        <SelectTrigger
          id="serviceId"
          aria-required="true"
          aria-invalid={!!errors}
          aria-describedby={errors ? 'serviceId-error serviceId-hint' : 'serviceId-hint'}
        >
          <SelectValue placeholder="Select a service" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p id="serviceId-hint" className="text-sm text-muted-foreground mt-1">
        {isEditMode
          ? 'Service cannot be changed for existing rules'
          : 'Choose the service for this booking rule'}
      </p>
      {errors && (
        <p id="serviceId-error" className="text-sm text-destructive mt-1" role="alert">
          {errors[0]}
        </p>
      )}
    </div>
  )
}
