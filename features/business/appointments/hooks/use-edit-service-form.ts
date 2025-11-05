import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries'
import { useEditServiceFormState } from './use-edit-service-form-state'
import { useStaffOptions } from './use-staff-options'
import { useEditServiceSubmit } from './use-edit-service-submit'

export function useEditServiceForm(
  service: AppointmentServiceDetails,
  isOpen: boolean,
  onSuccess: () => void
) {
  const { formData, setFormData } = useEditServiceFormState(service)
  const { isLoadingStaff, staff } = useStaffOptions(isOpen, service['appointment_id'])
  const { isSubmitting, handleSubmit } = useEditServiceSubmit(service, formData, onSuccess)

  return {
    formData,
    setFormData,
    isSubmitting,
    isLoadingStaff,
    staff,
    handleSubmit,
  }
}
