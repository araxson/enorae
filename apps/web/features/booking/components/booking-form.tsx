'use client'

import { useState, useEffect } from 'react'
import { Button } from '@enorae/ui'
import { ServiceSelector } from './service-selector'
import { StaffSelector } from './staff-selector'
import { DateTimePicker } from './date-time-picker'
import { createBooking } from '../actions/booking.actions'
import type { Service, Staff, TimeSlot } from '../types/booking.types'

interface BookingFormProps {
  salonId: string
  services: Service[]
  staff: Staff[]
  initialServiceId?: string
}

export function BookingForm({
  salonId,
  services,
  staff,
  initialServiceId
}: BookingFormProps) {
  const [selectedService, setSelectedService] = useState<string>(initialServiceId || '')
  const [selectedStaff, setSelectedStaff] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Generate available slots when staff and date are selected
  useEffect(() => {
    if (selectedStaff && selectedDate) {
      // For MVP, generate simple time slots
      const slots: TimeSlot[] = []
      for (let hour = 9; hour <= 17; hour++) {
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          available: true,
          staffId: selectedStaff,
        })
      }
      setAvailableSlots(slots)
    }
  }, [selectedStaff, selectedDate])

  const canSubmit = selectedService && selectedStaff && selectedDate && selectedTime

  return (
    <form action={createBooking} className="space-y-6">
      <input type="hidden" name="salonId" value={salonId} />
      <input type="hidden" name="serviceId" value={selectedService} />
      <input type="hidden" name="staffId" value={selectedStaff} />
      <input type="hidden" name="date" value={selectedDate} />
      <input type="hidden" name="time" value={selectedTime} />

      <ServiceSelector
        services={services}
        selectedService={selectedService}
        onSelectService={setSelectedService}
      />

      {selectedService && (
        <StaffSelector
          staff={staff}
          selectedStaff={selectedStaff}
          onSelectStaff={setSelectedStaff}
        />
      )}

      {selectedStaff && (
        <DateTimePicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          availableSlots={availableSlots}
          onSelectDate={setSelectedDate}
          onSelectTime={setSelectedTime}
        />
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!canSubmit || isLoading}
        size="lg"
      >
        {isLoading ? 'Booking...' : 'Confirm Booking'}
      </Button>
    </form>
  )
}