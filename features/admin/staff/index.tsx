import { Alert, AlertDescription } from '@/components/ui/alert'
import { StaffClient } from './components/staff-client'
import { getStaffDashboardData } from './api/queries'

export async function AdminStaff() {
  try {
    const data = await getStaffDashboardData()

    return (
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <StaffClient {...data} />
        </div>
      </section>
    )
  } catch (error) {
    return (
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load staff overview'}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }
}
