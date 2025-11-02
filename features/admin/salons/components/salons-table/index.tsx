'use client'

import { Building2 } from 'lucide-react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import type { AdminSalon } from '@/features/admin/salons/api/queries'
import { DesktopSalonsTable } from './desktop-table'
import { MobileSalonsCards } from './mobile-cards'

interface SalonsTableProps {
  salons: AdminSalon[]
}

export function SalonsTable({ salons }: SalonsTableProps) {
  if (salons.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Building2 />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No salons found</EmptyTitle>
          <EmptyDescription>Salon records appear after owners complete their onboarding.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          When salons join the platform, their profiles and metrics populate automatically.
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <DesktopSalonsTable salons={salons} />
      </div>

      <div className="md:hidden">
        <MobileSalonsCards salons={salons} />
      </div>
    </>
  )
}
