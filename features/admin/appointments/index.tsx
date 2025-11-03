import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getAppointmentSnapshot } from './api/queries'
import { AppointmentsDashboard } from './components'

export async function AdminAppointments() {
  try {
    const snapshot = await getAppointmentSnapshot()
    return (
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10">
            <AppointmentsDashboard snapshot={snapshot} />
          </div>
        </div>
      </section>
    )
  } catch (error) {
    return (
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertTitle>Appointments unavailable</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load appointment oversight data'}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }
}
export * from './api/types'
