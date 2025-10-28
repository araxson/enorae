import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getBlockedTimesBySalon, getBlockedTimesSalon } from './api/queries'
import { BlockedTimesList, BlockedTimeForm } from './components'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export async function BlockedTimesManagement() {
  try {
    const salon = await getBlockedTimesSalon()
    const blockedTimes = await getBlockedTimesBySalon(salon.id)

    return (
      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Item variant="outline">
          <ItemHeader>
            <ItemTitle>Blocked times</ItemTitle>
          </ItemHeader>
          <ItemContent>
            <ItemDescription>
              Manage blocked time slots to prevent bookings during specific periods.
            </ItemDescription>
          </ItemContent>
        </Item>

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
