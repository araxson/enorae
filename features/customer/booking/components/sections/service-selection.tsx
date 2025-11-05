'use client'

import { RefObject } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'

interface ServiceSelectionProps {
  services: Array<{
    id: string
    name: string
    price: number
    duration_minutes: number
  }>
  isPending: boolean
  errors?: string[]
  firstErrorRef?: RefObject<HTMLSelectElement>
}

export function ServiceSelection({
  services,
  isPending,
  errors,
  firstErrorRef,
}: ServiceSelectionProps) {
  return (
    <Field>
      <FieldLabel htmlFor="serviceId">
        Service
        <span className="text-destructive" aria-label="required"> *</span>
      </FieldLabel>
      <select
        ref={errors ? firstErrorRef : null}
        id="serviceId"
        name="serviceId"
        required
        aria-required="true"
        aria-invalid={!!errors}
        aria-describedby={errors ? 'serviceId-error' : undefined}
        disabled={isPending}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Select a service...</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name} - ${service.price} ({service.duration_minutes}min)
          </option>
        ))}
      </select>
      {errors && (
        <p id="serviceId-error" className="text-sm text-destructive mt-1" role="alert">
          {errors[0]}
        </p>
      )}
    </Field>
  )
}
