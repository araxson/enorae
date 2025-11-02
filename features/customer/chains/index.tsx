import { ChainsPageContent } from './components/chains-page-content'
import { ChainDetailContent } from './components/chain-detail-content'

export function CustomerChainsPage() {
  return <ChainsPageContent />
}

export async function SalonChainDetailFeature({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const resolved = await params
  return <ChainDetailContent slug={resolved.slug} />
}

export { getSalonChains, getSalonChainById, getChainLocations } from './api/queries'
export type { SalonChainWithLocations } from './api/queries'
export * from './types'
