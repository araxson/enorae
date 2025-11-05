'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createStaffAction, updateStaffAction } from '../../api/mutations'
import { PersonalInfoSection, ContactInfoSection, FormStatus, SubmitButton } from './sections'

type Staff = {
  id: string
  email: string
  full_name: string | null
  title: string | null
  bio: string | null
  phone: string | null
  experience_years: number | null
}

type StaffFormMigratedProps = {
  salonId: string
  staff?: Staff | null
  onSuccess?: () => void
}

export function StaffFormMigrated({ salonId, staff, onSuccess }: StaffFormMigratedProps) {
  const isEditMode = !!staff
  const firstErrorRef = useRef<HTMLInputElement>(null)

  const createWithSalonId = createStaffAction.bind(null, salonId)
  const updateWithStaffId = staff?.id
    ? updateStaffAction.bind(null, staff.id)
    : createWithSalonId

  const [state, formAction, isPending] = useActionState(
    isEditMode ? updateWithStaffId : createWithSalonId,
    null
  )

  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  useEffect(() => {
    if (state?.success && onSuccess) {
      onSuccess()
    }
  }, [state?.success, onSuccess])

  return (
    <div className="space-y-6">
      <FormStatus state={state} isPending={isPending} isEditMode={isEditMode} />

      <form action={formAction} className="space-y-4" noValidate>
        <ContactInfoSection
          errors={state?.errors}
          isPending={isPending}
          email={staff?.email}
          phone={staff?.phone}
          isEditMode={isEditMode}
          firstErrorRef={firstErrorRef}
        />

        <PersonalInfoSection
          errors={state?.errors}
          isPending={isPending}
          fullName={staff?.full_name}
          title={staff?.title}
          experienceYears={staff?.experience_years}
          bio={staff?.bio}
          isEditMode={isEditMode}
          firstErrorRef={firstErrorRef}
        />

        <SubmitButton isEditMode={isEditMode} />
      </form>
    </div>
  )
}
