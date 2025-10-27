'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import { SalonCard } from '@/features/shared/salons'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons_view']['Row']

interface SalonGridProps {
  salons: Salon[]
}

export function SalonGrid({ salons }: SalonGridProps) {
  if (salons.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No salons found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search filters to find more results.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline">
            <Link href="/salons">Explore salons</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <ItemGroup className="gap-4">
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>
            {salons.length} salon{salons.length !== 1 ? 's' : ''} found
          </ItemDescription>
        </ItemContent>
      </Item>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {salons.map((salon) => {
          const location = [salon['city'], salon['state_province']]
            .filter(Boolean)
            .join(', ') || 'Location not specified'

          return (
            <SalonCard
              key={salon['id']}
              salonId={salon['id'] || undefined}
              name={salon['name'] || 'Unnamed Salon'}
              description={salon['short_description'] || undefined}
              image={undefined}
              location={location}
              rating={salon['rating_average'] || undefined}
              reviewCount={salon['rating_count'] || undefined}
              hours={undefined}
              onBook={() => {
                // Public directory - redirect to sign up or detail page
                window.location.href = `/salons/${salon['slug']}`
              }}
              onViewDetails={() => {
                window.location.href = `/salons/${salon['slug']}`
              }}
              onShare={() => {
                if (navigator.share) {
                  navigator.share({
                    title: salon['name'] || 'Salon',
                    text: salon['short_description'] || '',
                    url: `/salons/${salon['slug']}`,
                  })
                } else {
                  // Fallback: copy to clipboard
                  navigator.clipboard.writeText(`${window.location.origin}/salons/${salon['slug']}`)
                }
              }}
            />
          )
        })}
      </div>
    </ItemGroup>
  )
}
