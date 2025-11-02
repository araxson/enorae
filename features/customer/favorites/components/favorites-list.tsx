import { memo } from 'react'
import Link from 'next/link'
import { MapPin, StickyNote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { FavoriteWithSalon } from '@/features/customer/favorites/api/queries'
import { FavoriteButton } from './favorite-button'
import { FavoriteNotesButton } from './favorite-notes-button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

interface FavoritesListProps {
  favorites: FavoriteWithSalon[]
}

export const FavoritesList = memo(function FavoritesList({ favorites }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <MapPin className="size-6" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No favorite salons yet</EmptyTitle>
          <EmptyDescription>
            Start exploring salons and save your favorites for quick access.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/customer/salons">Browse salons</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {favorites.map((favorite) => {
        const salon = favorite.salon

        if (!salon) return null

        return (
          <Item key={favorite['id']} variant="outline" className="flex h-full flex-col gap-4">
            <ItemHeader className="items-start gap-3">
              {salon['formatted_address'] ? (
                <ItemMedia variant="icon">
                  <MapPin className="size-4" aria-hidden="true" />
                </ItemMedia>
              ) : null}
              <ItemContent>
                <ItemTitle>{salon['name'] || 'Unnamed salon'}</ItemTitle>
                {salon['formatted_address'] ? (
                  <ItemDescription>{salon['formatted_address']}</ItemDescription>
                ) : null}
              </ItemContent>
            </ItemHeader>
            <ItemContent className="gap-4">
              {favorite['notes'] ? (
                <Alert>
                  <StickyNote className="size-4" aria-hidden="true" />
                  <AlertTitle>My notes</AlertTitle>
                  <AlertDescription>{favorite['notes']}</AlertDescription>
                </Alert>
              ) : null}

              <Item variant="muted" size="sm">
                <ItemContent>
                  <ItemDescription>Booking status</ItemDescription>
                </ItemContent>
                <ItemActions className="flex-none">
                  <Badge variant="secondary">
                    {salon['is_accepting_bookings'] ? 'Accepting bookings' : 'Not accepting bookings'}
                  </Badge>
                </ItemActions>
              </Item>
            </ItemContent>
            <ItemFooter>
              <ButtonGroup aria-label="Favorite actions" orientation="horizontal">
                <Button asChild className="flex-1 min-w-36">
                  <Link href={`/customer/salons/${salon['slug']}`}>View details</Link>
                </Button>
                <FavoriteNotesButton
                  salonId={salon['id'] || ''}
                  salonName={salon['name'] || ''}
                  initialNotes={favorite['notes']}
                />
                <FavoriteButton salonId={salon['id'] || ''} initialFavorited variant="icon" />
              </ButtonGroup>
            </ItemFooter>
          </Item>
        )
      })}
    </div>
  )
})
