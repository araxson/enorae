import type { ReactNode } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu'
import { Stack, Group } from '@/components/layout'
import { MapPin, Star, Share2, Info, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  AmenitiesBadges,
  SpecialtiesTags,
  SalonStats,
} from '@/features/shared/customer-common/components'

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
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <CardHeader>
        <Stack gap="sm">
          <CardTitle>{name}</CardTitle>
          {rating !== undefined && (
            <Group gap="xs">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <small className="text-sm font-medium leading-none font-medium">{rating.toFixed(1)}</small>
              {reviewCount !== undefined && (
                <small className="text-sm font-medium leading-none text-muted-foreground">
                  ({reviewCount} reviews)
                </small>
              )}
            </Group>
          )}
        </Stack>
      </CardHeader>

      <CardContent>
        <Stack gap="sm">
          {description && (
            <p className="leading-7 text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          <Group gap="xs">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <small className="text-sm font-medium leading-none text-muted-foreground">{location}</small>
          </Group>
          {hours && (
            <Group gap="xs">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <small className="text-sm font-medium leading-none text-muted-foreground">{hours}</small>
            </Group>
          )}
          <SalonStats staffCount={staffCount} servicesCount={servicesCount} />
          <SpecialtiesTags specialties={specialties || null} limit={3} />
          <AmenitiesBadges amenities={amenities || null} limit={3} />
        </Stack>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Group gap="sm" className="w-full">
          <Button
            className="flex-1"
            onClick={onBook}
            disabled={!isAcceptingBookings}
          >
            {isAcceptingBookings ? 'Book Appointment' : 'Not Accepting Bookings'}
          </Button>
          {favoriteAction ?? null}
        </Group>
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
