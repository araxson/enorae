import { getAllSalons } from './api/queries'
import { SalonsClient } from './components/salons-client'

// Export types
export type { AdminSalon } from './types'

export async function AdminSalons() {
  const { salons, stats, insights } = await getAllSalons()

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SalonsClient salons={salons} stats={stats} insights={insights} />
      </div>
    </section>
  )
}
