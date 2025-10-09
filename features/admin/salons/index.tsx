import { Section } from '@/components/layout'
import { getAllSalons } from './api/queries'
import { SalonsClient } from './components/salons-client'

export async function AdminSalons() {
  const { salons, stats, insights } = await getAllSalons()

  return (
    <Section size="lg">
      <SalonsClient salons={salons} stats={stats} insights={insights} />
    </Section>
  )
}
