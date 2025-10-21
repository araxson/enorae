'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StaffPerformanceSummary } from './staff-performance-summary'
import { StaffServicesManager } from './staff-services-manager'
import { StaffFormDialog } from './staff-form-dialog'
import type { StaffWithServices } from '../api/queries'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services']['Row']

interface StaffManagementClientProps {
  staffWithServices: StaffWithServices[]
  availableServices: Service[]
}

export function StaffManagementClient({
  staffWithServices,
  availableServices,
}: StaffManagementClientProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSuccess = () => {
    setIsDialogOpen(false)
    router.refresh()
  }

  return (
    <>
      <div className="flex gap-4 items-start justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <StaffPerformanceSummary staff={staffWithServices} />

        <StaffServicesManager
          staff={staffWithServices}
          availableServices={availableServices}
        />
      </div>

      <StaffFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}
