import Link from 'next/link'
import { MapPin, StickyNote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
        <CardContent className="space-y-4 py-16 text-center">
          <p className="text-sm text-muted-foreground">No favorite salons yet</p>
          <p className="leading-7 text-sm text-muted-foreground">
            Start exploring salons and save your favorites for quick access.
          </p>
          <Button asChild>
            <Link href="/customer/salons">Browse salons</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {favorites.map((favorite) => {
        const salon = favorite.salon

        if (!salon) return null

        return (
          <Card key={favorite.id} className="overflow-hidden">
            <div className="aspect-video w-full bg-muted" />
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{salon.name || 'Unnamed salon'}</h3>
                {salon.full_address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm text-muted-foreground text-sm">
                      {salon.full_address}
                    </p>
                  </div>
                )}
              </div>

              {favorite.notes && (
                <div className="space-y-2 rounded-md bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <StickyNote className="h-3 w-3" />
                    <p className="text-sm text-muted-foreground text-xs font-medium">My notes</p>
                  </div>
                  <p className="leading-7 text-sm italic">{favorite.notes}</p>
                </div>
              )}

              <Badge variant="secondary" className="w-fit capitalize">
                {salon.is_accepting_bookings ? 'Accepting bookings' : 'Not accepting bookings'}
              </Badge>

              <div className="flex flex-wrap items-center gap-2">
                <Button asChild className="flex-1 min-w-[140px]">
                  <Link href={`/customer/salons/${salon.slug}`}>View details</Link>
                </Button>
                <FavoriteNotesButton
                  salonId={salon.id || ''}
                  salonName={salon.name || ''}
                  initialNotes={favorite.notes}
                />
                <FavoriteButton
                  salonId={salon.id || ''}
                  initialFavorited
                  variant="icon"
                />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
