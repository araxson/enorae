'use client'
import { ExportButton } from '@/features/business/business-common/components'
import { TopPerformers } from '@/features/business/analytics/components/top-performers'
import type { getTopServices, getTopStaff } from '@/features/business/analytics/api/queries'

type ServicePerformance = Awaited<ReturnType<typeof getTopServices>>[number]
type StaffPerformance = Awaited<ReturnType<typeof getTopStaff>>[number]

type Props = {
  start: string
  end: string
  services: ServicePerformance[]
  staff: StaffPerformance[]
}

export function TopPerformersSection({ start, end, services, staff }: Props) {
  return (
    <>
      <div className="flex gap-4 items-center items-center justify-between">
        <div className="sr-only">Top performers exports</div>
        <ExportButton
          data={services.map((service) => ({
            name: service.name,
            count: service.count,
            revenue: service.revenue,
          }))}
          filename={`top-services-${start}-to-${end}`}
        />
        <ExportButton
          data={staff.map((item) => ({
            name: item.name,
            title: item.title || '',
            count: item.count,
            revenue: item.revenue,
          }))}
          filename={`top-staff-${start}-to-${end}`}
        />
      </div>
      <TopPerformers services={services} staff={staff} />
    </>
  )
}
