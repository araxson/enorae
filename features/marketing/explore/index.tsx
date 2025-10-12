import { MarketingExploreView } from './components/marketing-explore-view'
import { getPublicSalons } from './api/queries'

export async function MarketingExplore() {
  const salons = await getPublicSalons()
  return <MarketingExploreView salons={salons} />
}
