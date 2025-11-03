'use client'

import { useMemo, useState } from 'react'

import type { StaffMemberWithServices, ServiceRow } from '@/features/business/staff/api/types'
import { StaffServicesList } from './staff-services-list'
import { AssignServicesDialog } from './assign-services-dialog'

type StaffServicesManagerProps = {
  staff: StaffMemberWithServices[]
  availableServices: ServiceRow[]
}

export function StaffServicesManager({
  staff,
  availableServices,
}: StaffServicesManagerProps) {
  const [selectedStaff, setSelectedStaff] = useState<StaffMemberWithServices | null>(null)
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStaff = useMemo(() => {
    if (!searchQuery) return staff

    const query = searchQuery.toLowerCase()
    return staff.filter((member) => {
      const nameMatch = member['full_name']?.toLowerCase().includes(query)
      const titleMatch = member['title']?.toLowerCase().includes(query)
      const servicesMatch = member.services.some((service: { service_name?: string | null }) =>
        service['service_name']?.toLowerCase().includes(query),
      )

      return nameMatch || titleMatch || servicesMatch
    })
  }, [staff, searchQuery])

  return (
    <>
      <StaffServicesList
        staff={staff}
        filteredStaff={filteredStaff}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onManageStaff={(member) => {
          setSelectedStaff(member)
          const ids = member.services
            .map((service: { service_id?: string | null }) => service['service_id'])
            .filter((id: string | null | undefined): id is string => Boolean(id))
          setSelectedServices(new Set(ids))
        }}
      />

      <AssignServicesDialog
        staff={selectedStaff}
        availableServices={availableServices}
        assignedServices={selectedStaff?.services || []}
        open={!!selectedStaff}
        onOpenChange={(open) => !open && setSelectedStaff(null)}
        selectedServices={selectedServices}
        onSelectedServicesChange={setSelectedServices}
      />
    </>
  )
}
