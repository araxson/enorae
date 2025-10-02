'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toggleFavorite } from '../actions/favorites.actions'

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

    if (result.error) {
      console.error(result.error)
    } else if (result.success) {
      setFavorited(result.favorited || false)
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
              <Heart className={favorited ? 'fill-current' : ''} />
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
            <Heart className={favorited ? 'fill-current mr-2' : 'mr-2'} />
            {loading ? 'Loading...' : favorited ? 'Favorited' : 'Add to Favorites'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{favorited ? 'Click to remove from your favorites' : 'Click to add to your favorites'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
