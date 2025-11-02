'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createStaffMember, updateStaffMember } from '@/features/business/staff/api/mutations'
import {
  createStaffSchema,
  updateStaffSchema,
  type CreateStaffSchema,
  type UpdateStaffSchema
} from '@/features/business/staff/api/schema'
import type { StaffWithServices } from '@/features/business/staff/api/queries'

type UseStaffFormOptions = {
  staff?: StaffWithServices | null
  onSuccess?: () => void
  onClose: () => void
}

export function useStaffForm({ staff, onSuccess, onClose }: UseStaffFormOptions) {
  const [error, setError] = useState<string | null>(null)
  const isEditMode = Boolean(staff)

  const form = useForm<CreateStaffSchema | UpdateStaffSchema>({
    resolver: zodResolver(isEditMode ? updateStaffSchema : createStaffSchema),
    defaultValues: isEditMode
      ? {
          full_name: staff?.full_name || '',
          title: staff?.title || '',
          bio: staff?.bio || '',
          phone: staff?.phone || '',
          experience_years: staff?.experience_years || undefined,
        }
      : {
          email: '',
          full_name: '',
          title: '',
          bio: '',
          phone: '',
          experience_years: undefined,
        },
  })

  useEffect(() => {
    if (isEditMode && staff) {
      form.reset({
        full_name: staff.full_name || '',
        title: staff.title || '',
        bio: staff.bio || '',
        phone: staff.phone || '',
        experience_years: staff.experience_years || undefined,
      })
    } else {
      form.reset({
        email: '',
        full_name: '',
        title: '',
        bio: '',
        phone: '',
        experience_years: undefined,
      })
    }
    setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff, isEditMode])

  const handleSubmit = async (values: CreateStaffSchema | UpdateStaffSchema) => {
    setError(null)

    try {
      if (isEditMode && staff?.id) {
        await updateStaffMember(staff.id as string, values as Partial<UpdateStaffSchema>)
      } else {
        await createStaffMember(values as CreateStaffSchema)
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save staff member')
    }
  }

  return {
    form,
    error,
    isEditMode,
    handleSubmit,
  }
}
