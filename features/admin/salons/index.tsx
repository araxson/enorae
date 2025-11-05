import { AdminSection } from '@/features/admin/common/components'
import { getAllSalons } from './api/queries'
import { SalonsClient } from './components'

// Export types
export type { AdminSalon } from './api/types'

export async function AdminSalons() {
  const { salons, stats, insights } = await getAllSalons()

  return (
    <AdminSection>
      <SalonsClient salons={salons} stats={stats} insights={insights} />
    </AdminSection>
  )
}
export type * from './api/types'
