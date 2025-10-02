import { Alert, AlertDescription } from '@/components/ui/alert'
import { getBlockedTimesBySalon, getBlockedTimesSalon } from './dal/blocked-times.queries'
import { BlockedTimesList } from './components/blocked-times-list'
import { BlockedTimeForm } from './components/blocked-time-form'
import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'

export async function BlockedTimesManagement() {
  // Get salon from DAL
  let salon
  try {
    salon = await getBlockedTimesSalon()
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

  // Fetch blocked times
  const blockedTimes = await getBlockedTimesBySalon(salon.id)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Blocked Times</H1>
          <P className="text-muted-foreground">
            Manage blocked time slots to prevent bookings during specific periods
          </P>
        </div>

        <Separator />

        <Stack gap="lg">
          <BlockedTimeForm salonId={salon.id} />
          <BlockedTimesList blockedTimes={blockedTimes} />
        </Stack>
      </Stack>
    </Section>
  )
}
