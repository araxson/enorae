import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { getUserFavorites } from './api/queries'
import { FavoritesList } from './components/favorites-list'

// Export types
export type * from './types'

export const favoritesMetadata = genMeta({
  title: 'My Favorites',
  description: 'View and manage your favorite salons',
  noIndex: true,
})

export async function Favorites() {
  const favorites = await getUserFavorites()

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="leading-7">Quick access to your favorite salons and services</p>
        </div>

        <FavoritesList favorites={favorites} />
      </div>
    </div>
  )
}

export function FavoritesFeature() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Favorites />
    </Suspense>
  )
}
