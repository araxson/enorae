'use client'

import Link from 'next/link'
import { Grid } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { Building2 } from 'lucide-react'
import { ChainCard } from './chain-card'
import type { Database } from '@/lib/types/database.types'

type SalonChain = Database['public']['Views']['salon_chains']['Row']

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
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {chains.map((chain) => (
        <ChainCard key={chain.id} chain={chain} />
      ))}
    </Grid>
  )
}
