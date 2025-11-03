'use client'

import { Dialog } from '@/components/ui/dialog'
import { ServiceFormContent } from './service-form/service-form-content'
import { useServiceForm } from './service-form/use-service-form'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services_view']['Row']

interface ServiceFormDialogProps {
  open: boolean
  onClose: () => void
  salonId: string
  service?: Service | null
  onSuccess?: () => void
}

export function ServiceFormDialog({
  open,
  onClose,
  salonId,
  service,
  onSuccess,
}: ServiceFormDialogProps) {
  const { form, error, isEditMode, handleSubmit } = useServiceForm({
    salonId,
    service: service ?? null,
    open,
    onClose,
    onSuccess,
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <ServiceFormContent
        service={service ?? null}
        form={form}
        error={error}
        isEditMode={isEditMode}
        handleSubmit={handleSubmit}
        onClose={onClose}
      />
    </Dialog>
  )
}
