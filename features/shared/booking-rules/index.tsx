import { Section, Stack, Box } from '@/components/layout'
import { H1, Muted } from '@/components/ui/typography'
import { getBookingRules } from './api/queries'
import { upsertBookingRule } from './api/mutations'
import { BookingRulesClient } from './components/booking-rules-client'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function BookingRules() {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Get staff salon
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) {
    throw new Error('Salon not found')
  }

  // Get rules and services in parallel
  const [rules, servicesData] = await Promise.all([
    getBookingRules(),
    supabase
      .from('services')
      .select('id, name')
      .eq('salon_id', staffProfile.salon_id)
      .is('deleted_at', null)
      .order('name'),
  ])

  const services = (servicesData.data || []) as Array<{ id: string; name: string }>

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
