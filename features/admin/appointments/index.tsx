import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AdminSection } from '@/features/admin/common/components'
import { getAppointmentSnapshot } from './api/queries'
import { AppointmentsDashboard } from './components'

export async function AdminAppointments() {
  try {
    const snapshot = await getAppointmentSnapshot()
    return (
      <AdminSection>
        <div className="flex flex-col gap-10">
          <AppointmentsDashboard snapshot={snapshot} />
        </div>
      </AdminSection>
    )
  } catch (error) {
    return (
      <AdminSection>
        <Alert variant="destructive">
          <AlertTitle>Appointments unavailable</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load appointment oversight data'}
          </AlertDescription>
        </Alert>
      </AdminSection>
    )
  }
}
export type * from './api/types'
