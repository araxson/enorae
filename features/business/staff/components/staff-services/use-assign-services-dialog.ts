'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  assignServiceToStaff,
  bulkAssignServices,
  unassignServiceFromStaff,
} from '@/features/business/staff-services/api/mutations'
import type { StaffMemberWithServices } from './types'

type AssignedService = {
  id: string | null
  service_id: string | null
  service_name: string | null
}

type UseAssignServicesDialogParams = {
  staff: StaffMemberWithServices | null
  assignedServices: AssignedService[]
  selectedServices: Set<string>
  onSelectedServicesChange: (services: Set<string>) => void
  onOpenChange: (open: boolean) => void
}

export function useAssignServicesDialog({
  staff,
  assignedServices,
  selectedServices,
  onSelectedServicesChange,
  onOpenChange,
}: UseAssignServicesDialogParams) {
  const [mode, setMode] = useState<'single' | 'bulk'>('bulk')
  const [selectedService, setSelectedService] = useState('')
  const [proficiencyLevel, setProficiencyLevel] = useState('')
  const [priceOverride, setPriceOverride] = useState('')
  const [durationOverride, setDurationOverride] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const assignedServiceIds = useMemo(
    () => new Set(assignedServices.map((service) => service.service_id)),
    [assignedServices],
  )

  const resetForm = () => {
    setSelectedService('')
    setProficiencyLevel('')
    setPriceOverride('')
    setDurationOverride('')
    setNotes('')
  }

  const handleSingleAssign = async () => {
    if (!staff || !selectedService) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('staffId', staff.id)
    formData.append('serviceId', selectedService)
    if (proficiencyLevel) formData.append('proficiencyLevel', proficiencyLevel)
    if (priceOverride) formData.append('priceOverride', priceOverride)
    if (durationOverride) formData.append('durationOverride', durationOverride)
    if (notes) formData.append('notes', notes)

    const result = await assignServiceToStaff(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Service assigned to staff')
      resetForm()
      onOpenChange(false)
    }

    setIsSubmitting(false)
  }

  const handleBulkAssign = async () => {
    if (!staff || selectedServices.size === 0) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('staffId', staff.id)
    formData.append('serviceIds', JSON.stringify(Array.from(selectedServices)))

    const result = await bulkAssignServices(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Services assigned')
      onOpenChange(false)
    }

    setIsSubmitting(false)
  }

  const handleUnassign = async (serviceId: string) => {
    if (!staff) return

    const formData = new FormData()
    formData.append('staffId', staff.id)
    formData.append('serviceId', serviceId)

    const result = await unassignServiceFromStaff(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Service removed from staff')
    }
  }

  const handleToggleService = (serviceId: string) => {
    const updated = new Set(selectedServices)
    if (updated.has(serviceId)) {
      updated.delete(serviceId)
    } else {
      updated.add(serviceId)
    }
    onSelectedServicesChange(updated)
  }

  return {
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
  }
}

export type AssignServicesDialogState = ReturnType<typeof useAssignServicesDialog>
