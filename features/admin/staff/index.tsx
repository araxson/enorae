import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AdminSection } from '@/features/admin/common/components'
import { StaffClient } from './components'
import { getStaffDashboardData } from './api/queries'

export async function AdminStaff() {
  try {
    const data = await getStaffDashboardData()

    return (
      <AdminSection>
        <StaffClient {...data} />
      </AdminSection>
    )
  } catch (error) {
    return (
      <AdminSection>
        <Alert variant="destructive">
          <AlertTitle>Staff overview unavailable</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load staff overview'}
          </AlertDescription>
        </Alert>
      </AdminSection>
    )
  }
}
export type * from './api/types'
