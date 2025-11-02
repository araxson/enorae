'use client'

import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ButtonGroup } from '@/components/ui/button-group'

import { AssignedServicesList } from './assigned-services-list'
import { BulkAssignSection } from './bulk-assign-section'
import { SingleAssignSection } from './single-assign-section'
import type { AssignServicesDialogState } from '../../hooks/use-assign-services-dialog'
import type { StaffMemberWithServices, ServiceRow } from './types'

type AssignedService = {
  id: string | null
  service_id: string | null
  service_name: string | null
}

type AssignServicesDialogContentProps = {
  staff: StaffMemberWithServices
  availableServices: ServiceRow[]
  assignedServices: AssignedService[]
  selectedServices: Set<string>
  onSelectedServicesChange: (services: Set<string>) => void
  onClose: () => void
} & AssignServicesDialogState

export function AssignServicesDialogContent({
  staff,
  availableServices,
  assignedServices,
  selectedServices,
  onSelectedServicesChange,
  onClose,
  ...state
}: AssignServicesDialogContentProps) {
  const {
    mode,
    setMode,
    selectedService,
    setSelectedService,
    proficiencyLevel,
    setProficiencyLevel,
    priceOverride,
    setPriceOverride,
    durationOverride,
    setDurationOverride,
    notes,
    setNotes,
    isSubmitting,
    assignedServiceIds,
    handleSingleAssign,
    handleBulkAssign,
    handleUnassign,
    handleToggleService,
  } = state

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Manage Services for {staff.full_name}</DialogTitle>
        <DialogDescription>
          Assign services this staff member can perform
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <ButtonGroup>
          <Button
            variant={mode === 'bulk' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('bulk')}
          >
            Bulk Assign
          </Button>
          <Button
            variant={mode === 'single' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('single')}
          >
            Single Assign
          </Button>
        </ButtonGroup>

        {mode === 'bulk' ? (
          <BulkAssignSection
            availableServices={availableServices}
            selectedServices={selectedServices}
            onToggleService={handleToggleService}
            onSelectedServicesChange={onSelectedServicesChange}
            assignedServiceIds={assignedServiceIds}
          />
        ) : (
          <SingleAssignSection
            availableServices={availableServices}
            assignedServiceIds={assignedServiceIds}
            selectedService={selectedService}
            onSelectService={setSelectedService}
            proficiencyLevel={proficiencyLevel}
            onSelectProficiency={setProficiencyLevel}
            priceOverride={priceOverride}
            onPriceChange={setPriceOverride}
            durationOverride={durationOverride}
            onDurationChange={setDurationOverride}
            notes={notes}
            onNotesChange={setNotes}
          />
        )}

        <AssignedServicesList services={assignedServices} onUnassign={handleUnassign} />
      </div>

      <DialogFooter className="gap-2 sm:gap-2">
        <ButtonGroup aria-label="Actions">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {mode === 'bulk' ? (
            <Button onClick={handleBulkAssign} disabled={selectedServices.size === 0 || isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Assign Selected Services'}
            </Button>
          ) : (
            <Button onClick={handleSingleAssign} disabled={!selectedService || isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Assign Service'}
            </Button>
          )}
        </ButtonGroup>
      </DialogFooter>
    </DialogContent>
  )
}
