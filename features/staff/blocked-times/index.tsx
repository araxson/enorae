import { getMyBlockedTimes } from './api/queries'
import { BlockedTimesFeature } from './components/blocked-times-feature'

export async function StaffBlockedTimesPage() {
  const blockedTimes = await getMyBlockedTimes()

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <BlockedTimesFeature blockedTimes={blockedTimes} />
    </section>
  )
}

export { BlockedTimesFeature } from './components/blocked-times-feature'
export { BlockedTimesCalendar } from './components/blocked-times-calendar'
