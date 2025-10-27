import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getBlockedTimesBySalon, getBlockedTimesSalon } from './api/queries'
import { BlockedTimesList } from './components/blocked-times-list'
import { BlockedTimeForm } from './components/blocked-time-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function BlockedTimesManagement() {
  try {
    const salon = await getBlockedTimesSalon()
    const blockedTimes = await getBlockedTimesBySalon(salon.id)

    return (
      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Blocked times</CardTitle>
            <CardDescription>Manage blocked time slots to prevent bookings during specific periods.</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>

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
          <AlertTitle>Failed to load data</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load salon data'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }
}
