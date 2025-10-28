import { getSalonChains } from './api/queries'
import { ChainDetail, SalonChainsClient } from './components'

export { ChainDetail }

export async function SalonChains() {
  const chains = await getSalonChains()
  return <SalonChainsClient initialChains={chains} />
}
