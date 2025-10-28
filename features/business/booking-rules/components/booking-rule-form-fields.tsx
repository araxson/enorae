'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import type { BookingRuleWithService } from '@/features/business/booking-rules/api/queries'

type ServiceSelectorFieldProps = {
  selectedServiceId: string
  onServiceChange: (value: string) => void
  services: Array<{ id: string; name: string }>
  rule?: BookingRuleWithService | null
}

export function ServiceSelectorField({
  selectedServiceId,
  onServiceChange,
  services,
  rule,
}: ServiceSelectorFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="serviceId">Service</FieldLabel>
      <FieldContent>
        <Select
          value={selectedServiceId}
          onValueChange={onServiceChange}
          disabled={!!rule}
        >
          <SelectTrigger id="serviceId">
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
        {rule ? (
          <FieldDescription>
            Service cannot be changed. Create a new rule for different services.
          </FieldDescription>
        ) : null}
      </FieldContent>
    </Field>
  )
}

type TimingFieldsProps = {
  rule?: BookingRuleWithService | null
}

export function TimingFields({ rule }: TimingFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="durationMinutes">Service Duration (minutes)</FieldLabel>
        <FieldContent>
          <Input
            type="number"
            id="durationMinutes"
            name="durationMinutes"
            min={0}
            step={5}
            defaultValue={rule?.duration_minutes || ''}
            placeholder="e.g., 60"
          />
          <FieldDescription>How long the service takes</FieldDescription>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="bufferMinutes">Buffer Time (minutes)</FieldLabel>
        <FieldContent>
          <Input
            type="number"
            id="bufferMinutes"
            name="bufferMinutes"
            min={0}
            step={5}
            defaultValue={rule?.buffer_minutes || ''}
            placeholder="e.g., 15"
          />
          <FieldDescription>
            Time between appointments for cleanup/preparation
          </FieldDescription>
        </FieldContent>
      </Field>
    </>
  )
}

export function AdvanceBookingFields({ rule }: TimingFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="minAdvanceBookingHours">Minimum Advance Booking (hours)</FieldLabel>
        <FieldContent>
          <Input
            type="number"
            id="minAdvanceBookingHours"
            name="minAdvanceBookingHours"
            min={0}
            step={1}
            defaultValue={rule?.min_advance_booking_hours || ''}
            placeholder="e.g., 2"
          />
          <FieldDescription>
            How far in advance customers must book (minimum)
          </FieldDescription>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="maxAdvanceBookingDays">Maximum Advance Booking (days)</FieldLabel>
        <FieldContent>
          <Input
            type="number"
            id="maxAdvanceBookingDays"
            name="maxAdvanceBookingDays"
            min={0}
            step={1}
            defaultValue={rule?.max_advance_booking_days || ''}
            placeholder="e.g., 90"
          />
          <FieldDescription>
            How far in advance customers can book (maximum)
          </FieldDescription>
        </FieldContent>
      </Field>
    </>
  )
}
