import type { StaffWithServices } from '../api/queries'

export type StaffFormValues = {
  email: string
  fullName: string
  title: string
  bio: string
  phone: string
  experienceYears: string
}

export type StaffFormState = StaffFormValues & {
  setEmail: (value: string) => void
  setFullName: (value: string) => void
  setTitle: (value: string) => void
  setBio: (value: string) => void
  setPhone: (value: string) => void
  setExperienceYears: (value: string) => void
  reset: (staff?: StaffWithServices | null) => void
}
