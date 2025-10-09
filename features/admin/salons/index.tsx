import { Section } from '@/components/layout'
import { getAllSalons, getSalonStats } from './api/queries'
import { SalonsClient } from './components/salons-client'

export async function AdminSalons() {
  const [salons, stats] = await Promise.all([getAllSalons(), getSalonStats()])

  return (
    <Section size="lg">
      <SalonsClient salons={salons} stats={stats} />
    </Section>
  )
}
