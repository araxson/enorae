import { Alert, AlertDescription } from '@/components/ui/alert'
import { getOperatingHoursBySalon, getOperatingHoursSalon } from './api/queries'
import { WeeklyScheduleForm } from './components/weekly-schedule-form'
import { Separator } from '@/components/ui/separator'

export async function OperatingHoursManagement() {
  // Get salon from DAL
  let salon
  try {
    salon = await getOperatingHoursSalon()
  } catch (error) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load salon data'}
          </AlertDescription>
        </Alert>
      </section>
    )
  }

  // Fetch operating hours
  const operatingHours = await getOperatingHoursBySalon(salon.id)

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div>
          <p>Operating Hours</p>
          <p className="text-muted-foreground">
            Configure your salon&apos;s weekly operating schedule
          </p>
        </div>

        <Separator />

        <WeeklyScheduleForm salonId={salon.id} initialHours={operatingHours} />
      </div>
    </section>
  )
}
