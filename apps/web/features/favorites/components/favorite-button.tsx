'use client'

import { Heart } from 'lucide-react'
import { Button } from '@enorae/ui'
import { toggleFavorite } from '../actions/favorites.actions'

interface FavoriteButtonProps {
  salonId: string
  isFavorited: boolean
}

export function FavoriteButton({ salonId, isFavorited }: FavoriteButtonProps) {
  return (
    <form action={() => toggleFavorite(salonId)}>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="hover:text-red-500"
      >
        <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
      </Button>
    </form>
  )
}