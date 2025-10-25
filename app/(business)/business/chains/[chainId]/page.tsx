import { Suspense } from 'react'
import { ChainDetail } from '@/features/business/chains'
import { PageLoading } from '@/features/shared/ui-components'
import { generateMetadata as genMeta } from '@/lib/metadata'
export const metadata = genMeta({ title: 'Chain Details', description: 'Review and update settings for a specific salon chain', noIndex: true })
export default async function ChainDetailPage(props: { params: Promise<{ chainId: string }> }) {
  return (
    <Suspense fallback={<PageLoading />}>
      <ChainDetail {...props} />
    </Suspense>
  )
}
