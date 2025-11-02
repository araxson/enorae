'use client'

import { useState, useCallback, memo, useEffect, useRef } from 'react'
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

export const FavoriteButton = memo(function FavoriteButton({ salonId, initialFavorited = false, variant = 'default' }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const handleToggle = useCallback(async () => {
    if (!isMountedRef.current) return

    setLoading(true)

    try {
      const result = await toggleFavorite(salonId)

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return

      if (!result.success) {
        toast.error(result.error)
      } else {
        const nextFavorited = result.data.favorited
        setFavorited(nextFavorited)
        toast.success(nextFavorited ? 'Added to favorites' : 'Removed from favorites')
      }
    } catch (error) {
      if (!isMountedRef.current) return
      console.error('[FavoriteButton] Error toggling favorite:', error)
      toast.error('Failed to update favorite. Please try again.')
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [salonId])

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
                <Heart className={favorited ? 'size-4 fill-current' : 'size-4'} />
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
                <Heart className={favorited ? 'size-4 fill-current' : 'size-4'} />
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
})
