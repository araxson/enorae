'use client'

import { Dialog } from '@/components/ui/dialog'
import { ServiceFormMigrated } from './service-form/service-form-migrated'
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
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <ServiceFormMigrated
        salonId={salonId}
        service={service ?? null}
        onClose={onClose}
      />
    </Dialog>
  )
}
