import { getAllSalonChains, getChainAnalytics, getChainCompliance } from './api/queries'
import { AdminChainsContent } from './components/admin-chains-content'

export async function AdminChains() {
  const [chains, analytics, compliance] = await Promise.all([
    getAllSalonChains(),
    getChainAnalytics(),
    getChainCompliance(),
  ])

  return <AdminChainsContent chains={chains} analytics={analytics} compliance={compliance} />
}

export { AdminChainsSkeleton } from './components/admin-chains-skeleton'
