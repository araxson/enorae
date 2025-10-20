import { Section, Stack, Box } from '@/components/layout'
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
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Booking Rules</h1>
          <p className="text-sm text-muted-foreground">Configure booking constraints for your services</p>
        </Box>

        <BookingRulesClient rules={rules} services={services} onSubmit={upsertBookingRule} />
      </Stack>
    </Section>
  )
}
