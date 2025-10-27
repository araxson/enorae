'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Building2 } from 'lucide-react'
import { ChainCard } from './chain-card'
import type { Database } from '@/lib/types/database.types'
import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type SalonChain = Database['public']['Views']['salon_chains_view']['Row']

interface ChainsListProps {
  chains: SalonChain[]
}

export function ChainsList({ chains }: ChainsListProps) {
  if (chains.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <Empty>
            <EmptyMedia variant="icon">
              <Building2 className="h-6 w-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No salon chains yet</EmptyTitle>
              <EmptyDescription>
                You haven't followed any salon chains. Explore salons to discover popular chains.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/customer/salons">Browse salons</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
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
