import { Alert, AlertDescription } from '@/components/ui/alert'
import { getOperatingHoursBySalon, getOperatingHoursSalon } from './api/queries'
import { WeeklyScheduleForm } from './components/weekly-schedule-form'
import { Section, Stack } from '@/components/layout'
import { Separator } from '@/components/ui/separator'

export async function OperatingHoursManagement() {
  // Get salon from DAL
  let salon
  try {
    salon = await getOperatingHoursSalon()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load salon data'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  // Fetch operating hours
  const operatingHours = await getOperatingHoursBySalon(salon.id)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <p className="leading-7 text-base font-semibold">Operating Hours</p>
          <p className="leading-7 text-muted-foreground">
            Configure your salon&apos;s weekly operating schedule
          </p>
        </div>

        <Separator />

        <WeeklyScheduleForm salonId={salon.id} initialHours={operatingHours} />
      </Stack>
    </Section>
  )
}
