import { getSalons } from './dal/salons.queries'
import { SalonDiscoveryClient } from './components/salon-discovery-client'

export async function SalonDiscovery() {
  const salons = await getSalons()
  return <SalonDiscoveryClient initialSalons={salons} />
}
