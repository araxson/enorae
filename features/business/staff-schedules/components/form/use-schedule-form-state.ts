'use client'

import { useCallback, useState } from 'react'
import type { SchedulePayload } from './schedule-options'

const INITIAL_STATE: SchedulePayload = {
  staffId: '',
  dayOfWeek: '',
  startTime: '09:00',
  endTime: '17:00',
  breakStart: '',
  breakEnd: '',
  effectiveFrom: '',
  effectiveUntil: '',
}

export function useScheduleFormState() {
  const [values, setValues] = useState<SchedulePayload>(INITIAL_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = useCallback(<K extends keyof SchedulePayload>(key: K, value: SchedulePayload[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setValues(INITIAL_STATE)
  }, [])

  return {
    values,
    isSubmitting,
    setIsSubmitting,
    reset,
    update,
  }
}
