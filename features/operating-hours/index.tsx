import { Alert, AlertDescription } from '@/components/ui/alert'
import { getOperatingHoursBySalon, getOperatingHoursSalon } from './dal/operating-hours.queries'
import { WeeklyScheduleForm } from './components/weekly-schedule-form'
import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
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
          <H1>Operating Hours</H1>
          <P className="text-muted-foreground">
            Configure your salon's weekly operating schedule
          </P>
        </div>

        <Separator />

        <WeeklyScheduleForm salonId={salon.id} initialHours={operatingHours} />
      </Stack>
    </Section>
  )
}
