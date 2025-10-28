import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'
import { SalonCard } from '@/features/shared/salons'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons_view']['Row']

interface CategorySalonsProps {
  salons: Salon[]
  categoryName: string
}

export function CategorySalons({ salons, categoryName }: CategorySalonsProps) {
  if (salons.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No salons found</EmptyTitle>
          <EmptyDescription>
            No salons currently offer {categoryName} services.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline">
            <Link href="/salons">Browse all salons</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div
      className="group/item-group flex flex-col gap-4"
      data-slot="item-group"
      role="list"
    >
      <Item variant="muted">
        <ItemHeader>
          <ItemTitle>Salons by category</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>
            {salons.length} salon{salons.length !== 1 ? 's' : ''} offering {categoryName}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemHeader>
          <ItemTitle>Visit planning</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>Select a salon to review services in this category and start booking.</ItemDescription>
        </ItemContent>
      </Item>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {salons.map((salon) => {
          const location = [salon['city'], salon['state_province']].filter(Boolean).join(', ') ||
            'Location not specified'

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
                  navigator.clipboard.writeText(
                    `${window.location.origin}/salons/${salon['slug']}`
                  )
                }
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
