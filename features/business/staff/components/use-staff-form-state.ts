'use client'

import { useCallback, useState } from 'react'
import type { StaffWithServices } from '../api/staff-services-queries'
import type { StaffFormState } from './staff-form-types'

const EMPTY_FORM = {
  email: '',
  fullName: '',
  title: '',
  bio: '',
  phone: '',
  experienceYears: '',
}

export function useStaffFormState(initialStaff?: StaffWithServices | null): StaffFormState {
  const [values, setValues] = useState(() => hydrate(initialStaff))

  const update = useCallback(<K extends keyof typeof values>(key: K, value: typeof values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback((staff?: StaffWithServices | null) => {
    setValues(hydrate(staff))
  }, [])

  return {
    ...values,
    setEmail: (value: string) => update('email', value),
    setFullName: (value: string) => update('fullName', value),
    setTitle: (value: string) => update('title', value),
    setBio: (value: string) => update('bio', value),
    setPhone: (value: string) => update('phone', value),
    setExperienceYears: (value: string) => update('experienceYears', value),
    reset,
  }
}

function hydrate(staff?: StaffWithServices | null) {
  if (!staff) return { ...EMPTY_FORM }
  return {
    email: staff.email || '',
    fullName: staff.full_name || '',
    title: staff.title || '',
    bio: staff.bio || '',
    phone: '',
    experienceYears: staff.experience_years?.toString() || '',
  }
}
