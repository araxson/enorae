import { Alert, AlertDescription } from '@/components/ui/alert'
import { getBlockedTimesBySalon, getBlockedTimesSalon } from './api/queries'
import { BlockedTimesList } from './components/blocked-times-list'
import { BlockedTimeForm } from './components/blocked-time-form'
import { Separator } from '@/components/ui/separator'

export async function BlockedTimesManagement() {
  try {
    const salon = await getBlockedTimesSalon()
    const blockedTimes = await getBlockedTimesBySalon(salon.id)

    return (
      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Blocked Times</h1>
          <p className="leading-7 text-muted-foreground">
            Manage blocked time slots to prevent bookings during specific periods.
          </p>
        </div>

        <Separator />

        <div className="space-y-6">
          <BlockedTimeForm salonId={salon.id} />
          <BlockedTimesList blockedTimes={blockedTimes} />
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load salon data'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }
}
