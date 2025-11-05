import { useState, useEffect } from 'react'
import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries'
import type { ServiceFormData } from '../api/types'

export function useEditServiceFormState(service: AppointmentServiceDetails) {
  const serviceKey = service['id'] || ''

  const [formData, setFormData] = useState<ServiceFormData>(() => ({
    staffId: service['staff_id'] || '',
    startTime: service['start_time']
      ? new Date(service['start_time']).toTimeString().slice(0, 5)
      : '',
    endTime: service['end_time'] ? new Date(service['end_time']).toTimeString().slice(0, 5) : '',
    durationMinutes: service['duration_minutes']?.toString() || '',
    status: service['status'] || 'pending',
  }))

  // Reset form when service changes
  useEffect(() => {
    setFormData({
      staffId: service['staff_id'] || '',
      startTime: service['start_time'] ? new Date(service['start_time']).toTimeString().slice(0, 5) : '',
      endTime: service['end_time'] ? new Date(service['end_time']).toTimeString().slice(0, 5) : '',
      durationMinutes: service['duration_minutes']?.toString() || '',
      status: service['status'] || 'pending',
    })
  }, [serviceKey, service])

  return { formData, setFormData }
}
