import Link from 'next/link'
import { Grid, Stack, Box } from '@/components/layout'
import { SalonCard } from '@/features/shared/salons'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']

interface CategorySalonsProps {
  salons: Salon[]
  categoryName: string
}

export function CategorySalons({ salons, categoryName }: CategorySalonsProps) {
  if (salons.length === 0) {
    return (
      <Box className="text-center py-12">
        <Stack gap="md">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">No salons found</h3>
          <p className="text-sm text-muted-foreground">No salons currently offer {categoryName} services</p>
        </Stack>
      </Box>
    )
  }

  return (
    <Stack gap="md">
      <p className="text-sm text-muted-foreground">
        {salons.length} salon{salons.length !== 1 ? 's' : ''} offering {categoryName}
      </p>
      <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
        {salons.map((salon) => {
          const location = [salon.city, salon.state_province].filter(Boolean).join(', ') ||
            'Location not specified'

          return (
            <SalonCard
              key={salon.id}
              salonId={salon.id || undefined}
              name={salon.name || 'Unnamed Salon'}
              description={salon.short_description || salon.description || undefined}
              image={salon.cover_image_url || salon.logo_url || undefined}
              location={location}
              rating={salon.rating || undefined}
              reviewCount={salon.review_count || undefined}
              hours={undefined}
              onBook={() => {
                window.location.href = `/salons/${salon.slug}`
              }}
              onViewDetails={() => {
                window.location.href = `/salons/${salon.slug}`
              }}
              onShare={() => {
                if (navigator.share) {
                  navigator.share({
                    title: salon.name || 'Salon',
                    text: salon.short_description || salon.description || '',
                    url: `/salons/${salon.slug}`,
                  })
                } else {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/salons/${salon.slug}`
                  )
                }
              }}
            />
          )
        })}
      </Grid>
    </Stack>
  )
}
