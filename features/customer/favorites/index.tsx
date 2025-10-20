import { getUserFavorites } from './api/queries'
import { FavoritesList } from './components/favorites-list'

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
