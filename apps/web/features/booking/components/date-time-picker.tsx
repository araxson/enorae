'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@enorae/ui'
import { Input } from '@enorae/ui'
import { Label } from '@enorae/ui'
import { Button } from '@enorae/ui'
import { useState } from 'react'
import type { TimeSlot } from '../types/booking.types'

interface DateTimePickerProps {
  selectedDate?: string
  selectedTime?: string
  availableSlots: TimeSlot[]
  onSelectDate: (date: string) => void
  onSelectTime: (time: string) => void
}

export function DateTimePicker({
  selectedDate,
  selectedTime,
  availableSlots,
  onSelectDate,
  onSelectTime
}: DateTimePickerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Date & Time</CardTitle>
        <CardDescription>Select your preferred appointment time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {selectedDate && (
          <div className="space-y-2">
            <Label>Available Times</Label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.time}
                  type="button"
                  variant={selectedTime === slot.time ? 'default' : 'outline'}
                  disabled={!slot.available}
                  onClick={() => onSelectTime(slot.time)}
                  className="w-full"
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}