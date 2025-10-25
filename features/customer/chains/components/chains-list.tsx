'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared'
import { Building2 } from 'lucide-react'
import { ChainCard } from './chain-card'
import type { Database } from '@/lib/types/database.types'

type SalonChain = Database['public']['Views']['salon_chains_view']['Row']

interface ChainsListProps {
  chains: SalonChain[]
}

export function ChainsList({ chains }: ChainsListProps) {
  if (chains.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No salon chains yet"
        description="You haven't followed any salon chains. Explore salons to discover popular chains."
        action={
          <Button asChild>
            <Link href="/customer/salons">Browse salons</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {chains.map((chain) => (
        <ChainCard key={chain['id']} chain={chain} />
      ))}
    </div>
  )
}
