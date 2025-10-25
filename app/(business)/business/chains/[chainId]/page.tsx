import { Suspense } from 'react'
import { ChainDetail } from '@/features/business/chains'
import { generateMetadata as genMeta } from '@/lib/metadata'
export const metadata = genMeta({ title: 'Chain Details', description: 'Review and update settings for a specific salon chain', noIndex: true })
type PageProps = { params: Promise<{ chainId: string }> }
export default async function ChainDetailPage(props: PageProps) {
  return (
    <Suspense fallback={null}>
      <ChainDetail {...props} />
    </Suspense>
  )
}
