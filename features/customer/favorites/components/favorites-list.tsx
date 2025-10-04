import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Grid, Stack, Box, Group } from '@/components/layout'
import { H3, P, Muted } from '@/components/ui/typography'
import { MapPin, StickyNote } from 'lucide-react'
import Link from 'next/link'
import type { FavoriteWithSalon } from '../api/queries'
import { FavoriteButton } from './favorite-button'
import { FavoriteNotesButton } from './favorite-notes-button'

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
                <Link href="/customer/salons">Browse Salons</Link>
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

                  {favorite.notes && (
                    <Box p="sm" className="bg-muted/50 rounded-md">
                      <Stack gap="xs">
                        <Group gap="xs" align="center">
                          <StickyNote className="h-3 w-3 text-muted-foreground" />
                          <Muted className="text-xs font-medium">My Notes</Muted>
                        </Group>
                        <P className="text-sm italic">{favorite.notes}</P>
                      </Stack>
                    </Box>
                  )}

                  <Group gap="xs" align="center">
                    {salon.status && (
                      <Badge variant="secondary">{salon.status}</Badge>
                    )}
                  </Group>

                  <Group gap="xs">
                    <Button asChild className="flex-1">
                      <Link href={`/customer/salons/${salon.slug}`}>View Details</Link>
                    </Button>
                    <FavoriteNotesButton
                      salonId={salon.id || ''}
                      salonName={salon.name || ''}
                      initialNotes={favorite.notes}
                    />
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
