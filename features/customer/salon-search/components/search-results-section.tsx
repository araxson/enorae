'use client'

import { TrendingUp, Search } from 'lucide-react'
import type { SalonSearchResult } from '@/features/customer/salon-search/api/queries'
import { SalonCard } from './salon-card'
import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'

interface SearchResultsSectionProps {
  results: SalonSearchResult[]
  searchTerm: string
}

export function SearchResultsSection({ results, searchTerm }: SearchResultsSectionProps) {
  if (results.length === 0 && searchTerm) {
    return (
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search className="size-5" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No salons found</EmptyTitle>
              <EmptyDescription>No salons match your filters right now.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <p className="text-sm text-muted-foreground">
                Try searching a nearby city or lowering your rating threshold.
              </p>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div>
      <ItemGroup className="mb-4 items-center gap-2">
        <Item className="items-center gap-2">
          <ItemMedia variant="icon">
            <TrendingUp className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Search Results ({results.length})</ItemTitle>
          </ItemContent>
        </Item>
      </ItemGroup>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((salon) => (
          <SalonCard key={salon.id} salon={salon} />
        ))}
      </div>
    </div>
  )
}
