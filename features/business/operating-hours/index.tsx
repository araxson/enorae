import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getOperatingHoursBySalon, getOperatingHoursSalon } from './api/queries'
import { WeeklyScheduleForm } from './components/weekly-schedule-form'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function OperatingHoursManagement() {
  // Get salon from DAL
  let salon
  try {
    salon = await getOperatingHoursSalon()
  } catch (error) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Alert>
          <AlertTitle>Failed to load data</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load salon data'}
          </AlertDescription>
        </Alert>
      </section>
    )
  }

  // Fetch operating hours
  const operatingHours = await getOperatingHoursBySalon(salon.id ?? '')

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Operating hours</CardTitle>
            <CardDescription>Configure your salon&apos;s weekly operating schedule.</CardDescription>
          </CardHeader>
        </Card>

        <WeeklyScheduleForm salonId={salon.id} initialHours={operatingHours as any} />
      </div>
    </section>
  )
}
