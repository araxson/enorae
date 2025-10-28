import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
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
      <ItemGroup className="items-start justify-between gap-4">
        <Item className="items-center gap-4">
          <ItemActions className="flex-none">
            <Link href="/business/chains">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 size-4" />
                Back to Chains
              </Button>
            </Link>
          </ItemActions>
          <ItemContent className="flex-col items-start gap-1">
            <ItemTitle>{chain['name']}</ItemTitle>
            {chain['legal_name'] ? (
              <ItemDescription>{chain['legal_name']}</ItemDescription>
            ) : null}
          </ItemContent>
        </Item>
        <ItemActions className="flex-none">
          <ChainSettingsButton
            chainId={chain['id']!}
            chainName={chain['name']!}
            locationCount={chain['salon_count'] || 0}
          />
        </ItemActions>
      </ItemGroup>

      <ChainDetailView chainId={chain['id']!} chainName={chain['name']!} />
    </div>
  )
}
