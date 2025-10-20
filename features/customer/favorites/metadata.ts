import { generateMetadata as genMeta } from '@/lib/metadata'

export const favoritesMetadata = genMeta({
  title: 'My Favorites',
  description: 'View and manage your favorite salons',
  noIndex: true,
})
