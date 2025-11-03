'use client'

import { Dialog } from '@/components/ui/dialog'

import { AssignServicesDialogContent } from './assign-services-dialog-content'
import { useAssignServicesDialog } from '../../hooks/use-assign-services-dialog'
import type { StaffMemberWithServices, ServiceRow } from '@/features/business/staff/api/types'

type AssignServicesDialogProps = {
  staff: StaffMemberWithServices | null
  availableServices: ServiceRow[]
  assignedServices: Array<{ id: string | null; service_id: string | null; service_name: string | null }>
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedServices: Set<string>
  onSelectedServicesChange: (services: Set<string>) => void
}

export function AssignServicesDialog({
  staff,
  availableServices,
  assignedServices,
  open,
  onOpenChange,
  selectedServices,
  onSelectedServicesChange,
}: AssignServicesDialogProps) {
  const dialogState = useAssignServicesDialog({
    staff,
    assignedServices,
    selectedServices,
    onSelectedServicesChange,
    onOpenChange,
  })

  if (!staff) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AssignServicesDialogContent
        staff={staff}
        availableServices={availableServices}
        assignedServices={assignedServices}
        selectedServices={selectedServices}
        onSelectedServicesChange={onSelectedServicesChange}
        onClose={() => onOpenChange(false)}
        {...dialogState}
      />
    </Dialog>
  )
}
