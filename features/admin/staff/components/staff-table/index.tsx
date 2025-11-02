'use client'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import type { StaffWithMetrics } from '@/features/admin/staff/api/queries'
import { DesktopStaffTable } from './desktop-table'
import { MobileStaffCards } from './mobile-cards'

type StaffTableProps = {
  staff: StaffWithMetrics[]
}

export function StaffTable({ staff }: StaffTableProps) {
  if (staff.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No staff records found</EmptyTitle>
          <EmptyDescription>Adjust the filters or date range to explore staff activity.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Once criteria match, staff profiles with compliance metrics will appear.</EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <DesktopStaffTable staff={staff} />
      </div>

      <div className="md:hidden">
        <MobileStaffCards staff={staff} />
      </div>
    </>
  )
}
