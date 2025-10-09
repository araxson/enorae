'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Stack, Flex } from '@/components/layout'
import { StaffPerformanceSummary } from './staff-performance-summary'
import { StaffServicesManager } from './staff-services-manager'
import { StaffFormDialog } from './staff-form-dialog'
import type { StaffWithServices } from '../api/staff-services-queries'
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
      <Flex justify="end" align="start">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </Flex>

      <Stack gap="lg">
        <StaffPerformanceSummary staff={staffWithServices} />

        <StaffServicesManager
          staff={staffWithServices}
          availableServices={availableServices}
        />
      </Stack>

      <StaffFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}
