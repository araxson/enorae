import { useState } from 'react'
import type { ServiceFormData } from '../api/types'
import { useServiceOptions } from './use-service-options'
import { useAddServiceSubmit } from './use-add-service-submit'

export function useAddServiceForm(
  appointmentId: string,
  isOpen: boolean,
  onSuccess: () => void
) {
  const [formData, setFormData] = useState<ServiceFormData>({
    serviceId: '',
    staffId: '',
    startTime: '',
    endTime: '',
    durationMinutes: '',
  })

  const { isLoadingOptions, services, staff } = useServiceOptions(isOpen, appointmentId)

  const resetForm = () => {
    setFormData({
      serviceId: '',
      staffId: '',
      startTime: '',
      endTime: '',
      durationMinutes: '',
    })
  }

  const { isSubmitting, handleSubmit } = useAddServiceSubmit(
    appointmentId,
    formData,
    resetForm,
    onSuccess
  )

  return {
    formData,
    setFormData,
    isSubmitting,
    isLoadingOptions,
    services,
    staff,
    handleSubmit,
  }
}
