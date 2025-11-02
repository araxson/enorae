import { getAppointmentServiceOptions } from '@/features/business/appointments/api/queries'
import { AddServiceDialogClient } from './add-service-dialog-client'

interface AddServiceDialogWrapperProps {
  appointmentId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

/**
 * Server Component wrapper that fetches service options
 * and passes to Client Component
 */
export async function AddServiceDialogWrapper({
  appointmentId,
  isOpen,
  onClose,
  onSuccess,
}: AddServiceDialogWrapperProps) {
  // Only fetch if dialog is open
  if (!isOpen) {
    return null
  }

  const options = await getAppointmentServiceOptions(appointmentId)

  return (
    <AddServiceDialogClient
      appointmentId={appointmentId}
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
      services={options.services}
      staff={options.staff}
    />
  )
}
