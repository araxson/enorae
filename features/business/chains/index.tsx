import { getSalonChains } from './api/queries'
import { SalonChainsClient } from './components/salon-chains-client'

export async function SalonChains() {
  const chains = await getSalonChains()
  return <SalonChainsClient initialChains={chains} />
}
