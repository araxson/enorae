import { ExploreListing } from './sections'
import { getPublicSalons } from './api/queries'

export async function MarketingExplorePage() {
  const salons = await getPublicSalons()
  return <ExploreListing salons={salons} />
}
