'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toggleFavorite } from '@/features/customer/favorites/api/mutations'
import { Spinner } from '@/components/ui/spinner'

interface FavoriteButtonProps {
  salonId: string
  initialFavorited?: boolean
  variant?: 'default' | 'icon'
}

export function FavoriteButton({ salonId, initialFavorited = false, variant = 'default' }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    const result = await toggleFavorite(salonId)

    if (!result.success) {
      toast.error(result.error)
    } else {
      const nextFavorited = result.data.favorited
      setFavorited(nextFavorited)
      toast.success(nextFavorited ? 'Added to favorites' : 'Removed from favorites')
    }

    setLoading(false)
  }

  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={favorited ? 'default' : 'outline'}
              onClick={handleToggle}
              disabled={loading}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {loading ? (
                <Spinner className="size-4" />
              ) : (
                <Heart className={favorited ? 'fill-current' : ''} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{favorited ? 'Remove from favorites' : 'Add to favorites'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={favorited ? 'default' : 'outline'}
            onClick={handleToggle}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="size-4" />
                <span>Updating</span>
              </>
            ) : (
              <>
                <Heart className={favorited ? 'fill-current' : ''} />
                <span>{favorited ? 'Favorited' : 'Add to Favorites'}</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{favorited ? 'Click to remove from your favorites' : 'Click to add to your favorites'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
