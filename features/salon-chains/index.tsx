'use client'

import { Plus } from 'lucide-react'
import { H2, Muted } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { ChainsList } from './components/chains-list'
import type { SalonChainWithCounts } from './dal/salon-chains.queries'

type SalonChainsProps = {
  initialChains: SalonChainWithCounts[]
}

export function SalonChains({ initialChains }: SalonChainsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H2>Salon Chains</H2>
          <Muted className="mt-1">
            Manage multi-location salon chains
          </Muted>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Chain
        </Button>
      </div>

      <ChainsList chains={initialChains} />
    </div>
  )
}
