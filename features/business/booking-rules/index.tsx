import { Section, Stack, Box } from '@/components/layout'
import { H1, Muted } from '@/components/ui/typography'
import { getBookingRules, getBookingRuleServices } from './api/queries'
import { upsertBookingRule } from './api/mutations'
import { BookingRulesClient } from './components/booking-rules-client'

export async function BookingRules() {
  const [rules, services] = await Promise.all([
    getBookingRules(),
    getBookingRuleServices(),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Booking Rules</H1>
          <Muted>Configure booking constraints for your services</Muted>
        </Box>

        <BookingRulesClient rules={rules} services={services} onSubmit={upsertBookingRule} />
      </Stack>
    </Section>
  )
}
