import { SalonCard } from '@/features/shared/salons'
import type { Database } from '@/lib/types/database.types'
import Link from 'next/link'

type Salon = Database['public']['Views']['salons_view']['Row']

interface SalonGridProps {
  salons: Salon[]
}

export function SalonGrid({ salons }: SalonGridProps) {
  if (salons.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col gap-4">
          <h3 className="scroll-m-20">No salons found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters to find more results</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">{salons.length} salon{salons.length !== 1 ? 's' : ''} found</p>
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
    </div>
  )
}
