import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Grid, Stack, Box, Group, Flex } from '@/components/layout'
import { H3, P, Muted } from '@/components/ui/typography'
import { MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import type { FavoriteWithSalon } from '../dal/favorites.queries'
import { FavoriteButton } from './favorite-button'

interface FavoritesListProps {
  favorites: FavoriteWithSalon[]
}

export function FavoritesList({ favorites }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box py="2xl" className="text-center">
            <Stack gap="md">
              <Muted>No favorite salons yet</Muted>
              <P>Start exploring salons and save your favorites for quick access</P>
              <Button asChild>
                <Link href="/salons">Browse Salons</Link>
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {favorites.map((favorite) => {
        const salon = favorite.salon

        if (!salon) return null

        return (
          <Card key={favorite.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted" />
              <Box p="md">
                <Stack gap="md">
                  <Stack gap="xs">
                    <H3>{salon.name}</H3>
                    {salon.business_name && (
                      <Group gap="xs" align="center">
                        <MapPin className="h-4 w-4" />
                        <Muted className="text-sm">{salon.business_name}</Muted>
                      </Group>
                    )}
                  </Stack>

                  {salon.description && (
                    <P className="line-clamp-2">{salon.description}</P>
                  )}

                  <Group gap="xs" align="center">
                    {salon.status && (
                      <Badge variant="secondary">{salon.status}</Badge>
                    )}
                  </Group>

                  <Group gap="xs">
                    <Button asChild className="flex-1">
                      <Link href={`/salons/${salon.slug}`}>View Details</Link>
                    </Button>
                    <FavoriteButton salonId={salon.id || ''} initialFavorited={true} variant="icon" />
                  </Group>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        )
      })}
    </Grid>
  )
}
