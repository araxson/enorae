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
import { MapPin, Star, Share2, Info, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FavoriteButton } from '@/features/customer/favorites/components/favorite-button'
import { P, Small } from '@/components/ui/typography'

export interface SalonCardProps {
  salonId?: string
  name: string
  description?: string
  image?: string
  location: string
  rating?: number
  reviewCount?: number
  isFavorite?: boolean
  onBook: () => void
  onViewDetails?: () => void
  onShare?: () => void
  className?: string
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
  onBook,
  onViewDetails,
  onShare,
  className,
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
              <Small className="font-medium">{rating.toFixed(1)}</Small>
              {reviewCount !== undefined && (
                <Small className="text-muted-foreground">
                  ({reviewCount} reviews)
                </Small>
              )}
            </Group>
          )}
        </Stack>
      </CardHeader>

      <CardContent>
        <Stack gap="sm">
          {description && (
            <P className="text-muted-foreground line-clamp-2">
              {description}
            </P>
          )}
          <Group gap="xs">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Small className="text-muted-foreground">{location}</Small>
          </Group>
        </Stack>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Group gap="sm" className="w-full">
          <Button className="flex-1" onClick={onBook}>
            Book Appointment
          </Button>
          {salonId && (
            <FavoriteButton salonId={salonId} initialFavorited={isFavorite} variant="icon" />
          )}
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
