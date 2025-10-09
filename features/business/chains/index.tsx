import { getSalonChains } from './api/queries'
import { SalonChainsClient } from './components/salon-chains-client'

export { ChainDetail } from './components/chain-detail-page'

export async function SalonChains() {
  const chains = await getSalonChains()
  return <SalonChainsClient initialChains={chains} />
}
