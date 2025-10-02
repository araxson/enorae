import { Section, Stack, Box, Flex, Grid } from '@/components/layout'
import { H1, P, Small, Large, Muted } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { getBookingRules } from './dal/booking-rules.queries'

export async function BookingRules() {
  const rules = await getBookingRules()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Booking Rules</H1>
          <Muted>Configure booking constraints for your services</Muted>
        </Box>

        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
          {rules.map((rule) => (
            <Card key={rule.id} className="p-4">
              <Stack gap="sm">
                <Large>{rule.service?.name}</Large>
                <Stack gap="xs">
                  {rule.duration_minutes && (
                    <Flex gap="sm">
                      <Small className="text-muted-foreground">Duration:</Small>
                      <Small>{rule.duration_minutes} min</Small>
                    </Flex>
                  )}
                  {rule.buffer_minutes && (
                    <Flex gap="sm">
                      <Small className="text-muted-foreground">Buffer:</Small>
                      <Small>{rule.buffer_minutes} min</Small>
                    </Flex>
                  )}
                  {rule.min_advance_booking_hours && (
                    <Flex gap="sm">
                      <Small className="text-muted-foreground">Min Advance:</Small>
                      <Small>{rule.min_advance_booking_hours}h</Small>
                    </Flex>
                  )}
                  {rule.max_advance_booking_days && (
                    <Flex gap="sm">
                      <Small className="text-muted-foreground">Max Advance:</Small>
                      <Small>{rule.max_advance_booking_days} days</Small>
                    </Flex>
                  )}
                </Stack>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
