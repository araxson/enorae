import { Alert, AlertDescription } from '@/components/ui/alert'
import { getOperatingHoursBySalon, getOperatingHoursSalon } from './api/queries'
import { WeeklyScheduleForm } from './components/weekly-schedule-form'
import { Section, Stack } from '@/components/layout'
import { P } from '@/components/ui/typography'
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
          <P className="text-base font-semibold">Operating Hours</P>
          <P className="text-muted-foreground">
            Configure your salon&apos;s weekly operating schedule
          </P>
        </div>

        <Separator />

        <WeeklyScheduleForm salonId={salon.id} initialHours={operatingHours} />
      </Stack>
    </Section>
  )
}
