import Link from 'next/link'
import { MapPin, StickyNote } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
        <CardHeader className="items-center space-y-2 text-center">
          <CardTitle>No favorite salons yet</CardTitle>
          <CardDescription>
            Start exploring salons and save your favorites for quick access.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/customer/salons">Browse salons</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {favorites.map((favorite) => {
        const salon = favorite.salon

        if (!salon) return null

        return (
          <Card key={favorite.id}>
            <div className="aspect-video w-full bg-muted" />
            <CardHeader className="space-y-1">
              <CardTitle>{salon.name || 'Unnamed salon'}</CardTitle>
              {salon.full_address ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <CardDescription>{salon.full_address}</CardDescription>
                </div>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-4">
              {favorite.notes ? (
                <Alert>
                  <StickyNote className="h-4 w-4" aria-hidden="true" />
                  <AlertTitle>My notes</AlertTitle>
                  <AlertDescription>{favorite.notes}</AlertDescription>
                </Alert>
              ) : null}

              <Badge variant="secondary" className="w-fit capitalize">
                {salon.is_accepting_bookings ? 'Accepting bookings' : 'Not accepting bookings'}
              </Badge>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center gap-2">
              <Button asChild className="flex-1 min-w-36">
                <Link href={`/customer/salons/${salon.slug}`}>View details</Link>
              </Button>
              <FavoriteNotesButton
                salonId={salon.id || ''}
                salonName={salon.name || ''}
                initialNotes={favorite.notes}
              />
              <FavoriteButton salonId={salon.id || ''} initialFavorited variant="icon" />
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
