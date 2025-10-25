'use client'

import type { Control } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Combobox } from '@/components/ui/combobox'

import type { BookingFormValues, Service, Staff } from '@/features/customer/booking/types'

interface FormFieldsProps {
  services: Service[]
  staff: Staff[]
  control: Control<BookingFormValues>
}

export function FormFields({ services, staff, control }: FormFieldsProps) {
  const serviceOptions = services.length
    ? services
        .filter((service) => service['id'])
        .map((service) => ({
          value: service['id'] ?? '',
          label: `${service['name']}${service['category_name'] ? ` (${service['category_name']})` : ''}`,
        }))
    : []

  const staffOptions = [
    { value: '', label: 'Any available' },
    ...staff
      .filter((member) => member['id'])
      .map((member) => ({
        value: member['id'] ?? '',
        label: member['title'] || 'Staff member',
      })),
  ]

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <>
      <FormField
        control={control}
        name="serviceId"
        render={({ field }) => (
          <FormItem>
          <FormLabel>Service</FormLabel>
          <FormControl>
            <Combobox
              value={field.value}
              onChange={field.onChange}
              placeholder="Select a service"
              options={serviceOptions}
              disabled={!serviceOptions.length}
              emptyMessage="This salon is still setting up services."
            />
          </FormControl>
            {!serviceOptions.length && (
              <FormMessage>Services will appear here once the salon publishes them.</FormMessage>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="staffId"
        render={({ field }) => (
          <FormItem>
          <FormLabel>Staff member</FormLabel>
          <FormControl>
            <Combobox
              value={field.value}
              onChange={field.onChange}
              placeholder="Select staff member"
              options={staffOptions}
            />
          </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input type="date" min={minDate} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
