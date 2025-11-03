import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { serviceSchema, type ServiceSchema, type ServiceSchemaInput } from '../../api/schema'
import { createService, updateService } from '../../api/mutations'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services_view']['Row']

interface UseServiceFormParams {
  salonId: string
  service: Service | null
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function useServiceForm({ salonId, service, open, onClose, onSuccess }: UseServiceFormParams) {
  const [error, setError] = useState<string | null>(null)
  const isEditMode = !!service

  const form = useForm<ServiceSchemaInput, unknown, ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: undefined,
      duration_minutes: 30,
      buffer_minutes: 0,
      base_price: 0,
      currency: 'USD',
      status: 'active' as const,
      requires_deposit: false,
      deposit_amount: undefined,
      max_advance_booking_days: undefined,
      min_advance_booking_hours: undefined,
      cancellation_notice_hours: undefined,
      is_online_booking_enabled: true,
      max_simultaneous_bookings: 1,
      tags: [],
      preparation_notes: undefined,
      aftercare_notes: undefined,
    },
  })

  // Initialize form when dialog opens with service data
  useEffect(() => {
    if (open && service) {
      form.reset({
        name: service.name ?? '',
        description: service.description ?? undefined,
        category_id: service.category_id ?? undefined,
        duration_minutes: service.duration_minutes ?? 30,
        buffer_minutes: service.buffer_minutes ?? 0,
        base_price: service.sale_price ?? 0,
        currency: 'USD',
        status: (service.is_active ? 'active' : 'inactive') as 'active' | 'inactive',
        requires_deposit: false,
        deposit_amount: undefined,
        is_online_booking_enabled: service.is_bookable ?? true,
        max_simultaneous_bookings: 1,
        tags: [],
      })
      setError(null)
    } else if (!open) {
      // Reset form when dialog closes
      form.reset()
      setError(null)
    }
  }, [open, service, form])

  const handleSubmit = async (data: ServiceSchema) => {
    setError(null)
    try {
      if (isEditMode && service?.id) {
        // TODO: Implement updateService - needs proper mapping
        await updateService(service.id, {
          name: data.name,
          description: data.description,
          category_id: data.category_id,
          is_active: data.status === 'active',
          is_bookable: data.is_online_booking_enabled,
          is_featured: false,
        })
      } else {
        await createService(
          salonId,
          {
            name: data.name,
            description: data.description,
            category_id: data.category_id,
            is_active: data.status === 'active',
            is_bookable: data.is_online_booking_enabled,
            is_featured: false,
          },
          {
            base_price: data.base_price,
            currency_code: data.currency,
          },
          {
            duration_minutes: data.duration_minutes,
            buffer_minutes: data.buffer_minutes,
            max_advance_booking_days: data.max_advance_booking_days,
            min_advance_booking_hours: data.min_advance_booking_hours,
          }
        )
      }

      toast.success(isEditMode ? 'Service updated successfully' : 'Service created successfully')
      onSuccess?.()
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save service'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return {
    form,
    error,
    isEditMode,
    handleSubmit,
  }
}
