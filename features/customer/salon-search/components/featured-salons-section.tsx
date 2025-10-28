'use client'

import { Sparkles } from 'lucide-react'
import type { SalonSearchResult } from '@/features/customer/salon-search/api/queries'
import { SalonCard } from './salon-card'
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'

interface FeaturedSalonsSectionProps {
  featuredSalons: SalonSearchResult[]
  searchTerm: string
}

export function FeaturedSalonsSection({
  featuredSalons,
  searchTerm,
}: FeaturedSalonsSectionProps) {
  if (featuredSalons.length === 0 || searchTerm) {
    return null
  }

  return (
    <div>
      <ItemGroup className="mb-4 items-center gap-2">
        <Item className="items-center gap-2">
          <ItemMedia variant="icon">
            <Sparkles className="size-5 text-accent" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Featured Salons</ItemTitle>
          </ItemContent>
        </Item>
      </ItemGroup>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featuredSalons.map((salon) => (
          <SalonCard key={salon.id} salon={salon} variant="featured" />
        ))}
      </div>
    </div>
  )
}
