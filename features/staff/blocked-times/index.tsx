import { Section } from '@/components/layout'
import { getMyBlockedTimes } from './api/queries'
import { BlockedTimesFeature } from './components/blocked-times-feature'

export async function StaffBlockedTimesPage() {
  const blockedTimes = await getMyBlockedTimes()

  return (
    <Section size="lg">
      <BlockedTimesFeature blockedTimes={blockedTimes} />
    </Section>
  )
}

export { BlockedTimesFeature } from './components/blocked-times-feature'
export { BlockedTimesCalendar } from './components/blocked-times-calendar'
