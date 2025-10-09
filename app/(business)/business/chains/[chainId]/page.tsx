import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSalonChainById } from '@/features/business/chains/api/queries'
import { ChainDetailView } from '@/features/business/chains/components/chain-detail-view'
import { ChainSettingsButton } from '@/features/business/chains/components/chain-settings-button'

type PageProps = {
  params: Promise<{ chainId: string }>
}

export default async function ChainDetailPage({ params }: PageProps) {
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
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chains
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{chain.name}</h1>
            {chain.legal_name && (
              <p className="text-muted-foreground">{chain.legal_name}</p>
            )}
          </div>
        </div>
        <ChainSettingsButton
          chainId={chain.id!}
          chainName={chain.name!}
          locationCount={chain.salon_count || 0}
        />
      </div>

      <ChainDetailView chainId={chain.id!} chainName={chain.name!} />
    </div>
  )
}
