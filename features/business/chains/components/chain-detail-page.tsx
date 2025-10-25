import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSalonChainById } from '@/features/business/chains/api/queries'
import { ChainDetailView } from './chain-detail-view'
import { ChainSettingsButton } from './chain-settings-button'

type ChainDetailProps = {
  params: Promise<{ chainId: string }>
}

export async function ChainDetail({ params }: ChainDetailProps) {
  const { chainId } = await params
  const chain = await getSalonChainById(chainId)

  if (!chain) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/business/chains">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chains
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">{chain['name']}</h1>
            {chain['legal_name'] && (
              <div className="text-sm text-muted-foreground">{chain['legal_name']}</div>
            )}
          </div>
        </div>
        <ChainSettingsButton
          chainId={chain['id']!}
          chainName={chain['name']!}
          locationCount={chain['salon_count'] || 0}
        />
      </div>

      <ChainDetailView chainId={chain['id']!} chainName={chain['name']!} />
    </div>
  )
}
