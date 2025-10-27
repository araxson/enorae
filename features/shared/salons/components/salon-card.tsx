import type { ReactNode } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu'
import { MapPin, Star, Share2, Info, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  AmenitiesBadges,
  SpecialtiesTags,
  SalonStats,
} from '@/features/shared/customer-common/components'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

export interface SalonCardProps {
  salonId?: string
  name: string
  description?: string
  image?: string
  location: string
  rating?: number
  reviewCount?: number
  isFavorite?: boolean
  hours?: string
  isAcceptingBookings?: boolean
  amenities?: string[] | null
  specialties?: string[] | null
  staffCount?: number | null
  servicesCount?: number | null
  onBook: () => void
  onViewDetails?: () => void
  onShare?: () => void
  className?: string
  favoriteAction?: ReactNode
}

export function SalonCard({
  salonId,
  name,
  description,
  image,
  location,
  rating,
  reviewCount,
  isFavorite = false,
  hours,
  isAcceptingBookings = true,
  amenities,
  specialties,
  staffCount,
  servicesCount,
  onBook,
  onViewDetails,
  onShare,
  className,
  favoriteAction,
}: SalonCardProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card className={cn('w-full overflow-hidden', className)}>
          {image && (
            <div className="aspect-video w-full overflow-hidden bg-muted relative">
              <Image src={image} alt={name} fill className="object-cover" />
            </div>
          )}

          <CardHeader>
            <ItemGroup className="gap-3">
              <Item variant="muted">
                <ItemContent>
                  <CardTitle>{name}</CardTitle>
                </ItemContent>
              </Item>
              {rating !== undefined && (
                <Item variant="muted">
                  <ItemMedia variant="icon">
                    <Star className="h-4 w-4 text-accent" fill="currentColor" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{rating.toFixed(1)}</ItemTitle>
                    {reviewCount !== undefined && (
                      <ItemDescription>({reviewCount} reviews)</ItemDescription>
                    )}
                  </ItemContent>
                </Item>
              )}
            </ItemGroup>
          </CardHeader>

          <CardContent>
            <ItemGroup className="gap-3">
              {description && (
                <Item variant="muted">
                  <ItemContent>
                    <ItemDescription>{description}</ItemDescription>
                  </ItemContent>
                </Item>
              )}
              <Item variant="muted">
                <ItemMedia variant="icon">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>{location}</ItemDescription>
                </ItemContent>
              </Item>
              {hours && (
                <Item variant="muted">
                  <ItemMedia variant="icon">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemDescription>{hours}</ItemDescription>
                  </ItemContent>
                </Item>
              )}
              <SalonStats staffCount={staffCount} servicesCount={servicesCount} />
              <SpecialtiesTags specialties={specialties || null} limit={3} />
              <AmenitiesBadges amenities={amenities || null} limit={3} />
            </ItemGroup>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <ButtonGroup className="w-full items-stretch">
              <Button
                className="flex-1"
                onClick={onBook}
                disabled={!isAcceptingBookings}
              >
                {isAcceptingBookings ? 'Book Appointment' : 'Not Accepting Bookings'}
              </Button>
              {favoriteAction ?? null}
            </ButtonGroup>
          </CardFooter>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={onBook}>
          <Calendar className="mr-2 h-4 w-4" />
          Book Appointment
        </ContextMenuItem>
        {onViewDetails && (
          <ContextMenuItem onClick={onViewDetails}>
            <Info className="mr-2 h-4 w-4" />
            View Details
          </ContextMenuItem>
        )}
        {onShare && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
