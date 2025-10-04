import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { getAllSalons, getSalonStats } from './api/queries'
import { SalonsClient } from './components/salons-client'

export async function AdminSalons() {
  const [salons, stats] = await Promise.all([getAllSalons(), getSalonStats()])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Salons Management</H1>
          <Lead>Monitor and manage all salons on the platform</Lead>
        </div>

        <SalonsClient salons={salons} stats={stats} />
      </Stack>
    </Section>
  )
}
